// ==UserScript==
// @name         Paywall Redirector (RemovePaywalls)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Redirects specific news sites to removepaywalls.com with custom options
// @author       Antonio Vargas Garcia
// @icon         https://img.icons8.com/?size=100&id=64946&format=png&color=000000
// @match        *://*.reuters.com/*
// @match        *://*.seattletimes.com/*
// @match        *://*.newrepublic.com/*
// @match        *://*.404media.co/*
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
 * HOW TO ADD A NEW SITE:
 *
 * You must perform TWO steps for this script to work on a new website.
 *
 * STEP 1: Add a Match Rule
 * Go to the top of this script (the metadata block) and add a new line starting with // @match
 * Example:
 * // @match        *://*.nytimes.com/*
 *
 * STEP 2: Update the Configuration
 * Scroll down to the 'siteConfig' object below and add a new line.
 * The format is: 'domain-part': 'https://removepaywalls.com/OPTION/'
 *
 * - The 'domain-part' is a unique part of the URL (e.g., 'nytimes.com').
 * - The 'OPTION' is the specific prefix you want (leave empty for default, or add /2/, /4/, etc).
 *
 * Example:
 * 'nytimes.com': 'https://removepaywalls.com/',
 *
 * ======================================================================================
 */

(function() {
    'use strict';

    // CONFIGURATION SECTION
    const siteConfig = {
        // 'domain-snippet': 'prefix-url'
        'reuters.com':      'https://removepaywalls.com/4/',
        'seattletimes.com': 'https://removepaywalls.com/',
        'newrepublic.com':  'https://removepaywalls.com/',
        '404media.co':      'https://removepaywalls.com/3/',
    };

    const currentUrl = window.location.href;

    // Iterate through our config to find a match
    for (const [domainSnippet, prefix] of Object.entries(siteConfig)) {
        if (currentUrl.includes(domainSnippet)) {

            // Construct the new URL
            // Result: prefix + original_full_url
            const newUrl = prefix + currentUrl;

            // Log for debugging (viewable in browser console F12)
            console.log(`[Paywall Redirector] Redirecting to: ${newUrl}`);

            // Perform the redirect immediately
            // We use .replace() so the paywalled page doesn't get stuck in your 'Back' history
            window.location.replace(newUrl);

            break; // Stop checking after the first match
        }
    }
})();
