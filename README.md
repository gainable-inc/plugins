# Gainable plugins

Harness steering for [Gainable](https://gainable.com) — install one of these and your agent knows
how to drive the Gainable connector before its first turn.

Gainable turns data into a working web app. The app is generated and hosted on Gainable's servers,
and everything happens through the **MCP connector** — there is no local codebase to edit and no CLI
to install. What lives here is the part the connector *cannot* deliver: guidance that has to be in
front of the model before it picks a tool.

## Claude Code

```
/plugin marketplace add gainable-inc/plugins
/plugin install gainable@gainable
```

Restart Claude Code, then run `/mcp` and sign in. The plugin registers the connector for you, so
there is no `claude mcp add` step — but nothing is authorised until you complete that sign-in.

Includes the `gainable` skill, a SessionStart hook that tells the session which Gainable project the
folder belongs to, and the MCP server registration.

## Codex

```
/plugin marketplace add https://github.com/gainable-inc/plugins
/plugin install gainable
```

Also one step — the connector is bundled here too. Sign-in happens on first use, and Codex will ask
you to trust the session hook before it runs. See `codex/README.md`.

## Claude (web, desktop, Cowork)

Install the Skill in `skill/`. See `skill/README.md`.

## Connecting to something other than production

The bundled registration points at `https://build.gainable.dev/mcp`. For staging, or a self-hosted
instance, add that one yourself and the skill still applies:

```
claude mcp add --transport http gainable-staging https://staging-build.gainable.dev/mcp
```

## What's in here

```
.claude-plugin/marketplace.json   Claude Code marketplace
.agents/plugins/marketplace.json  Codex marketplace
gainable/                         Claude Code plugin
codex/                            Codex plugin
skill/                            Claude Skill
```

### The two `.mcp.json` files are not the same shape — do not unify them

`gainable/.mcp.json` (Claude Code) wraps the server map in `mcpServers`:

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
Gainable engine repo, from a single source, so the three copies cannot drift from each other or from
the connector's own fallback brief. Each copy carries a `SOURCE_SHA` recording the revision it came
from.

## Contributing

Open an issue. Changes to the skill text belong in the engine repo, not here — an edit made directly
to a copy is overwritten by the next release.
