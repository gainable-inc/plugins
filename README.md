# Gainable plugins

Harness steering for [Gainable](https://gainable.com) — install one of these and your agent knows
how to drive the Gainable connector before its first turn.

Gainable turns data into a working web app. The app is generated and hosted on Gainable's servers,
and everything happens through the **MCP connector** — there is no local codebase to edit and no CLI
to install. What lives here is the part the connector *cannot* deliver: guidance that has to be in
front of the model before it picks a tool.

## Which one do I install?

| You're using | Install | Brings the connector? |
|---|---|---|
| **Claude Cowork** | the plugin | yes |
| **Claude Code** | the plugin | yes |
| **Claude Chat** (web, desktop) | the Skill | no — add the connector separately |
| **Codex** | the plugin | yes |

Plugins are not used in Claude Chat, which is the only reason the Skill exists as a separate thing.
Everywhere else, the plugin is one step and brings the connector with it.

## Claude Cowork

**Customize** in the sidebar → **Plugins** → **Add marketplace** → `gainable-inc/plugins` →
**Install**. You'll be prompted to sign in to Gainable, because the plugin bundles the connector.

## Claude Code

```
/plugin marketplace add gainable-inc/plugins
/plugin install gainable@gainable
```

Restart, then `/mcp` to sign in. Same package as Cowork — plugins share one format across both.

## Already added Gainable under Connectors?

Then turn one of the two off. Claude Code and Cowork both surface the connectors on your claude.ai
account, and the plugin's own registration sits alongside them — two connections to the same server,
each with its own sign-in to keep alive.

Left as-is it is more than clutter. The tools appear twice under different names, and a tool name
says nothing about which server it reaches, so this is indistinguishable from a real staging/production
pair — which is exactly the case the skill is told to resolve by asking. You get that question before
every build, about a difference that isn't there.

## Claude Chat (web, desktop)

Upload `skill/gainable-skill.zip` at [claude.ai/customize/skills](https://claude.ai/customize/skills)
— **+** → **Create skill** → **Upload a skill** — and check its toggle is on.

This carries the guidance only. Add the Gainable connector to Claude separately, under Connectors.

## Codex

```
/plugin marketplace add https://github.com/gainable-inc/plugins
/plugin install gainable
```

One step; the connector is bundled. Sign-in happens on first use, and Codex asks you to trust the
session hook before it runs. See `codex/README.md`.

## Connecting to something other than production

The bundled registration points at `https://build.gainable.dev/mcp`. For staging, or a self-hosted
instance, add that one yourself — the steering applies to it just the same:

```
claude mcp add --transport http gainable-staging https://staging-build.gainable.dev/mcp
```

## What's in here

```
.claude-plugin/marketplace.json   Claude Code + Cowork marketplace
.agents/plugins/marketplace.json  Codex marketplace
gainable/                         plugin for Claude Code and Cowork
codex/                            plugin for Codex
skill/gainable/                   Claude Chat Skill source
skill/gainable-skill.zip          …packed for upload (built, not edited)
```

### The two `.mcp.json` files are not the same shape — do not unify them

`gainable/.mcp.json` (Claude Code / Cowork) wraps the server map in `mcpServers`:

```json
{ "mcpServers": { "gainable": { "type": "http", "url": "…" } } }
```

`codex/.mcp.json` is the bare map, referenced by `"mcpServers": "./.mcp.json"` in its manifest:

```json
{ "gainable": { "type": "http", "url": "…", "auth": "oauth" } }
```

Give Codex the wrapped form and it registers a server literally named `mcpServers`. Both runtimes
**ignore unrecognised keys silently**, so a mistake here does not error — it just quietly fails to
connect.

`SKILL.md` is **generated**, not edited here. It is written by `scripts/release-plugins.js` in the
Gainable engine repo, from a single source, so the copies cannot drift from each other or from the
connector's own fallback brief. Each release records the revision it came from in `SOURCE_SHA`.

`SETUP.md` guides Claude through the connect step, including the optional consent checkboxes that
decide which tools appear.

## Before shipping a change

```
claude plugin validate .
claude plugin validate ./gainable --strict
```

## Contributing

Open an issue. Changes to the skill text belong in the engine repo, not here — an edit made directly
to a copy is overwritten by the next release.
