/* App shell: header, footer and a tiny hash router (#/age/pre, #/play/count, #/parents, #/stickers). */
(function (KS) {
  'use strict';
  const { h } = KS;
  KS.state = { lastBand: null };
  let cleanups = [];

  function renderHeader(page) {
    const { t } = KS.i18n;
    const header = document.getElementById('topbar');
    const link = (href, label, key) => h('a', { href, class: page === key ? 'on' : '' }, label);
    const langBtn = h('button', { class: 'pill lang', type: 'button', 'aria-label': t('langSwitch') }, '🌐 ' + t('langSwitch'));
    langBtn.addEventListener('click', () => {
      KS.i18n.setLang(KS.i18n.lang === 'bn' ? 'en' : 'bn');
      route();
    });
    const soundBtn = h('button', { class: 'pill', type: 'button', 'aria-label': KS.sound.enabled ? t('soundOn') : t('soundOff') },
      KS.sound.enabled ? '🔊' : '🔇');
    soundBtn.addEventListener('click', () => {
      KS.sound.toggle();
      renderHeader(page);
    });
    header.replaceChildren(
      h('a', { class: 'logo', href: '#/' }, h('span', { class: 'logo-mark' }, '🏡'), h('span', {}, t('appName'))),
      h('nav', { class: 'nav' },
        link('#/', '🏠 ' + t('home'), 'home'),
        link('#/parents', '👪 ' + t('parents'), 'parents'),
        link('#/stickers', '⭐ ' + t('stickers'), 'stickers')),
      h('div', { class: 'actions' }, soundBtn, langBtn)
    );
  }

  function route() {
    cleanups.forEach((fn) => fn());
    cleanups = [];
    KS.sound.stop();
    const [page, arg] = location.hash.replace(/^#\/?/, '').split('/');
    const root = document.getElementById('app');
    root.replaceChildren();
    document.getElementById('footer').textContent = KS.i18n.t('footer');
    window.scrollTo(0, 0);

    const game = page === 'play' ? KS.getGame(arg) : null;
    if (page === 'age' && KS.BANDS[arg]) {
      renderHeader('age');
      KS.pages.age(root, arg);
    } else if (game) {
      renderHeader('play');
      KS.pages.play(root, game, (fn) => cleanups.push(fn));
    } else if (page === 'parents' || page === 'stickers') {
      renderHeader(page);
      KS.pages[page](root);
    } else {
      renderHeader('home');
      KS.pages.home(root);
    }
    document.title = KS.i18n.t('appName') + ' · ' + KS.i18n.t('tagline');
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', () => {
    KS.i18n.setLang(KS.i18n.lang);
    route();
  });
})(window.KS);
