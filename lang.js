// Language toggle. Both languages are always present in the DOM — this only flips
// which one is visible, and remembers the choice across pages.
(function () {
  var KEY = 'rangeforge-lang';
  var root = document.documentElement;

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    var buttons = document.querySelectorAll('.langbar button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.lang === lang));
    }
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private browsing */ }
  }

  var saved;
  try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
  // Default to English: App Review reads it, and the Russian text is one click away.
  apply(saved === 'ru' || saved === 'en' ? saved : 'en');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.langbar button') : null;
    if (btn) apply(btn.dataset.lang);
  });
})();
