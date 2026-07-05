# Claude Marketplace

A [Claude Code plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces).

It ships one plugin, `skills`, which bundles all the skills. The first skill is
autonomous, adversarial UX/QA testing.

## Repository layout

```
.
├── .claude-plugin/
│   └── marketplace.json         # marketplace manifest — lists the plugins
├── plugins/
│   └── skills/                  # the skills plugin
│       ├── .claude-plugin/
│       │   └── plugin.json      # plugin manifest
│       └── skills/
│           └── ux-testing/      # first skill
│               ├── SKILL.md
│               ├── scripts/     # detect_stack.py, wait_for_server.sh
│               ├── references/  # app-analysis, flow-discovery, playwright-setup, fix-loop
│               └── assets/      # playwright.config.ts
└── README.md
```

## Plugins

### `skills`

A collection of skills for Claude Code.

| Skill | What it does |
|-------|--------------|
| `ux-testing` | Autonomously maps a web app's user flows, drives a real browser with Playwright, adversarially tries to break each flow, files a fix task per bug, dispatches a fixing agent per task, and re-runs each flow until it passes. |

## Install

Add this marketplace and install the plugin:

```bash
/plugin marketplace add guuse/claude-marketplace
/plugin install skills@claude-marketplace
```

(Or `/plugin marketplace add .` from a local clone.)

Once installed, the `ux-testing` skill triggers automatically on requests like
"test my app", "find the bugs", "try to break it", or "QA this" — or invoke it
directly with `/skills:ux-testing`.

## Adding more skills

Drop a new `skills/<name>/SKILL.md` under `plugins/skills/skills/` (with optional
`scripts/`, `references/`, `assets/` alongside it). It's discovered automatically —
no manifest change needed. To add a whole new plugin, create
`plugins/<name>/.claude-plugin/plugin.json` and add an entry to
`.claude-plugin/marketplace.json`.
