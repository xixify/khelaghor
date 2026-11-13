/* Game player: builds the game context, runs the engine and shows the sticker screen. */
(function (KS) {
  'use strict';
  const { h } = KS;

  function makeContext(stage, game, onRestart) {
    const timers = [];
    const cleanups = [];
    let finished = false;
    const { t, L, n } = KS.i18n;

    const ctx = {
      get lang() {
        return KS.i18n.lang;
      },
      t, L, n,
      speak: (text, lang) => KS.sound.speak(text, lang),
      tone: (kind, freq) => KS.sound.tone(kind, freq),
      later(fn, ms) {
        timers.push(setTimeout(fn, ms));
      },
      every(fn, ms) {
        const id = setInterval(fn, ms);
        cleanups.push(() => clearInterval(id));
      },
      onCleanup(fn) {
        cleanups.push(fn);
      },
      finish() {
        if (finished) return;
        finished = true;
        showFinish(stage, game, ctx, onRestart);
      },
    };

    const dispose = () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch (err) {
          console.error('[Khelaghor] cleanup failed', err);
        }
      });
      KS.sound.stop();
    };
    return { ctx, dispose };
  }

  function showFinish(stage, game, ctx, onRestart) {
    const plays = KS.progress.record(game.id, game.skill);
    KS.sound.tone('fanfare');
    KS.ui.confetti();
    const band = KS.state.lastBand || game.bands[0];
    const card = h('div', { class: 'finish-card', role: 'dialog', 'aria-live': 'assertive' },
      h('div', { class: 'sticker-big' }, game.icon),
      h('h2', {}, ctx.t('youDidIt')),
      h('p', {}, ctx.t('stickerEarned')),
      h('p', { class: 'muted' }, ctx.t('stickerCount', { n: ctx.n(plays) })),
      h('div', { class: 'row' },
        h('button', { class: 'btn big', type: 'button', onclick: onRestart }, '🔁 ' + ctx.t('playAgain')),
        h('a', { class: 'btn big alt', href: '#/age/' + band }, '🎲 ' + ctx.t('moreGames'))));
    stage.append(h('div', { class: 'finish' }, card));
    ctx.later(() => ctx.speak(ctx.t('youDidIt') + ' ' + ctx.t('stickerEarned')), 300);
  }

  KS.pages.play = function play(root, game, registerCleanup) {
    const { t, L } = KS.i18n;
    const band = KS.state.lastBand && game.bands.includes(KS.state.lastBand) ? KS.state.lastBand : game.bands[0];
    KS.state.lastBand = band;
    const stage = h('div', { class: 'stage' });
    let current = null;

    function start() {
      if (current) current.dispose();
      stage.replaceChildren();
      current = makeContext(stage, game, start);
      try {
        if (game.type === 'custom') game.start(stage, current.ctx);
        else KS.engines[game.type](stage, current.ctx, game);
      } catch (err) {
        console.error('[Khelaghor] game failed to start', game.id, err);
        stage.replaceChildren(h('p', { class: 'question' }, L({ bn: 'দুঃখিত, খেলাটা চালু হয়নি। আবার চেষ্টা করুন।', en: 'Sorry, the game could not start. Please try again.' })));
      }
    }
    registerCleanup(() => current && current.dispose());

    const tip = h('details', { class: 'parent-tip' },
      h('summary', {}, '👪 ' + t('forParents')),
      h('p', {}, L(game.tip)),
      KS.i18n.lang === 'bn' && !KS.sound.hasBanglaVoice() ? h('p', { class: 'muted small' }, t('noBnVoice')) : null);

    root.append(
      h('section', { class: 'play-page band-' + band },
        h('div', { class: 'play-head' },
          h('a', { class: 'btn-round', href: '#/age/' + band, 'aria-label': t('back') }, '←'),
          h('div', { class: 'play-title' }, h('span', { class: 'play-icon' }, game.icon), h('h1', {}, L(game.title))),
          h('button', { class: 'btn-round', type: 'button', 'aria-label': t('playAgain'), title: t('playAgain'), onclick: start }, '🔁')),
        stage,
        tip)
    );
    start();
  };
})(window.KS);
