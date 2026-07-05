# ALM Marketplace

A [Claude Code plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces)
for **Application Lifecycle Management (ALM)** tooling.

It currently ships one plugin, `alm`, which bundles skills for the build → test →
ship lifecycle. The first skill is autonomous, adversarial UX/QA testing.

## Repository layout

```
.
├── .claude-plugin/
│   └── marketplace.json         # marketplace manifest — lists the plugins
├── plugins/
│   └── alm/                     # the ALM plugin
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

### `alm`

Application Lifecycle Management skills for Claude Code.

| Skill | What it does |
|-------|--------------|
| `ux-testing` | Autonomously maps a web app's user flows, drives a real browser with Playwright, adversarially tries to break each flow, files a fix task per bug, dispatches a fixing agent per task, and re-runs each flow until it passes. |

## Install

Add this marketplace and install the plugin:

```bash
/plugin marketplace add guuse/claude-marketplace
/plugin install alm@alm-marketplace
```

(Or `/plugin marketplace add .` from a local clone.)

Once installed, the `ux-testing` skill triggers automatically on requests like
"test my app", "find the bugs", "try to break it", or "QA this" — or invoke it
directly with `/alm:ux-testing`.

## Adding more skills

Drop a new `skills/<name>/SKILL.md` under `plugins/alm/skills/` (with optional
`scripts/`, `references/`, `assets/` alongside it). It's discovered automatically —
no manifest change needed. To add a whole new plugin, create
`plugins/<name>/.claude-plugin/plugin.json` and add an entry to
`.claude-plugin/marketplace.json`.
