/* DOM helpers: element builder, confetti and sparkles. */
(function (KS) {
  'use strict';

  /**
   * Build an element. `html` sets innerHTML and must only ever receive strings
   * generated inside this app (game visuals / SVG), never user input.
   */
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') {
        Object.entries(v).forEach(([prop, val]) => {
          if (prop.startsWith('--')) el.style.setProperty(prop, val);
          else el.style[prop] = val;
        });
      }
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else el.setAttribute(k, v === true ? '' : String(v));
    });
    kids.flat(Infinity).forEach((c) => {
      if (c == null || c === false) return;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    });
    return el;
  }

  const reducedMotion = () =>
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CONFETTI_COLORS = ['#FF6B6B', '#FFA94D', '#FFD43B', '#51CF66', '#4DABF7', '#9775FA', '#F783AC'];

  function confetti() {
    if (reducedMotion()) return;
    const layer = h('div', { class: 'confetti', 'aria-hidden': 'true' });
    for (let i = 0; i < 48; i++) {
      layer.append(
        h('i', {
          style: {
            left: Math.random() * 100 + '%',
            background: KS.util.pick(CONFETTI_COLORS),
            animationDelay: Math.random() * 0.6 + 's',
            animationDuration: 1.8 + Math.random() * 1.4 + 's',
            transform: 'rotate(' + Math.random() * 360 + 'deg)',
          },
        })
      );
    }
    document.body.append(layer);
    setTimeout(() => layer.remove(), 3600);
  }

  function sparkle(target) {
    if (reducedMotion() || !target) return;
    const r = target.getBoundingClientRect();
    ['✨', '⭐', '💫', '✨'].forEach((s, i) => {
      const el = h('span', {
        class: 'sparkle',
        'aria-hidden': 'true',
        style: { left: r.left + r.width / 2 + 'px', top: r.top + r.height / 2 + 'px' },
      }, s);
      el.style.setProperty('--dx', Math.cos((i / 4) * Math.PI * 2 + 0.6) * 70 + 'px');
      el.style.setProperty('--dy', Math.sin((i / 4) * Math.PI * 2 + 0.6) * 70 + 'px');
      document.body.append(el);
      setTimeout(() => el.remove(), 900);
    });
  }

  KS.h = h;
  KS.ui = Object.freeze({ confetti, sparkle, reducedMotion });
})(window.KS);
