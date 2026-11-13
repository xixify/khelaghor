/*
 * Quiz engine. A quiz game supplies makeRound(ctx, index) which returns plain data:
 *   { q, say?, visual?, visualClass?, optClass?, cols?,
 *     options: [{ key, text? | html?, aria?, correct, hint? }] }
 * Wrong answers are greyed out (never punished) so the child always reaches the answer.
 */
(function (KS) {
  'use strict';
  const { h } = KS;

  function progressDots(total, index) {
    return Array.from({ length: total }, (_, i) =>
      h('span', { class: 'dot' + (i < index ? ' done' : '') + (i === index ? ' now' : '') })
    );
  }

  function optionButton(opt, onPick) {
    const btn = h('button', {
      class: 'option',
      type: 'button',
      'aria-label': opt.aria || opt.text || null,
      html: opt.html || null,
    }, opt.html ? null : opt.text);
    btn.addEventListener('click', () => onPick(opt, btn));
    return btn;
  }

  KS.engines.quiz = function quiz(stage, ctx, game) {
    const total = game.rounds || 5;
    let index = 0;
    const dots = h('div', { class: 'dots', 'aria-hidden': 'true' });
    const body = h('div', { class: 'quiz' });
    stage.append(dots, body);

    function showRound() {
      if (index >= total) return ctx.finish();
      dots.replaceChildren(...progressDots(total, index));
      const round = game.makeRound(ctx, index);
      let solved = false;
      const sayQuestion = () => ctx.speak(round.say || round.q);

      const onPick = (opt, btn) => {
        if (solved || btn.disabled) return;
        if (opt.correct) {
          solved = true;
          btn.classList.add('right');
          ctx.tone('good');
          ctx.speak(round.after || KS.i18n.praise());
          KS.ui.sparkle(btn);
          index += 1;
          dots.replaceChildren(...progressDots(total, index));
          ctx.later(showRound, round.after ? 2200 : 1400);
        } else {
          btn.classList.add('wrong');
          btn.disabled = true;
          ctx.tone('soft');
          ctx.speak([opt.hint, KS.i18n.encourage()].filter(Boolean).join('। '));
        }
      };

      const cols = round.cols || Math.min(round.options.length, 4);
      const options = h('div', { class: 'options cols-' + cols + (round.optClass ? ' ' + round.optClass : '') },
        round.options.map((opt) => optionButton(opt, onPick)));

      // replaceChildren() would print a literal "null", so drop empty parts first.
      const parts = [
        h('div', { class: 'question' },
          h('button', { class: 'speak-btn', type: 'button', 'aria-label': ctx.t('listen'), onclick: sayQuestion }, '🔊'),
          h('span', {}, round.q)),
        round.visual ? h('div', { class: 'visual ' + (round.visualClass || ''), html: round.visual }) : null,
        options,
      ].filter(Boolean);
      body.replaceChildren(...parts);
      ctx.later(sayQuestion, 350);
      return null;
    }

    showRound();
  };
})(window.KS);
