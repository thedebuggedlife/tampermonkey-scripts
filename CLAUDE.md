# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Collection of standalone Tampermonkey userscripts. Each `.user.js` file is an independent script — there is no build system, package manager, or test framework. Scripts are plain JavaScript following the Tampermonkey userscript format.

## Userscript Structure

Every script follows this pattern:
1. **Metadata block** (`// ==UserScript== ... // ==/UserScript==`) — defines name, version, `@match` patterns, `@grant` permissions, and auto-update URLs pointing to this repo's `main` branch on GitHub (`thedebuggedlife/tampermonkey-scripts`).
2. **IIFE body** — all logic wrapped in `(function() { 'use strict'; ... })();`

## Key Conventions

- `@match` patterns control which sites a script runs on — always keep these in sync with any domain logic inside the script.
- `@updateURL` / `@downloadURL` point to the raw GitHub URL on `main`. Bump `@version` when making changes so Tampermonkey picks up updates.
- `@grant none` unless the script needs a specific Tampermonkey API (e.g., `GM_setClipboard` in anchor-links).
- `@run-at document-start` is used when the script must act before page load (e.g., paywall-redirector).
- lean-search uses jQuery via `@require`; other scripts use vanilla DOM APIs.
