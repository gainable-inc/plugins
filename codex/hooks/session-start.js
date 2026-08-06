#!/usr/bin/env node
/**
 * Gainable plugin — SessionStart hook.
 *
 * This is the one thing the MCP server cannot do for itself. A server's
 * `instructions` string is advisory metadata that arrives alongside everything
 * else; this runs BEFORE the first turn and its output becomes session context.
 * So it carries exactly one fact — which Gainable project this folder is for —
 * and leaves every other rule to the skill and the tool descriptions.
 *
 * Why that fact and no other: the connector remembers the "active" app per
 * ACCOUNT, not per conversation, so a second folder on the same account
 * inherits the first one's app unless something says otherwise. Acting on the
 * wrong app looks exactly like success. `.gaia/project.json` is what settles
 * it, and knowing it up front saves a wrong first call rather than an
 * apologetic second one.
 *
 * SILENT outside a Gainable folder — a plugin that prints on every session in
 * every directory gets uninstalled. Silent on error too: nothing here is worth
 * disrupting a session for.
 */

const fs = require('fs');
const path = require('path');

try {
  const anchor = path.join(process.cwd(), '.gaia', 'project.json');
  if (!fs.existsSync(anchor)) process.exit(0);

  const p = JSON.parse(fs.readFileSync(anchor, 'utf8'));
  if (!p || !p.projectId) process.exit(0);

  const name = p.projectName || p.appName || p.projectId;
  const lines = [
    `This folder is the Gainable project "${name}" (projectId: ${p.projectId}).`,
    'Pass that projectId on every Gainable tool call — the connector remembers the active app per',
    'account, not per conversation, so it will not assume this one.',
  ];

  // A folder anchored to a different server is the expensive mistake: the
  // tools are connected to one account and the folder belongs to another, and
  // nothing notices until an app has been built in the wrong place.
  if (p.apiBase) {
    lines.push(`It belongs to ${p.apiBase} — if the connected Gainable server is not that one, say so and stop.`);
  }

  process.stdout.write(lines.join(' ') + '\n');
  process.exit(0);
} catch (err) {
  process.stderr.write(`[gainable session-start] ${err.message}\n`);
  process.exit(0);
}
