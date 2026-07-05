#!/usr/bin/env python3
"""Detect a web app's stack, package manager, and run commands.

Usage: python3 detect_stack.py <app-root>

Reports (as human-readable text + a JSON blob) the detected framework,
package manager, dev/preview/build/test commands, and likely route/page
locations, by reading package.json and scanning the file tree. It never
runs anything — it only reads files.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# Framework detection: dependency name -> friendly framework label.
FRAMEWORK_DEPS = {
    "next": "Next.js",
    "nuxt": "Nuxt",
    "@remix-run/react": "Remix",
    "@sveltejs/kit": "SvelteKit",
    "astro": "Astro",
    "gatsby": "Gatsby",
    "@angular/core": "Angular",
    "vue": "Vue",
    "svelte": "Svelte",
    "react": "React",
    "vite": "Vite",
}

# Where routes/pages typically live, per framework.
ROUTE_HINTS = {
    "Next.js": ["app", "src/app", "pages", "src/pages"],
    "Nuxt": ["pages", "app/pages"],
    "Remix": ["app/routes"],
    "SvelteKit": ["src/routes"],
    "Astro": ["src/pages"],
    "Gatsby": ["src/pages"],
    "Angular": ["src/app"],
    "Vue": ["src/views", "src/pages", "src/router"],
    "Svelte": ["src", "src/routes"],
    "React": ["src/pages", "src/routes", "src/views", "src"],
    "Vite": ["src/pages", "src/routes", "src"],
}

LOCKFILES = {
    "pnpm-lock.yaml": "pnpm",
    "yarn.lock": "yarn",
    "bun.lockb": "bun",
    "package-lock.json": "npm",
}


def read_package_json(root: Path) -> dict:
    pkg = root / "package.json"
    if not pkg.exists():
        return {}
    try:
        return json.loads(pkg.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def detect_package_manager(root: Path, pkg: dict) -> str:
    for lockfile, mgr in LOCKFILES.items():
        if (root / lockfile).exists():
            return mgr
    pm = pkg.get("packageManager", "")
    for mgr in ("pnpm", "yarn", "bun", "npm"):
        if pm.startswith(mgr):
            return mgr
    return "npm"


def detect_framework(pkg: dict) -> str:
    deps = {}
    deps.update(pkg.get("dependencies", {}) or {})
    deps.update(pkg.get("devDependencies", {}) or {})
    for dep, label in FRAMEWORK_DEPS.items():
        if dep in deps:
            return label
    return "Unknown / plain SPA"


def run_cmd(mgr: str, script: str) -> str:
    if mgr == "npm":
        return f"npm run {script}"
    return f"{mgr} {script}"


def pick_script(scripts: dict, *candidates: str) -> str | None:
    for name in candidates:
        if name in scripts:
            return name
    return None


def find_route_dirs(root: Path, framework: str) -> list[str]:
    found = []
    for rel in ROUTE_HINTS.get(framework, ["src"]):
        if (root / rel).is_dir():
            found.append(rel)
    return found


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python3 detect_stack.py <app-root>", file=sys.stderr)
        return 2

    root = Path(sys.argv[1]).resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 2

    pkg = read_package_json(root)
    scripts = pkg.get("scripts", {}) or {}
    mgr = detect_package_manager(root, pkg)
    framework = detect_framework(pkg)

    dev = pick_script(scripts, "dev", "start", "serve")
    preview = pick_script(scripts, "preview", "start", "serve")
    build = pick_script(scripts, "build")
    test = pick_script(scripts, "test:e2e", "e2e", "test")

    route_dirs = find_route_dirs(root, framework)

    report = {
        "appRoot": str(root),
        "framework": framework,
        "packageManager": mgr,
        "commands": {
            "dev": run_cmd(mgr, dev) if dev else None,
            "preview": run_cmd(mgr, preview) if preview else None,
            "build": run_cmd(mgr, build) if build else None,
            "test": run_cmd(mgr, test) if test else None,
        },
        "availableScripts": sorted(scripts.keys()),
        "likelyRouteDirs": route_dirs,
    }

    print("=== Stack detection ===")
    print(f"App root:         {report['appRoot']}")
    print(f"Framework:        {framework}")
    print(f"Package manager:  {mgr}")
    print("Commands:")
    for key, val in report["commands"].items():
        print(f"  {key:8} {val or '(not found)'}")
    print(f"Likely routes in: {', '.join(route_dirs) or '(none found — read the code)'}")
    print(f"Scripts:          {', '.join(report['availableScripts']) or '(none)'}")
    print()
    print("=== JSON ===")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
