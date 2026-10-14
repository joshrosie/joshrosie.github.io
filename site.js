// Shared behaviour: nav, scroll-spy, reveals, pointer sheen.
// Dependency-free. Every motion effect is skipped when the visitor
// has asked for reduced motion.
(function () {
    'use strict';

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Nav background on scroll ---- */
    var nav = document.querySelector('nav');
    if (nav) {
        var onScroll = function () {
            nav.classList.toggle('scrolled', window.scrollY > 24);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Mobile menu ---- */
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (toggle && links) {
        // Index each link so the panel can stagger them in.
        Array.prototype.forEach.call(links.children, function (a, i) {
            a.style.setProperty('--i', i);
        });

        var setMenu = function (open) {
            links.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        };

        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });

        links.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') setMenu(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    /* ---- Reveal on scroll (one-shot) ---- */
    var revealables = document.querySelectorAll('.reveal');

    if (!revealables.length) {
        // nothing to do
    } else if (reduced || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(revealables, function (el) {
            el.classList.add('in');
        });
    } else {
        // Stagger siblings within each group rather than across the page.
        var groups = {};
        Array.prototype.forEach.call(revealables, function (el) {
            var key = el.parentNode;
            groups[key] = groups[key] || [];
            el.style.setProperty('--i', groups[key].length);
            groups[key].push(el);
        });

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });

        // Safety net: nothing should ever stay invisible because an
        // observer callback didn't arrive.
        setTimeout(function () {
            Array.prototype.forEach.call(revealables, function (el) {
                el.classList.add('in');
            });
        }, 2500);
    }

    /* ---- Scroll-spy: mark the section currently in view ---- */
    var sections = document.querySelectorAll('main section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
        var markCurrent = function (id) {
            Array.prototype.forEach.call(navAnchors, function (a) {
                if (a.getAttribute('href') === '#' + id) {
                    a.setAttribute('aria-current', 'true');
                } else {
                    a.removeAttribute('aria-current');
                }
            });
        };

        // Track every section's ratio and highlight the most visible one,
        // so fast scrolls and short sections don't leave a stale highlight.
        var ratios = {};
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { ratios[e.target.id] = e.intersectionRatio; });

            var best = null, bestRatio = 0;
            Object.keys(ratios).forEach(function (id) {
                if (ratios[id] > bestRatio) { bestRatio = ratios[id]; best = id; }
            });

            if (best) markCurrent(best);
            else Array.prototype.forEach.call(navAnchors, function (a) {
                a.removeAttribute('aria-current');
            });
        }, { threshold: [0, 0.15, 0.4, 0.7, 1], rootMargin: '-15% 0px -35% 0px' });

        Array.prototype.forEach.call(sections, function (s) { spy.observe(s); });
    }

    /* ---- Pointer-following sheen on cards ----
       Exposed as window.initSheen so pages that inject cards after load
       (the writing index) can wire up the new ones. Idempotent. ---- */
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function track(e) {
        var r = this.getBoundingClientRect();
        this.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        this.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }

    window.initSheen = function () {
        if (!finePointer || reduced) return;
        var targets = document.querySelectorAll('.card, .post-item');
        Array.prototype.forEach.call(targets, function (el) {
            if (el.dataset.sheen) return;
            el.dataset.sheen = '1';
            el.addEventListener('pointermove', track);
        });
    };

    window.initSheen();

    /* ---- Reveal elements added after load ---- */
    window.revealNew = function () {
        var fresh = document.querySelectorAll('.reveal:not(.in)');
        if (!fresh.length) return;

        if (reduced || !('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(fresh, function (el) { el.classList.add('in'); });
            return;
        }

        Array.prototype.forEach.call(fresh, function (el, i) {
            el.style.setProperty('--i', i);
            // Next frame, so the transition has an initial state to animate from.
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { el.classList.add('in'); });
            });
        });
    };
})();
