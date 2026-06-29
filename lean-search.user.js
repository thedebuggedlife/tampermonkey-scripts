// ==UserScript==
// @name         Lean Search
// @namespace    https://gist.github.com/
// @version      1.3
// @description  Remove sponsored entries from Google search results
// @author       Antonio Vargas Garcia
// @match        https://www.google.com/search*
// @icon         https://img.icons8.com/color/48/search--v1.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @updateURL    https://github.com/thedebuggedlife/tampermonkey-scripts/raw/refs/heads/main/lean-search.user.js
// @downloadURL  https://github.com/thedebuggedlife/tampermonkey-scripts/raw/refs/heads/main/lean-search.user.js
// ==/UserScript==

(function() {
    'use strict';
    $.noConflict();

    // Matches the visible label Google puts above an ad block. Google has used
    // "Sponsored", "Sponsored result" and "Sponsored results" over time, so
    // accept the singular/plural variants (case-insensitively).
    var SPONSORED_LABEL = /^Sponsored(\s+results?)?$/i;

    // Given a sponsored label element, return the branch that should be hidden.
    // Sponsored blocks have appeared in three places as Google's layout has
    // changed, so handle all of them while never hiding the organic results.
    function adContainerFor($, target) {
        var search = $("#search").first();
        var rso = $("#rso").first();

        var container = $();
        if (rso.length && rso.has(target).length) {
            // Ads rendered as a result group inside the organic results list:
            // hide just the top-level block that holds them.
            container = rso.children().has(target).first();
        } else if (search.length && search.has(target).length) {
            // Inside #search but outside #rso.
            container = search.children().has(target).first();
        } else if (search.length) {
            // Outside #search entirely: hide the sibling branch of #search that
            // contains the ad (find the common ancestor, then its child branch).
            var commonParent = search.parents().has(target).first();
            container = commonParent.children().has(target).first();
        }

        // Never hide a container that also wraps the organic results.
        if (container.length && (container.is(search) || container.has(search).length)) {
            return $();
        }
        return container;
    }

    function hideAds($) {
        // Find leaf elements whose entire text is the sponsored label.
        var labels = $(":contains('Sponsored')").filter(function() {
            return $(this).children().length === 0 &&
                SPONSORED_LABEL.test((this.textContent || '').trim());
        });

        labels.each(function() {
            adContainerFor($, $(this)).hide();
        });

        // Legacy inline-ad fallbacks (older Google layouts).
        $("#tads, #tadsb, #bottomads").hide();
        $("h1:contains('Ads')").each(function() {
            if ((this.textContent || '').trim() === 'Ads') {
                $(this).parent().hide();
            }
        });
    }

    jQuery(document).ready(function($) {
        hideAds($);

        // Google can inject/replace results after the initial render, so keep
        // re-applying for a short window via a debounced MutationObserver.
        var pending = null;
        var observer = new MutationObserver(function() {
            if (pending) return;
            pending = setTimeout(function() {
                pending = null;
                hideAds($);
            }, 200);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Stop observing once the page has settled to avoid running forever.
        setTimeout(function() { observer.disconnect(); }, 10000);
    });
})();
