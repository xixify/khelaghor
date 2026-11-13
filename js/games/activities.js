/* Interactive activities with their own mechanics: light sequence, spelling, drawing. */
(function (KS) {
  'use strict';
  const { util: U } = KS;

  /* 28. Follow the lights — sequence memory. A mistake simply replays the sequence. */
  const PADS = [
    { color: '#FF6B6B', emoji: '🍎', freq: 330 },
    { color: '#4DABF7', emoji: '🐳', freq: 392 },
    { color: '#51CF66', emoji: '🐸', freq: 440 },
    { color: '#FCC419', emoji: '⭐', freq: 523 },
  ];
  KS.registerGame({
    id: 'lights', type: 'custom', bands: ['early', 'primary'], skill: 'memory', icon: '🚦',
    title: { bn: 'আলো অনুসরণ করো', en: 'Follow the Lights' },
    desc: { bn: 'কোন আলো কোন ক্রমে জ্বলল মনে রেখে একই ভাবে ছোঁও', en: 'Remember the order the lights glow, then repeat it' },
    tip: {
      bn: 'মুখে বলে মনে রাখার কৌশল শেখান: "আপেল, তিমি, ব্যাঙ…"। এই কাজের স্মৃতি পড়া ও অংকে সাহায্য করে।',
      en: 'Teach the trick of saying it aloud: "apple, whale, frog…". Working memory helps with reading and math.',
    },
    start(stage, ctx) {
      const { h } = KS;
      const GOAL = 5;
      let seq = [U.randInt(0, 3), U.randInt(0, 3)];
      let pos = 0;
      let listening = false;
      const status = h('p', { class: 'question' }, ctx.t('watch'));
      const level = h('div', { class: 'dots', 'aria-hidden': 'true' });
      const board = h('div', { class: 'simon' });

      const drawLevel = () => level.replaceChildren(...Array.from({ length: GOAL - 1 }, (_, i) =>
        h('span', { class: 'dot' + (i < seq.length - 2 ? ' done' : '') })));

      const pads = PADS.map((p, idx) => {
        const el = h('button', { class: 'pad', type: 'button', style: { '--c': p.color }, 'aria-label': p.emoji }, p.emoji);
        el.addEventListener('click', () => press(idx));
        board.append(el);
        return el;
      });

      function flash(idx) {
        const el = pads[idx];
        el.classList.add('lit');
        ctx.tone('note', PADS[idx].freq);
        ctx.later(() => el.classList.remove('lit'), 420);
      }

      function playback() {
        listening = false;
        pos = 0;
        status.textContent = ctx.t('watch');
        seq.forEach((idx, k) => ctx.later(() => flash(idx), 700 + k * 750));
        ctx.later(() => {
          listening = true;
          status.textContent = ctx.t('yourTurn');
        }, 700 + seq.length * 750);
      }

      function press(idx) {
        if (!listening) return;
        flash(idx);
        if (idx !== seq[pos]) {
          listening = false;
          status.textContent = ctx.t('watchAgain');
          ctx.speak(ctx.t('watchAgain'));
          ctx.later(playback, 1200);
          return;
        }
        pos += 1;
        if (pos < seq.length) return;
        listening = false;
        ctx.speak(KS.i18n.praise());
        if (seq.length >= GOAL + 1) {
          ctx.later(ctx.finish, 900);
          return;
        }
        seq = seq.concat([U.randInt(0, 3)]);
        drawLevel();
        ctx.later(playback, 1300);
      }

      stage.append(level, status, board);
      drawLevel();
      playback();
    },
  });

  /* 29. Spelling builder — guided: only the next correct piece can be placed. */
  const EN_WORDS = [
    ['🐱', 'CAT'], ['🐶', 'DOG'], ['☀️', 'SUN'], ['🐟', 'FISH'], ['📖', 'BOOK'], ['🌳', 'TREE'], ['🥛', 'MILK'],
    ['🐦', 'BIRD'], ['⭐', 'STAR'], ['🎂', 'CAKE'], ['⛵', 'BOAT'], ['🐄', 'COW'], ['🦆', 'DUCK'], ['🍎', 'APPLE'],
  ].map(([e, w]) => ({ e, word: w, parts: w.split('') }));
  const BN_WORDS = [
    ['🐟', 'মাছ', ['মা', 'ছ']], ['🖊️', 'কলম', ['ক', 'ল', 'ম']], ['📖', 'বই', ['ব', 'ই']], ['🌳', 'গাছ', ['গা', 'ছ']],
    ['⛵', 'নৌকা', ['নৌ', 'কা']], ['🐦', 'পাখি', ['পা', 'খি']], ['🌸', 'ফুল', ['ফু', 'ল']], ['🌙', 'চাঁদ', ['চাঁ', 'দ']],
    ['🏠', 'বাড়ি', ['বা', 'ড়ি']], ['🥭', 'আম', ['আ', 'ম']], ['🥛', 'দুধ', ['দু', 'ধ']], ['🐱', 'বিড়াল', ['বি', 'ড়া', 'ল']],
    ['🐘', 'হাতি', ['হা', 'তি']], ['☂️', 'ছাতা', ['ছা', 'তা']], ['🦆', 'হাঁস', ['হাঁ', 'স']],
  ].map(([e, w, parts]) => ({ e, word: w, parts }));
  KS.data.SPELL_WORDS = { en: EN_WORDS, bn: BN_WORDS };

  KS.registerGame({
    id: 'spell', type: 'custom', bands: ['early', 'primary'], skill: 'language', icon: '✍️',
    title: { bn: 'শব্দ বানাই', en: 'Spelling Builder' },
    desc: { bn: 'ছবি দেখে অক্ষর সাজিয়ে শব্দ বানাও', en: 'Look at the picture and build the word' },
    tip: {
      bn: 'শব্দ বানানোর পর খাতায় লিখতে দিন এবং শব্দটা দিয়ে একটা বাক্য বলতে বলুন।',
      en: 'After building a word, ask your child to write it in a notebook and make a sentence with it.',
    },
    start(stage, ctx) {
      const { h } = KS;
      const ROUNDS = 4;
      const words = U.sample(KS.data.SPELL_WORDS[ctx.lang], ROUNDS);
      let round = 0;
      const dots = h('div', { class: 'dots', 'aria-hidden': 'true' });
      const body = h('div', { class: 'spell' });
      stage.append(dots, body);

      function showWord() {
        if (round >= ROUNDS) return ctx.finish();
        dots.replaceChildren(...Array.from({ length: ROUNDS }, (_, i) => h('span', { class: 'dot' + (i < round ? ' done' : '') + (i === round ? ' now' : '') })));
        const w = words[round];
        let next = 0;
        const slots = w.parts.map(() => h('span', { class: 'slot' }));
        const sayWord = () => ctx.speak(w.word);
        const markNext = () => slots.forEach((s, i) => s.classList.toggle('next', i === next));

        const tiles = U.shuffle(w.parts.map((p, i) => ({ p, i }))).map((t) => {
          const el = h('button', { class: 'tile', type: 'button' }, t.p);
          el.addEventListener('click', () => {
            if (el.disabled) return;
            if (t.p !== w.parts[next]) {
              el.classList.remove('wiggle');
              void el.offsetWidth;
              el.classList.add('wiggle');
              ctx.tone('soft');
              return;
            }
            slots[next].textContent = t.p;
            slots[next].classList.add('filled');
            el.disabled = true;
            el.classList.add('used');
            ctx.tone('pop');
            next += 1;
            markNext();
            if (next === w.parts.length) {
              ctx.tone('good');
              KS.ui.sparkle(slots[slots.length - 1]);
              ctx.later(sayWord, 300);
              round += 1;
              ctx.later(showWord, 2000);
            }
          });
          return el;
        });

        body.replaceChildren(
          h('div', { class: 'question' },
            h('button', { class: 'speak-btn', type: 'button', 'aria-label': ctx.t('listen'), onclick: sayWord }, '🔊'),
            h('span', {}, ctx.L({ bn: 'অক্ষর সাজিয়ে শব্দটা বানাও', en: 'Build the word' }))),
          h('div', { class: 'big-emoji' }, w.e),
          h('div', { class: 'slots' }, slots),
          h('div', { class: 'tiles' }, tiles)
        );
        markNext();
        ctx.later(sayWord, 400);
        return null;
      }
      showWord();
    },
  });

  /* 30. Drawing board — open-ended creativity for every age. */
  const PAINT = ['#2B2A4C', '#FF5A5F', '#FF922B', '#FFD43B', '#40C057', '#3D8BFD', '#9C6ADE', '#F783AC', '#8B5E3C'];
  const IDEAS = [
    { bn: 'তোমার পরিবার', en: 'Your family' }, { bn: 'নদীতে একটা নৌকা', en: 'A boat on the river' },
    { bn: 'বৃষ্টির দিন', en: 'A rainy day' }, { bn: 'তোমার প্রিয় খাবার', en: 'Your favourite food' },
    { bn: 'একটা বড় গাছ আর পাখি', en: 'A big tree with birds' }, { bn: 'সূর্য, মেঘ আর রংধনু', en: 'Sun, clouds and a rainbow' },
    { bn: 'তোমার স্বপ্নের বাড়ি', en: 'Your dream house' }, { bn: 'চিড়িয়াখানার একটা প্রাণী', en: 'An animal from the zoo' },
  ];
  KS.registerGame({
    id: 'draw', type: 'custom', bands: ['tiny', 'pre', 'early', 'primary'], skill: 'creative', icon: '🖍️',
    title: { bn: 'ছবি আঁকি', en: 'Drawing Board' },
    desc: { bn: 'রঙ বেছে যা খুশি আঁকো — কোনো ঠিক-ভুল নেই', en: 'Pick colors and draw anything — there is no right or wrong' },
    tip: {
      bn: 'ছবির "ভুল" ধরবেন না। জিজ্ঞেস করুন "এটার গল্পটা বলো তো!" — আঁকা থেকেই গল্প বলা ও ভাষা বাড়ে।',
      en: 'Never correct a drawing. Ask "Tell me the story of this!" — drawing grows storytelling and language.',
    },
    start(stage, ctx) {
      const { h } = KS;
      let color = PAINT[1];
      let size = 10;
      let erasing = false;
      let drawing = false;
      let last = null;
      const canvas = h('canvas', { class: 'draw-canvas', 'aria-label': ctx.L({ bn: 'আঁকার জায়গা', en: 'Drawing area' }) });
      const g = canvas.getContext('2d');
      const idea = h('span', { class: 'idea-text' }, '');

      function fitCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const hgt = canvas.clientHeight;
        if (!w || !hgt) return;
        const snapshot = canvas.width ? canvas.toDataURL() : null;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(hgt * dpr);
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.fillStyle = '#fff';
        g.fillRect(0, 0, w, hgt);
        if (snapshot) {
          const img = new Image();
          img.onload = () => g.drawImage(img, 0, 0, w, hgt);
          img.src = snapshot;
        }
      }

      const point = (e) => {
        const r = canvas.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      function line(a, b) {
        g.strokeStyle = erasing ? '#fff' : color;
        g.lineWidth = erasing ? size * 2.5 : size;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
        g.stroke();
      }
      canvas.addEventListener('pointerdown', (e) => {
        drawing = true;
        last = point(e);
        line(last, { x: last.x + 0.1, y: last.y + 0.1 });
        if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
      });
      canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const p = point(e);
        line(last, p);
        last = p;
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => canvas.addEventListener(ev, () => { drawing = false; }));

      const swatches = PAINT.map((c) => {
        const b = h('button', { class: 'swatch' + (c === color ? ' on' : ''), type: 'button', style: { background: c }, 'aria-label': c });
        b.addEventListener('click', () => {
          color = c;
          erasing = false;
          swatches.concat([eraser]).forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        });
        return b;
      });
      const eraser = h('button', { class: 'tool', type: 'button', title: ctx.L({ bn: 'রাবার', en: 'Eraser' }) }, '🧽');
      eraser.addEventListener('click', () => {
        erasing = true;
        swatches.forEach((x) => x.classList.remove('on'));
        eraser.classList.add('on');
      });
      const sizes = [5, 10, 20].map((s) => {
        const b = h('button', { class: 'tool size' + (s === size ? ' on' : ''), type: 'button', 'aria-label': String(s) }, h('i', { style: { width: s + 4 + 'px', height: s + 4 + 'px' } }));
        b.addEventListener('click', () => {
          size = s;
          sizes.forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        });
        return b;
      });
      const clear = h('button', { class: 'tool', type: 'button', title: ctx.L({ bn: 'সব মুছি', en: 'Clear' }), onclick: () => {
        g.fillStyle = '#fff';
        g.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      } }, '🗑️');
      const save = h('button', { class: 'tool', type: 'button', title: ctx.L({ bn: 'ছবি সংরক্ষণ', en: 'Save picture' }), onclick: () => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'khelaghor-drawing.png';
        a.click();
      } }, '💾');
      const nextIdea = () => {
        const text = ctx.L(U.pick(IDEAS));
        idea.textContent = text;
        ctx.speak(text);
      };

      stage.append(
        h('div', { class: 'idea-row' },
          h('button', { class: 'btn small alt', type: 'button', onclick: nextIdea }, '💡 ' + ctx.L({ bn: 'কী আঁকব?', en: 'What to draw?' })), idea),
        h('div', { class: 'draw-toolbar' }, swatches, h('span', { class: 'sep' }), sizes, eraser, clear, save),
        canvas,
        h('div', { class: 'center' }, h('button', { class: 'btn big', type: 'button', onclick: () => ctx.finish() }, ctx.L({ bn: 'আঁকা শেষ! ⭐', en: 'Finished! ⭐' })))
      );
      requestAnimationFrame(fitCanvas);
      const onResize = () => fitCanvas();
      window.addEventListener('resize', onResize);
      ctx.onCleanup(() => window.removeEventListener('resize', onResize));
    },
  });
})(window.KS);
