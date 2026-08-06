# Gainable — Claude Skill

For Claude on the web, the desktop app, and **Cowork** — the surfaces with no plugin to install.

It is the same text the Claude Code and Codex plugins carry: which tool to reach for, how to relay
the connector's questions back to you unanswered, and the handful of rules that decide whether the
app comes out right.

## Install

Upload **`gainable-skill.zip`** at [claude.ai/customize/skills](https://claude.ai/customize/skills)
— click **+**, then **Create skill**, then **Upload a skill**.

In Cowork the same directory is under **Customize** in the left sidebar.

Then make sure the skill's toggle is **on**. Uploaded skills are account-wide but can be switched
off individually, and a disabled skill is not available to Claude.

> The archive has to contain the skill **folder** (`gainable/SKILL.md`), not a bare `SKILL.md` at the
> root. `gainable-skill.zip` is built that way by the release script — if you rebuild it by hand,
> zip the folder, not its contents.

Custom skills are private to your account. On Team and Enterprise plans you can share them with
your organisation.

## You also need the connector

A Skill is guidance, not a connection. Add the Gainable connector to Claude as well — the skill is
what makes it *drive* well, not what makes it reachable. The Claude Code and Codex plugins bundle
that registration; on this surface it is a separate step.

## Why a Skill at all

The connector already sends an `instructions` string on every call, and it genuinely arrives. But it
arrives as advisory server metadata competing with everything else in the window, and nothing in it
lands before the model's first decision. A Skill is part of Claude's own instruction surface. Same
words, different standing.

`gainable/SKILL.md` is generated from the Gainable engine repo — edits here are overwritten by the
next release. See `SOURCE_SHA` at the repo root for the revision it came from.
