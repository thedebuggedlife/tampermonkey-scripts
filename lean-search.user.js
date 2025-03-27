// ==UserScript==
// @name         Lean Search
// @namespace    https://gist.github.com/
// @version      1.1
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
    jQuery(document).ready(function($) {
        // Find the HTML element with the search results
        var search = $("#search").first();
        // Find all HTML elements with sponsored content that shows outside the main result section
        var sponsored = $(":contains('Sponsored')").filter(function() {
            return this.innerHTML.trim() === "Sponsored" && search.has($(this)).length == 0;
        });
        // For each sponsored element, find the closest parent node in common with the results and hide the tree with ads
        sponsored.each(function() {
            var target = $(this);
            var commonParent = search.parents().has(target).first();
            var ancestor = commonParent.children().has(target).first();
            ancestor.hide();
        });
        // Also hide ads that show inline with the search results
        $("h1:contains('Ads')").each(function() {
            if (this.innerHTML.trim() == 'Ads') {
                $(this).parent().hide();
            }
        });
    });
})();