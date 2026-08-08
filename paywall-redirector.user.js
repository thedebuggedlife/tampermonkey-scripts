// ==UserScript==
// @name         Paywall Redirector (Ladder)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Redirects paywalled news sites through a self-hosted ladder proxy, or straight to archive.today for hard-paywall sites
// @author       Antonio Vargas Garcia
// @icon         https://img.icons8.com/?size=100&id=64946&format=png&color=000000
// @match        *://*.reuters.com/*
// @match        *://*.seattletimes.com/*
// @match        *://*.newrepublic.com/*
// @match        *://*.404media.co/*
// @match        *://*.nytimes.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://github.com/thedebuggedlife/tampermonkey-scripts/raw/refs/heads/main/paywall-redirector.user.js
// @downloadURL  https://github.com/thedebuggedlife/tampermonkey-scripts/raw/refs/heads/main/paywall-redirector.user.js
// ==/UserScript==

/*
 * ======================================================================================
 * README
 * ======================================================================================
 *
 * WHERE A PAGE GETS SENT
 *
 * There are exactly two destinations, and a site belongs to one of two lists:
 *
 *   1. ladder (the default)  -> https://ladder.vargas.casa/<encoded url>
 *      A self-hosted proxy that fetches the article server-side with per-domain rules.
 *      This is where every matched site goes unless it is listed in 'archiveSites'.
 *
 *   2. archive.today          -> https://archive.ph/newest/<raw url>
 *      For hard-paywall sites ladder cannot crack live. archive.ph is fetched by YOUR
 *      browser, so its CAPTCHA sees a residential IP and passes; a server IP does not.
 *
 * HOW TO ADD A NEW SITE:
 *
 * STEP 1 (always): add a match rule to the metadata block at the top of this file, e.g.
 *   // @match        *://*.example.com/*
 *   Without it the script never runs on that site.
 *
 * STEP 2 (only for hard-paywall sites): add a domain snippet to the 'archiveSites' array
 * below, e.g. 'example.com'. Anything NOT in that array goes through ladder, which is the
 * preferred path — it renders the live article rather than an archived snapshot.
 *
 * If a site starts failing through ladder, moving it into 'archiveSites' is the fix.
 *
 * NOTE ON THE ENCODING: the ladder URL is built with encodeURIComponent() and that is
 * mandatory, not cosmetic. The reverse proxy in front of ladder collapses a literal '//'
 * in the path, which makes ladder return a 500. archive.ph, by contrast, wants the URL raw.
 *
 * NOTE ON SIGNING IN: ladder.vargas.casa sits behind Authelia. With a live session the
 * redirect is invisible; without one you land on the login page and continue to the article
 * after authenticating. That is by design — do not try to work around it.
 *
 * ======================================================================================
 */

(function() {
    'use strict';

    // CONFIGURATION SECTION
    const LADDER_PREFIX  = 'https://ladder.vargas.casa/';
    const ARCHIVE_PREFIX = 'https://archive.ph/newest/';

    // Hard-paywall sites ladder cannot crack live — send the browser straight to
    // archive.today (a residential IP passes its CAPTCHA; a server IP does not).
    const archiveSites = ['nytimes.com'];

    const currentUrl = window.location.href;

    // Never redirect a destination onto itself.
    if (currentUrl.startsWith(LADDER_PREFIX) || currentUrl.includes('archive.ph/')) {
        return;
    }

    const useArchive = archiveSites.some(d => currentUrl.includes(d));
    const newUrl = useArchive
        ? ARCHIVE_PREFIX + currentUrl                       // archive.ph wants it raw
        : LADDER_PREFIX + encodeURIComponent(currentUrl);   // ladder needs it ENCODED

    // Log for debugging (viewable in browser console F12)
    console.log(`[Paywall Redirector] Redirecting to: ${newUrl}`);

    // Perform the redirect immediately
    // We use .replace() so the paywalled page doesn't get stuck in your 'Back' history
    window.location.replace(newUrl);
})();
