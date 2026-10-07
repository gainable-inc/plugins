---
name: gainable
description: Use this skill for ANYTHING involving Gaia or Gainable — the same product, also called Gaia Build or Gainable Build. Covers building a new app from an idea or a spreadsheet, changing an existing one (adding fields, fixing views, changing layouts, adjusting behaviour), publishing, sharing, managing who can use an app or the account, and creating or syncing datasets. If someone asks to build with Gaia, this is it. All work happens server-side through the Gainable MCP connector; you relay the user's intent and, crucially, relay the connector's questions back to them unanswered.
---

# Gaia — building apps for someone else

<!-- CANONICAL SOURCE. This is shipped: it is copied into the Claude Code and
     Codex plugins and the Claude Skill by scripts/release-plugins.js, and the
     marked sections below are what generates utils/mcp/instructions.js.

     KEEP IT SHORT. The connector already carries most guidance where it is
     actually read — a tool's `description` when it is being chosen, the `next`
     on the response just received, and the error at the moment of the mistake.
     A line belongs here ONLY if it has to land before any tool is chosen.
     Anything else is duplication that will drift, and a rule that feels missing
     is usually a thin tool description — fix it there. -->

<!-- BEGIN:instructions -->

**Gaia is Gainable's AI system, and this connector is how you drive it.** One product, not two:
Gaia, Gainable, "Gaia Build" and "Gainable Build" all name the same thing. A request naming any of
them is a request for these tools.

Gainable turns data into a working web app. The app is generated and hosted on Gainable's servers;
there is no local codebase to edit. Everything goes through the connector's tools.

Your job is narrower than it looks. The harness does the building. You do three things well:

1. Route the request to the right tool.
2. Relay the questions it asks back to the user, and their answers back to it.
3. Paste the resulting URLs into the chat literally.

Most bad outcomes come from doing more than that.

If more than one Gainable connector is configured (a dev and a production one, say), ask which
before creating anything — that choice decides which account the app lands in.

## Which tool

| Situation | Tool |
|---|---|
| A **new** app — from an idea, a spec, or a spreadsheet | `import` (if there's a file) → `build` |
| Changing an app that is **already built** — add a field, fix a view, change a layout, rename or add a page, fix a bug | `chat` |
| Working with the data itself — what datasets exist, what is in one, creating one, keeping one fresh | `dataset_list` → `dataset_records`, `dataset_schema` → `dataset_sync` |
| Who may open an app, and who is on it | `app_access`, `app_users` |
| Getting someone onto **Gainable itself**, as a builder or an app user | `account_users` |
| Writing the code yourself — **only** when explicitly asked for | `code_context` → `code_push` |

Getting the first row wrong is expensive: `build` runs a whole contract conversation and pipeline,
so reaching for it to add one column wastes minutes and a lot of tokens. Ordinary edit requests are
`chat`, even though they are about app code.

`apps_list` shows what exists; `apps_select` picks one. `import` and `build` set it themselves when
they create a project.

**A spreadsheet is never a spec** — it goes through `import`, never pasted into `build`. A spec
DOCUMENT is the opposite: paste its full text into `build`, because the harness cannot read files
and a path makes it design from generic domain knowledge instead.

The `dataset_*` tools need the `datasets` scope, ticked at consent. If they are not in your list,
that is why — say so rather than reaching for the data another way. `import` does not need it.

## Say which app you mean

Tools that act on an app take a `projectId`, and responses hand you one back. **Carry it forward.**
The "currently active" app is remembered per ACCOUNT on many connections, so another chat's app is
as likely to be there as yours — those connections refuse rather than guess. Your own conversation
is the only thing that knows which app it is about.

**"Build an app from this" always means a NEW app** — even from the same spreadsheet, or one you
imported earlier in this session. Same data is not the same app. `build action:"turn"` takes
`newApp:true` for it.

In a folder, `.gaia/project.json` names the app that folder is for. Read it before the first tool
call if you can, and write the `projectAnchor` block back when a tool returns one. If its `apiBase`
is not this connector's server, ignore the file and say so.

## The ask/reply discipline — this decides build quality

1. **Never answer an ask yourself.** When a tool returns `interactiveOptions`, or an import
   `question`, forward it to the user verbatim and wait. These are subjective choices — layout,
   scope, which field identifies a row. Answering on their behalf produces an app they did not ask
   for and cannot explain.
2. **Never invent asks.** Only forward what literally came back.
3. **One reply at a time, never in parallel.** Each reply changes server-side state and may unlock
   different asks. Send one, read the response, then decide.
4. **Re-read `phase` and `interactiveOptions` after every reply.** A single turn can advance several
   phases. Work from the response, never from your prediction of it.

## Long operations

`build action:"run"` takes 90–180 seconds and `chat` can take over a minute. Either may return
**`outcome:"running"`** — not a failure, not a timeout. Call `action:"status"` to keep watching, as
often as needed (after a reconnect, `chat` also wants the `cursor` its running result carried).

**Never re-run `build action:"run"`, and never re-send a `chat` message, to check on progress.**
Turns keep running server-side regardless of your connection, so a repeat call is not a retry — it
starts duplicate work a human has to clear by hand.

## Surfacing URLs

When a tool returns a URL, **paste it into the chat literally**. "Your app is ready in the launcher"
is not a click target, and never construct one yourself — the only safe URL is the exact string the
tool returned.

## Context only the user has

What they call things, their currency and dates, who uses the apps, what must never be shown — none
of that is knowable from here, and all of it changes what gets built. If a `CLAUDE.md` or project
instructions exist, read them. If not, `project_setup` returns a starter; offer it once, ask before
writing anything, and never overwrite their own writing.

<!-- END:instructions -->

## Forwarding a question

`AskUserQuestion` requires `question`, `header` (≤12 chars), `multiSelect`, and **2–4** `options` —
the wrong shape fails the call outright. With **5 or more** options it rejects, so write a plain
numbered list in the chat and wait for the reply, then map it to the matching option **label** and
send that. If it matches nothing, ask again rather than guessing.

## Author mode

`code_context` and `code_push` let you write the app's code yourself. Use them **only when the user
explicitly asks** — "code it yourself", "write it manually", "without the planner". Ordinary edit
requests belong to `chat` even though they are about app code.

They need the `code` scope, granted by ticking the box at consent. If those tools are not in your
list, that is why; say so rather than working around it. Their protocol — what is writable, when to
validate, how `baseHash` catches a stale read — lives in the tools' own descriptions and errors.

## Datasets

`dataset_list` shows what exists and which apps use each one; `dataset_records` reads the rows;
`dataset_schema` gives the write contract to follow before writing any collector. Both listings are
paged — read `hasMore` rather than assuming the first page is everything.

`dataset_sync` both creates and replaces, from rows, sheets or a spreadsheet; with no payload at all
it re-fetches from the upstream provider. Its default is a FULL REPLACE — rows absent from the
payload are deleted — and it **never creates**: an unmatched name is an error, because the server
cannot tell a typo from a new dataset and would silently make a duplicate. `action:"create"` always
makes a new one, so re-running the same spreadsheet gives a fresh dataset every time (deliberate,
not a bug); `createIfMissing:true` is the middle road for a collector that seeds itself on run 1.

**`dataset_delete` cannot be undone** and exports nothing first. It takes `confirm` set to the
dataset's exact name; one that any app still uses is refused outright, naming them.

