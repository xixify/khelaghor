/* Home page and age-band page. */
(function (KS) {
  'use strict';
  const { h } = KS;

  /* Original mascot: a waving baby elephant. Static, app-authored SVG. */
  const MASCOT_SVG =
    '<svg class="mascot" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="100" cy="182" rx="60" ry="7" fill="#23205A" opacity=".12"/>' +
    '<ellipse cx="100" cy="135" rx="52" ry="44" fill="#8FC9FF"/>' +
    '<rect x="62" y="150" width="24" height="32" rx="12" fill="#7BB8F5"/><rect x="114" y="150" width="24" height="32" rx="12" fill="#7BB8F5"/>' +
    '<ellipse cx="44" cy="70" rx="34" ry="38" fill="#7BB8F5"/><ellipse cx="44" cy="72" rx="22" ry="26" fill="#FFB3C8"/>' +
    '<ellipse cx="156" cy="70" rx="34" ry="38" fill="#7BB8F5"/><ellipse cx="156" cy="72" rx="22" ry="26" fill="#FFB3C8"/>' +
    '<circle cx="100" cy="76" r="50" fill="#9DD2FF"/>' +
    '<path d="M100 92 C96 120 104 134 122 128 C130 125 128 116 120 118 C112 120 110 110 112 94Z" fill="#9DD2FF" stroke="#7BB8F5" stroke-width="3"/>' +
    '<circle cx="80" cy="70" r="9" fill="#23205A"/><circle cx="120" cy="70" r="9" fill="#23205A"/>' +
    '<circle cx="83" cy="66" r="3.2" fill="#fff"/><circle cx="123" cy="66" r="3.2" fill="#fff"/>' +
    '<ellipse cx="68" cy="90" rx="9" ry="5" fill="#FF8FA3" opacity=".8"/><ellipse cx="132" cy="90" rx="9" ry="5" fill="#FF8FA3" opacity=".8"/>' +
    '<path d="M86 96 Q92 102 98 97" stroke="#23205A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M70 32 Q100 14 130 32 Q100 26 70 32Z" fill="#FF4D6D"/><circle cx="100" cy="22" r="7" fill="#FFD60A"/>' +
    '<g class="mascot-arm"><rect x="146" y="112" width="40" height="18" rx="9" fill="#8FC9FF" transform="rotate(-35 150 120)"/>' +
    '</g>' +
    '</svg>';

  function bandCard(key) {
    const { L, t, n } = KS.i18n;
    const b = KS.BANDS[key];
    const count = KS.gamesForBand(key).length;
    return h('a', { class: 'band-card band-' + key, href: '#/age/' + key },
      h('span', { class: 'band-emoji' }, b.emoji),
      h('span', { class: 'band-ages' }, L(b.ages)),
      h('span', { class: 'band-name' }, L(b.name)),
      h('span', { class: 'band-blurb' }, L(b.blurb)),
      h('span', { class: 'band-count' }, t('gamesCount', { n: n(count) }) + ' →'));
  }

  KS.pages.home = function home(root) {
    const { t, L } = KS.i18n;
    const features = [
      ['🌱', t('featureNoRace'), t('featureNoRaceText')],
      ['🗣️', t('featureBilingual'), t('featureBilingualText')],
      ['👪', t('featureTogether'), t('featureTogetherText')],
    ];
    root.append(
      h('section', { class: 'hero' },
        h('div', { class: 'mascot-wrap', 'aria-hidden': 'true', html: MASCOT_SVG }),
        h('h1', {}, t('appName')),
        h('p', { class: 'hero-tag' }, t('tagline')),
        h('p', { class: 'hero-line' }, t('heroLine')),
        h('div', { class: 'hero-art', 'aria-hidden': 'true' }, ['🪁', '🌈', '🎈', '⛵'].map((e) => h('span', {}, e)))),
      h('h2', { class: 'section-title' }, t('chooseAge')),
      h('div', { class: 'band-grid' }, KS.BAND_ORDER.map(bandCard)),
      h('div', { class: 'feature-grid' }, features.map(([e, title, text]) =>
        h('div', { class: 'feature' }, h('span', { class: 'feature-emoji' }, e), h('h3', {}, title), h('p', {}, text)))),
      h('h2', { class: 'section-title' }, t('skillAreas')),
      h('div', { class: 'skill-grid' }, Object.values(KS.SKILLS).map((s) =>
        h('div', { class: 'skill-chip' }, h('span', {}, s.emoji), L(s.name)))),
      h('div', { class: 'parent-cta' },
        h('span', { class: 'cta-emoji' }, '👨‍👩‍👧'),
        h('div', {}, h('h3', {}, t('parentCta')), h('a', { class: 'btn big', href: '#/parents' }, t('parentCtaBtn'))))
    );
  };

  function gameCard(game) {
    const { L, t, n } = KS.i18n;
    const plays = (KS.progress.all()[game.id] || {}).plays || 0;
    const skill = KS.SKILLS[game.skill];
    return h('a', { class: 'game-card', href: '#/play/' + game.id, 'data-skill': game.skill },
      h('span', { class: 'game-icon' }, game.icon),
      h('span', { class: 'game-title' }, L(game.title)),
      h('span', { class: 'game-desc' }, L(game.desc)),
      h('span', { class: 'game-meta' },
        h('span', { class: 'tag' }, skill.emoji + ' ' + L(skill.name)),
        plays ? h('span', { class: 'stickers-badge', title: t('timesPlayed', { n: n(plays) }) }, '⭐ ' + n(plays)) : null));
  }

  KS.pages.age = function age(root, bandKey) {
    const { L, t } = KS.i18n;
    const band = KS.BANDS[bandKey];
    KS.state.lastBand = bandKey;
    const games = KS.gamesForBand(bandKey);
    const skills = Array.from(new Set(games.map((g) => g.skill)));
    const grid = h('div', { class: 'game-grid' }, games.map(gameCard));

    const chips = ['all'].concat(skills).map((s) => {
      const label = s === 'all' ? t('allSkills') : KS.SKILLS[s].emoji + ' ' + L(KS.SKILLS[s].name);
      const chip = h('button', { class: 'chip' + (s === 'all' ? ' on' : ''), type: 'button' }, label);
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.toggle('on', c === chip));
        Array.from(grid.children).forEach((card) => {
          card.hidden = s !== 'all' && card.dataset.skill !== s;
        });
      });
      return chip;
    });

    root.append(
      h('section', { class: 'band-head band-' + bandKey },
        h('span', { class: 'band-emoji' }, band.emoji),
        h('div', {}, h('p', { class: 'band-ages' }, L(band.ages)), h('h1', {}, L(band.name)), h('p', {}, L(band.blurb)))),
      h('div', { class: 'chips' }, chips),
      grid,
      h('h2', { class: 'section-title small' }, t('otherAges')),
      h('div', { class: 'band-mini' }, KS.BAND_ORDER.filter((k) => k !== bandKey).map((k) =>
        h('a', { class: 'mini band-' + k, href: '#/age/' + k }, KS.BANDS[k].emoji + ' ' + L(KS.BANDS[k].ages))))
    );
  };
})(window.KS);
