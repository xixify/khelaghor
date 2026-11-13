/*
 * Explore engine: a picture/letter board. Tap a card to see it big and hear its name.
 * Items: { emoji, letter?, name:{bn,en}, say?:{bn,en}, group?:{bn,en} }
 * After `goal` different cards the child may finish whenever they like.
 */
(function (KS) {
  'use strict';
  const { h } = KS;

  KS.engines.explore = function explore(stage, ctx, game) {
    const goal = Math.min(game.goal || 6, game.items.length);
    const seen = new Set();

    const spotEmoji = h('div', { class: 'spot-emoji' }, '👆');
    const spotName = h('div', { class: 'spot-name' }, ctx.t('tapToExplore'));
    const spotSub = h('div', { class: 'spot-sub' });
    const spotlight = h('div', { class: 'spotlight', 'aria-live': 'polite' }, spotEmoji, spotName, spotSub);
    const meter = h('div', { class: 'meter', 'aria-hidden': 'true' });
    const doneBtn = h('button', { class: 'btn big hidden', type: 'button', onclick: () => ctx.finish() }, ctx.t('imDone'));
    const grid = h('div', { class: 'explore-grid' + (game.cardShows === 'letter' ? ' letters' : '') });

    function updateMeter() {
      const filled = Math.min(seen.size, goal);
      meter.replaceChildren(...Array.from({ length: goal }, (_, i) => h('span', { class: i < filled ? 'on' : '' }, '⭐')));
      doneBtn.classList.toggle('hidden', seen.size < goal);
    }

    function sayItem(item) {
      const text = ctx.L(item.say) || ctx.L(item.name);
      ctx.speak(text, game.speakLang);
    }

    function show(item, card) {
      seen.add(item);
      card.classList.add('seen');
      spotEmoji.textContent = item.letter ? item.letter : item.emoji;
      spotName.textContent = (item.letter ? item.emoji + '  ' : '') + ctx.L(item.name);
      spotSub.textContent = item.sub ? ctx.L(item.sub) : '';
      spotlight.classList.remove('pulse');
      void spotlight.offsetWidth; // restart the animation
      spotlight.classList.add('pulse');
      ctx.tone('tap');
      sayItem(item);
      updateMeter();
    }

    let lastGroup = null;
    game.items.forEach((item) => {
      const groupLabel = item.group ? ctx.L(item.group) : null;
      if (groupLabel && groupLabel !== lastGroup) {
        grid.append(h('h3', { class: 'group-title' }, groupLabel));
        lastGroup = groupLabel;
      }
      const card = h('button', { class: 'explore-card', type: 'button', 'aria-label': ctx.L(item.name) },
        game.cardShows === 'letter' ? item.letter : item.emoji);
      card.addEventListener('click', () => show(item, card));
      grid.append(card);
    });

    stage.append(spotlight, h('div', { class: 'meter-row' }, meter, doneBtn), grid);
    updateMeter();
  };
})(window.KS);
