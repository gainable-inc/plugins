# Gainable for Codex

Drive [Gainable](https://gainable.com) from Codex. The work happens server-side through the Gainable
MCP connector — there is no local codebase to edit. This plugin registers that connector and
supplies the steering that has to be in front of the model before it picks a tool.

## Install

```
/plugin marketplace add https://github.com/gainable-inc/plugins
/plugin install gainable
```

That is the whole setup. The connector is bundled (`.mcp.json`), so there is no
`~/.codex/config.toml` to edit.

**Signing in** happens on first use, not at install — the marketplace entry sets
`policy.authentication: "ON_USE"` deliberately, so installing this grants nothing until you
authenticate. Ask for something that needs it (*"list my Gainable apps"*) and complete the sign-in
when prompted.

**The session hook needs trusting.** Codex skips plugin hooks until you review and trust them, so
the one-line project orientation will not appear until you do. Nothing else depends on it.

## Pointing at staging, or a self-hosted instance

The bundled registration is production, and Codex has no way to change its URL — it does not expand
environment variables in a remote `url`, and user config can only switch a plugin's server on or
off. To use another instance, add it in `~/.codex/config.toml` yourself:

```toml
[mcp_servers.gainable-staging]
url = "https://staging-build.gainable.dev/mcp"
auth = "oauth"
```

To use *only* that instance, also switch the bundled one off in the same file, so the model never
has two Gainable connectors to choose between:

```toml
[plugins."gainable@gainable".mcp_servers.gainable]
enabled = false
```

Writing that file does **not** start the OAuth flow. Trigger it explicitly:

```
codex mcp login gainable-staging
```

(`[mcp_servers.<name>]` covers both transports — `url` selects Streamable HTTP, `command`/`args`
selects stdio. `auth = "oauth"` is the default for HTTP servers and is spelled out here only for
clarity.)

## What's in here

- `.mcp.json` — the connector registration.
- `skills/gainable/SKILL.md` — which tool to reach for, how to relay the connector's questions back
  to you unanswered, and the handful of rules that decide whether the app comes out right.
- `hooks/session-start.js` — prints one line when the folder has a `.gaia/project.json`, so the
  session starts knowing which app it is about. Silent everywhere else. Discovered automatically
  from `hooks/hooks.json`, so the manifest does not declare it.

`SKILL.md` is generated from the Gainable engine repo — edits here are overwritten by the next
release. See `SOURCE_SHA` at the repo root for the revision it came from.
