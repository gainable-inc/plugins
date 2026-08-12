---
name: gainable-setup
description: Guide the user through connecting the Gainable MCP server bundled with this plugin, including the optional consent checkboxes that decide which tools appear.
---

# Connecting Gainable

The plugin registers the connector; signing in is a separate step and happens on first use. If
Gainable tools are missing, that sign-in has not been completed — say so plainly rather than working
around it.

## The consent screen has optional checkboxes, and they decide which tools exist

Both are **off by default, and that is the right default.** Building apps, changing them, publishing
and sharing all work with neither ticked.

- **"Also let it write code in your apps"** — grants the `code` scope, adding `code_context` and
  `code_push`. Only needed if the user wants Claude authoring views, routes and models directly
  instead of asking Gainable to make the change.
- **"Also let it add and manage people on the account"** — grants the `users` scope, adding
  `account_users`. This one sends invitation emails and can spend a paid builder seat, so it is
  offered only to someone who could already do that in Gainable. If the checkbox is not shown, the
  signed-in person does not have the "Add and manage users" permission on that account.

If more than one Gainable account is available, the picker chooses which account this connection
acts on. That decides where apps land, so ask rather than picking.

## If the Gainable tools appear twice

The connectors on someone's claude.ai account surface here too, so a user who added Gainable under
**Connectors** and then installed this plugin has two connections to the same server under different
tool names. A tool name does not say which server it reaches, so this looks exactly like a genuine
staging/production pair, and the rule to ask which connector to use fires on every build.

Name what has happened and have them turn one off — the plugin's registration under `/mcp`, or the
connector on claude.ai, whichever they use less. Do not settle it by quietly picking one.

## If a tool is missing later

A missing `code_push` or `account_users` is almost always an ungranted scope, not a broken install.
Both can be turned on afterwards at **/account/connections** in Gainable — no need to disconnect and
reconnect.

## Pointing somewhere other than production

The bundled registration is `https://build.gainable.dev/mcp`. For staging or a self-hosted instance,
add that server separately; this plugin's skill applies to it just the same.
