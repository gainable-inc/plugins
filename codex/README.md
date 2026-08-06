# Gainable for Codex

Steering for driving [Gainable](https://gainable.com) from Codex. The work happens server-side
through the Gainable MCP connector; this plugin supplies the guidance that has to be in front of the
model before it picks a tool, plus a session-start hook that says which Gainable project the current
folder belongs to.

## Install

```
/plugin marketplace add https://github.com/gainable-inc/plugins
/plugin install gainable
```

## You also need the connector

**This plugin does not register the MCP server.** The Claude Code plugin does, via a `.mcp.json` the
format supports; whether the Codex plugin format has an equivalent has **not been verified**, so
rather than ship a key that might be silently ignored, the connector is added by hand:

```toml
# ~/.codex/config.toml
[mcp_servers.gainable]
url = "https://build.gainable.dev/mcp"
```

Restart Codex, then run something that needs it — *"list my Gainable apps"* — and complete the
sign-in when prompted.

For staging or a self-hosted instance, use that host instead:
`https://staging-build.gainable.dev/mcp`.

> If you know the Codex plugin format can declare an MCP server, that is worth fixing — open an
> issue. The instructions above are written the long way because they are known to work, not because
> the short way was ruled out.

## What's in here

- `skills/gainable/SKILL.md` — which tool to reach for, how to relay the connector's questions back
  to you unanswered, and the handful of rules that decide whether the app comes out right.
- `hooks/session-start.js` — prints one line when the folder has a `.gaia/project.json`, so the
  session starts knowing which app it is about. Silent everywhere else.

`SKILL.md` is generated from the Gainable engine repo — edits here are overwritten by the next
release. See `SOURCE_SHA` at the repo root for the revision it came from.
