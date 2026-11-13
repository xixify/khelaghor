/*
 * Memory-pairs engine. No move counter and no timer: the child plays until every pair is found.
 * game.pool: [{ emoji, name:{bn,en} }], game.levels: [{ label:{bn,en}, pairs }]
 */
(function (KS) {
  'use strict';
  const { h, util: U } = KS;

  function chooseLevel(stage, ctx, levels, onChoose) {
    const wrap = h('div', { class: 'level-pick' },
      h('p', { class: 'question' }, ctx.t('pickLevel')),
      h('div', { class: 'options cols-' + levels.length },
        levels.map((lv) => h('button', { class: 'option level', type: 'button', onclick: () => onChoose(lv) },
          h('span', { class: 'level-cards' }, U.repeat('🟧', Math.min(lv.pairs, 4))),
          h('span', {}, ctx.L(lv.label) + ' · ' + ctx.n(lv.pairs * 2))))));
    stage.append(wrap);
    ctx.speak(ctx.t('pickLevel'));
  }

  function play(stage, ctx, game, pairs) {
    const chosen = U.sample(game.pool, pairs);
    const deck = U.shuffle(chosen.concat(chosen)).map((item, i) => ({ item, id: i }));
    let open = [];
    let matched = 0;
    let busy = false;

    const cols = pairs <= 3 ? 3 : 4;
    const board = h('div', { class: 'memory-board cols-' + cols });

    function flip(card, el) {
      if (busy || el.classList.contains('flipped')) return;
      el.classList.add('flipped');
      ctx.tone('tap');
      open = open.concat([{ card, el }]);
      if (open.length < 2) return;
      const [a, b] = open;
      open = [];
      if (a.card.item === b.card.item) {
        matched += 1;
        [a.el, b.el].forEach((x) => x.classList.add('matched'));
        ctx.tone('good');
        ctx.speak(ctx.L(a.card.item.name));
        KS.ui.sparkle(b.el);
        if (matched === pairs) ctx.later(ctx.finish, 1000);
      } else {
        busy = true;
        ctx.later(() => {
          [a.el, b.el].forEach((x) => x.classList.remove('flipped'));
          busy = false;
        }, 1000);
      }
    }

    deck.forEach((card) => {
      const el = h('button', { class: 'mem-card', type: 'button', 'aria-label': '?' },
        h('span', { class: 'mem-inner' },
          h('span', { class: 'mem-front' }, '❓'),
          h('span', { class: 'mem-back' }, card.item.emoji)));
      el.addEventListener('click', () => flip(card, el));
      board.append(el);
    });

    stage.append(h('p', { class: 'question' }, ctx.L({ bn: 'একই রকম দুটো ছবি খুঁজে বের করো', en: 'Find the matching pairs' })), board);
  }

  KS.engines.memory = function memory(stage, ctx, game) {
    const levels = game.levels || [{ label: { bn: 'সহজ', en: 'Easy' }, pairs: 3 }];
    if (levels.length === 1) return play(stage, ctx, game, levels[0].pairs);
    chooseLevel(stage, ctx, levels, (lv) => {
      stage.replaceChildren();
      play(stage, ctx, game, lv.pairs);
    });
    return null;
  };
})(window.KS);
