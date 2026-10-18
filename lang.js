// Language toggle. Both languages are always present in the DOM — this only flips
// which one is visible, and remembers the choice across pages.
//
// index.html loads it from <head>, so the language is settled before the body is laid out: the
// screenshots exist once per language, and an image hidden from the first layout is never
// fetched. The other pages still load it at the end of <body>; both placements work.
(function () {
  var KEY = 'rangeforge-lang';
  var root = document.documentElement;

  function syncButtons(lang) {
    var buttons = document.querySelectorAll('.langbar button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].dataset.lang === lang));
    }
  }

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    syncButtons(lang);
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private browsing */ }
  }

  // ?lang=ru opens straight in Russian and outranks the remembered choice. App Store Connect
  // takes a Privacy Policy URL per localisation, so the ru-RU listing links here with the
  // parameter and a Russian reader never lands on the English text first. apply() writes the
  // choice through to localStorage, so the footer links carry the language to the other pages.
  var linked = /[?&]lang=(ru|en)\b/.exec(location.search);
  var saved;
  try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
  // Default to English: App Review reads it, and the Russian text is one click away.
  apply((linked && linked[1]) || (saved === 'ru' || saved === 'en' ? saved : 'en'));

  // Run from <head>, the language bar is not parsed yet.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncButtons(root.getAttribute('data-lang'));
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.langbar button') : null;
    if (btn) apply(btn.dataset.lang);
  });
})();
