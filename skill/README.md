# Gainable — Claude Skill

`SKILL.md` here is the Gainable steering packaged as a Claude Skill, for Claude on the web, the
desktop app, and Cowork — the surfaces where there is no plugin to install.

It is the same text the Claude Code and Codex plugins carry: which tool to reach for, how to relay
the connector's questions back to you unanswered, and the handful of rules that decide whether the
app comes out right.

## You also need the connector

A Skill is guidance, not a connection. Add the Gainable connector to Claude as well — the skill is
what makes it *drive* well, not what makes it reachable.

## Install

Install `SKILL.md` as a Skill on your Claude account.

> **Not yet verified: whether a Skill installed this way is visible inside a Cowork project.**
> That is the whole reason this package exists — a Cowork session has no plugin mechanism, so an
> account-level Skill is the only way the guidance can be present before the first turn. If it turns
> out Cowork does not see installed Skills, this package should be dropped rather than kept as
> decoration, and the connector's own `instructions` string remains the fallback for that surface.

## Why a Skill at all

The connector already sends an `instructions` string on every call, and it genuinely arrives. But it
arrives as advisory server metadata competing with everything else in the window, and nothing in it
lands before the model's first decision. A Skill is part of the harness's own instruction surface.
Same words, different standing.

`SKILL.md` is generated from the Gainable engine repo — edits here are overwritten by the next
release. See `SOURCE_SHA` at the repo root for the revision it came from.
