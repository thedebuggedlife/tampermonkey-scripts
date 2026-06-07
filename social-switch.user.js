// ==UserScript==
// @name         Social Switch (Privacy Frontends)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects social media sites to privacy-friendly alternative frontends
// @author       Antonio Vargas Garcia
// @icon         https://img.icons8.com/external-smashingstocks-outline-color-smashing-stocks/66/external-social-network-networking-smashingstocks-outline-color-smashing-stocks.png
// @match        *://*.instagram.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @match        *://*.medium.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://github.com/thedebuggedlife/tampermonkey-scripts/raw/refs/heads/main/social-switch.user.js
// @downloadURL  https://github.com/thedebuggedlife/tampermonkey-scripts/raw/refs/heads/main/social-switch.user.js
// ==/UserScript==

/*
 * ======================================================================================
 * README
 * ======================================================================================
 *
 * HOW TO ADD A NEW SITE:
 *
 * You must perform TWO steps for this script to work on a new website.
 *
 * STEP 1: Add a Match Rule
 * Go to the top of this script (the metadata block) and add a new line starting with // @match
 * Example:
 * // @match        *://*.facebook.com/*
 *
 * STEP 2: Update the Configuration
 * Scroll down to the 'siteConfig' object below and add a new entry.
 * The format is: 'original.domain': 'alternative.frontend.domain'
 *
 * The script swaps the hostname while preserving the full path, query string,
 * and fragment. Subdomains (www., m., old., etc.) are handled automatically.
 *
 * Example:
 * 'facebook.com': 'some-facebook-frontend.example.com',
 *
 * ======================================================================================
 */

(function() {
    'use strict';

    // CONFIGURATION SECTION
    // 'original domain': 'alternative frontend domain'
    const siteConfig = {
        'instagram.com':  'imginn.com',
        'tiktok.com':     'proxitok.pabloferreiro.es',
        'x.com':          'xcancel.com',
        'twitter.com':    'xcancel.com',
        'reddit.com':     'redlib.matthew.science',
        'youtube.com':    'piped.video',
        'medium.com':     'scribe.rip',
        'imgur.com':      'rimgo.vern.cc',
    };

    const url = new URL(window.location.href);
    const hostname = url.hostname;

    // Find the matching original domain
    for (const [originalDomain, frontendDomain] of Object.entries(siteConfig)) {
        if (hostname === originalDomain || hostname.endsWith('.' + originalDomain)) {
            url.hostname = frontendDomain;

            console.log(`[Social Switch] Redirecting to: ${url.href}`);

            // Use .replace() so the original page doesn't get stuck in your 'Back' history
            window.location.replace(url.href);
            return;
        }
    }
})();
