/* Reading progress, mobile menu and smooth TOC scroll for article pages */
(function () {
  var fill = document.getElementById('progressFill');
  function onScroll() {
    if (!fill) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    fill.style.width = (max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var btn = document.getElementById('menuToggle'), nav = document.getElementById('mainNav');
  if (btn && nav) btn.addEventListener('click', function () { nav.classList.toggle('open'); });
  document.querySelectorAll('.article-toc a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();

/* Footer: columns are open on desktop, collapsible on mobile */
(function () {
  var cols = document.querySelectorAll('.mc-footer details.mc-col');
  if (!cols.length || !window.matchMedia) return;
  var mq = window.matchMedia('(min-width:768px)');
  function apply() {
    cols.forEach(function (d) { if (mq.matches) d.setAttribute('open', ''); else d.removeAttribute('open'); });
  }
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply); else if (mq.addListener) mq.addListener(apply);
})();
