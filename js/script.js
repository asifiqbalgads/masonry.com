/* =========================================================
   Holmlund Masonry — homepage interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header state + scroll progress ---------- */
  (function header() {
    var header = $('#site-header');
    var progress = $('#scroll-progress');
    if (!header) return;
    var ticking = false;

    function paint() {
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle('is-stuck', y > 8);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var ratio = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
        progress.style.transform = 'scaleX(' + ratio + ')';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  })();

  /* ---------- Mobile drawer ---------- */
  (function drawer() {
    var toggle = $('#nav-toggle');
    var panel = $('#mobile-menu');
    if (!toggle || !panel) return;
    var panelInner = $('.drawer__panel', panel);
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('is-locked');
      window.setTimeout(function () {
        if (!panel.classList.contains('is-open')) return;
        var first = panelInner.querySelector('a[href], button:not(.drawer__close)');
        if (first) first.focus({ preventScroll: true });
      }, 340);
    }

    function close() {
      if (!panel.classList.contains('is-open')) return;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    toggle.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) close(); else open();
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-menu]')) {
        // let in-page links jump before unlocking scroll
        var link = e.target.closest('a[href^="#"]');
        if (link) {
          window.setTimeout(close, 10);
        } else {
          close();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab' && panel.classList.contains('is-open')) {
        var f = $$('a[href], button:not([disabled])', panelInner).filter(function (el) {
          return el.offsetParent !== null;
        });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // close if the viewport grows past the mobile breakpoint
    var mq = window.matchMedia('(min-width: 1024px)');
    var onChange = function (e) { if (e.matches) close(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  })();

  /* ---------- Accordions (water zones + FAQ) ---------- */
  (function accordions() {
    function setHeight(el, open) {
      if (open) {
        el.style.height = el.scrollHeight + 'px';
        el.addEventListener('transitionend', function done(e) {
          if (e.propertyName === 'height') {
            el.style.height = 'auto';
            el.removeEventListener('transitionend', done);
          }
        });
      } else {
        el.style.height = el.scrollHeight + 'px';
        // force reflow so the collapse animates from the measured height
        void el.offsetHeight;
        el.style.height = '0px';
      }
    }

    $$('[data-accordion]').forEach(function (group) {
      var items = $$('.wzone, .qa', group);
      items.forEach(function (item) {
        var btn = $('button', item);
        var body = btn && document.getElementById(btn.getAttribute('aria-controls'));
        if (!btn || !body) return;

        // initialise: open item gets real height, others zero
        if (item.classList.contains('is-open')) {
          body.style.height = 'auto';
          btn.setAttribute('aria-expanded', 'true');
        } else {
          body.style.height = '0px';
          btn.setAttribute('aria-expanded', 'false');
        }

        btn.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');
          items.forEach(function (other) {
            if (other === item) return;
            var ob = $('button', other);
            var obd = ob && document.getElementById(ob.getAttribute('aria-controls'));
            if (!obd) return;
            other.classList.remove('is-open');
            ob.setAttribute('aria-expanded', 'false');
            obd.style.height = '0px';
          });
          item.classList.toggle('is-open', !isOpen);
          btn.setAttribute('aria-expanded', String(!isOpen));
          setHeight(body, !isOpen);
        });
      });
    });

    // keep open panels correct after a resize / font swap
    var t;
    window.addEventListener('resize', function () {
      window.clearTimeout(t);
      t = window.setTimeout(function () {
        $$('.wzone.is-open .wzone__body, .qa.is-open .qa__body').forEach(function (el) {
          el.style.height = 'auto';
        });
      }, 160);
    });
  })();

  /* ---------- Before / after comparison ---------- */
  (function compare() {
    var range = $('#compare-range');
    var stage = $('[data-compare]');
    if (!range || !stage) return;
    var before = $('[data-before]', stage);
    var handle = $('[data-handle]', stage);
    var afterImg = $('.compare__img--after', stage);

    function apply(v) {
      before.style.width = v + '%';
      handle.style.left = v + '%';
    }

    function syncImageWidth() {
      // the before-image must stay the width of the full stage, not of its clip
      var img = before.querySelector('img');
      if (img) img.style.width = stage.clientWidth + 'px';
    }

    range.addEventListener('input', function () { apply(range.value); });
    apply(range.value);
    syncImageWidth();
    window.addEventListener('resize', syncImageWidth);
    if (afterImg && afterImg.complete) syncImageWidth();
    else if (afterImg) afterImg.addEventListener('load', syncImageWidth);

    // keyboard support on the whole stage
    stage.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft') { range.value = Math.max(0, +range.value - step); apply(range.value); e.preventDefault(); }
      if (e.key === 'ArrowRight') { range.value = Math.min(100, +range.value + step); apply(range.value); e.preventDefault(); }
    });
  })();

  /* ---------- Scroll reveal ---------- */
  (function reveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    var targets = $$('.section-head, .svc, .project, .review, .step, .legacy__figure, .legacy__body, .legacy__card, .compare, .water__figure, .areas__copy, .areas__list, .faq__head, .faq__list, .cta__body, .cta__card, .trust__item, .intro__body, .intro__aside');
    if (!targets.length) return;
    targets.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var i = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Active nav link ---------- */
  (function activeNav() {
    var links = $$('.nav__list a');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      map[id] = a;
    });
    var sections = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[entry.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- Floating CTAs: hide while the estimate section is on screen ---------- */
  (function floatingCTA() {
    var bar = $('#actionbar');
    var fab = $('.fab');
    var target = $('#estimate');
    if (!target || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      var inView = entries[0].isIntersecting;
      if (bar) bar.classList.toggle('is-tucked', inView);
      if (fab) fab.classList.toggle('is-tucked', inView);
    }, { rootMargin: '0px 0px -20% 0px', threshold: 0.01 });
    io.observe(target);
  })();

  /* ---------- Mobile action-bar safe spacing ---------- */
  (function safeArea() {
    var bar = $('#actionbar');
    if (!bar) return;
    function measure() {
      var visible = window.getComputedStyle(bar).display !== 'none';
      var h = visible ? bar.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty('--bar-h', h + 'px');
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', function () { window.setTimeout(measure, 240); });
  })();

  /* ---------- Smooth in-page scrolling with header offset ---------- */
  (function smoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      var header = $('#site-header');
      var offset = (header ? header.offsetHeight : 0) + 10;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', hash);
    });
  })();

  /* ---------- Year ---------- */
  (function year() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  })();
})();
