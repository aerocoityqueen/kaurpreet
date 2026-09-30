/* =====================================================================
   Aerocity Escorts — Core interactions
   Vanilla JS only. No dependencies.
   ===================================================================== */
(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1. Age verification modal
       ------------------------------------------------------------------ */
    var ageOverlay = document.getElementById('ageOverlay');
    var ageModal = document.getElementById('ageModal');

    function disableScroll() {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('age-popup-active');
    }

    function enableScroll() {
        document.body.style.overflow = '';
        document.body.classList.remove('age-popup-active');
    }

    function showAgePopup() {
        if (!ageOverlay || !ageModal) return;
        ageOverlay.classList.add('active');
        ageModal.classList.add('active');
        disableScroll();
    }

    function hideAgePopup() {
        if (!ageOverlay || !ageModal) return;
        ageOverlay.classList.remove('active');
        ageModal.classList.remove('active');
        enableScroll();
    }

    window.acceptAge = function () {
        try { localStorage.setItem('ageVerified', 'yes'); } catch (e) {}
        hideAgePopup();
    };

    window.rejectAge = function () {
        try { localStorage.setItem('ageVerified', 'no'); } catch (e) {}
        window.location.replace('https://www.google.com');
    };

    document.addEventListener('DOMContentLoaded', function () {
        var verified = false;
        try { verified = localStorage.getItem('ageVerified') === 'yes'; } catch (e) {}
        if (verified) { hideAgePopup(); } else { showAgePopup(); }
    });

    /* ------------------------------------------------------------------
       2. Cookie consent bar
       ------------------------------------------------------------------ */
    var cookieBar = document.getElementById('cookieBar');
    var acceptBtn = document.getElementById('acceptCookies');

    if (acceptBtn && cookieBar) {
        acceptBtn.addEventListener('click', function () {
            cookieBar.style.display = 'none';
            try { localStorage.setItem('cookieAccepted', 'yes'); } catch (e) {}
        });
        var accepted = false;
        try { accepted = localStorage.getItem('cookieAccepted') === 'yes'; } catch (e) {}
        if (accepted) { cookieBar.style.display = 'none'; }
    }

    /* ------------------------------------------------------------------
       3. Navigation drawer (mobile)
       ------------------------------------------------------------------ */
    var menuBtn = document.getElementById('menuBtn');
    var drawer = document.getElementById('drawer');
    var drawerScrim = document.getElementById('drawerScrim');
    var drawerClose = document.getElementById('drawerClose');

    function openDrawer() {
        if (!drawer) return;
        drawer.classList.add('open');
        if (drawerScrim) drawerScrim.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('open');
        if (drawerScrim) drawerScrim.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerScrim) drawerScrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeDrawer();
    });

    /* ------------------------------------------------------------------
       4. FAQ accordion
       ------------------------------------------------------------------ */
    var toggles = document.querySelectorAll('.accordion .toggle');
    toggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            var item = toggle.closest('li');
            var inner = item.querySelector('.inner');
            var isOpen = item.classList.contains('open');

            // Close siblings
            item.parentElement.querySelectorAll('li.open').forEach(function (open) {
                open.classList.remove('open');
                open.querySelector('.inner').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                inner.style.maxHeight = inner.scrollHeight + 'px';
            }
        });
    });

    /* ------------------------------------------------------------------
       5. Reveal on scroll (lightweight, no library)
       ------------------------------------------------------------------ */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ------------------------------------------------------------------
       6. Contact page — booking enquiry form
       This site is static (no backend), so the form composes a WhatsApp
       message instead of posting anywhere. Guarded so every other page
       is unaffected.
       ------------------------------------------------------------------ */
    var bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('bkName').value.trim();
            var phone = document.getElementById('bkPhone').value.trim();
            var location = document.getElementById('bkLocation').value.trim();
            var duration = document.getElementById('bkDuration').value;

            if (!name || !phone || !location || !duration) {
                // Let the browser surface the first missing required field
                var missing = !name ? document.getElementById('bkName')
                    : !phone ? document.getElementById('bkPhone')
                        : !location ? document.getElementById('bkLocation')
                            : document.getElementById('bkDuration');
                if (missing) {
                    missing.focus();
                    if (missing.setAttribute) missing.setAttribute('aria-invalid', 'true');
                }
                return;
            }

            var lines = [
                'Hello, I would like to make a booking enquiry.',
                '',
                'Name: ' + name,
                'Phone / WhatsApp: ' + phone,
                'Location: ' + location
            ];

            var date = document.getElementById('bkDate').value;
            var time = document.getElementById('bkTime').value;
            var category = document.getElementById('bkCategory').value;
            var budget = document.getElementById('bkBudget').value.trim();
            var message = document.getElementById('bkMessage').value.trim();

            if (date) lines.push('Date: ' + date);
            if (time) lines.push('Time: ' + time);
            lines.push('Duration: ' + duration);
            if (category) lines.push('Category: ' + category);
            if (budget) lines.push('Budget: ' + budget);
            if (message) lines.push('Notes: ' + message);

            window.open(
                'https://wa.me/919000000000?text=' + encodeURIComponent(lines.join('\n')),
                '_blank',
                'noopener'
            );
        });
    }

    /* ------------------------------------------------------------------
       7. Footer year auto-update
       ------------------------------------------------------------------ */
    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ------------------------------------------------------------------
       7. Content protection — context menu / copy / view-source shortcut
       ------------------------------------------------------------------ */
    document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false);

    document.addEventListener('copy', function (e) {
        try { e.clipboardData.setData('text/plain', 'Copying is not allowed on this webpage'); } catch (err) {}
        e.preventDefault();
    }, false);

    document.addEventListener('cut', function (e) {
        try { e.clipboardData.setData('text/plain', 'Copying is not allowed on this webpage'); } catch (err) {}
        e.preventDefault();
    }, false);

    document.onkeydown = function (e) {
        // Block Ctrl+U (view source) and Ctrl+S (save page)
        if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 83)) { return false; }
    };
})();
