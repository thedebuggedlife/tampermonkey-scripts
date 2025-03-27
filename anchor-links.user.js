// ==UserScript==
// @name         Anchor Links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show anchor links on hover for h1-h6 elements with id/name attributes, and copy to clipboard when clicked
// @author       Antonio Vargas Garcia
// @match        *://*/*
// @icon         https://img.icons8.com/?size=100&id=n9d0Hm43JCPK&format=png&color=000000
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    // Select all h1-h6 elements with an id
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    const baseUrl = window.location.href.split('#')[0];

    // Add styles to control anchor appearance
    const style = document.createElement('style');
    style.textContent = `
        .tm-anchor-link {
            margin-left: 8px;
            font-size: 0.8em;
            text-decoration: none;
            color: #0077cc;
            cursor: pointer;
            visibility: hidden;
        }

        .tm-heading:hover .tm-anchor-link {
            visibility: visible;
        }
    `;
    document.head.appendChild(style);

    headings.forEach(h => {
        // Skip headings that contain an <a> tag (nested link)
        if (h.querySelector('a')) {
            return; // Skip this heading
        }

        const id = h.id;
        const url = `${baseUrl}#${id}`;

        // Wrap the heading content in a span to prevent breaking layout
        const wrapper = document.createElement('span');
        wrapper.className = 'tm-heading';
        while (h.firstChild) {
            wrapper.appendChild(h.firstChild);
        }
        h.appendChild(wrapper);

        // Create the anchor link
        const link = document.createElement('a');
        link.className = 'tm-anchor-link';
        link.textContent = '🔗';
        link.title = 'Copy anchor link';
        link.href = `#${id}`;

        // Handle anchor link click
        link.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation(); // Ensure it doesn't interfere with other elements
            GM_setClipboard(url);
            link.textContent = '✅';
            setTimeout(() => (link.textContent = '🔗'), 1000);
        });

        // Add the anchor link to the heading
        h.appendChild(link);
    });
})();