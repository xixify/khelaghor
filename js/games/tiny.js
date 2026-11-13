/* Games for ages 1–3 (Little Sprouts): big targets, two or three choices, lots of sound. */
(function (KS) {
  'use strict';
  const { util: U } = KS;

  const COLORS = [
    { id: 'red', hex: '#FF5A5F', name: { bn: 'লাল', en: 'red' } },
    { id: 'blue', hex: '#3D8BFD', name: { bn: 'নীল', en: 'blue' } },
    { id: 'yellow', hex: '#FFD43B', name: { bn: 'হলুদ', en: 'yellow' } },
    { id: 'green', hex: '#40C057', name: { bn: 'সবুজ', en: 'green' } },
    { id: 'orange', hex: '#FF922B', name: { bn: 'কমলা', en: 'orange' } },
    { id: 'purple', hex: '#9C6ADE', name: { bn: 'বেগুনি', en: 'purple' } },
    { id: 'pink', hex: '#F783AC', name: { bn: 'গোলাপি', en: 'pink' } },
  ];
  KS.data.COLORS = COLORS;

  /* 1. Pop the bubbles */
  KS.registerGame({
    id: 'bubbles', type: 'custom', bands: ['tiny'], skill: 'motor', icon: '🫧',
    title: { bn: 'বুদবুদ ফাটাই', en: 'Pop the Bubbles' },
    desc: { bn: 'ভেসে ওঠা রঙিন বুদবুদ ছুঁয়ে ফাটাও', en: 'Tap the floating bubbles to pop them' },
    tip: {
      bn: 'শিশুর আঙুল দিয়ে নির্দিষ্ট জায়গায় ছোঁয়ার দক্ষতা বাড়ে। বাইরে সাবান-পানির বুদবুদ বানিয়ে একই খেলা খেলুন।',
      en: 'Builds finger control and aiming. Blow real soap bubbles outside and play the same game.',
    },
    start(stage, ctx) {
      const { h } = KS;
      const GOAL = 12;
      let popped = 0;
      const counter = h('div', { class: 'bubble-count', 'aria-hidden': 'true' });
      const field = h('div', { class: 'bubble-field' });
      const drawCounter = () =>
        counter.replaceChildren(...Array.from({ length: GOAL }, (_, i) => h('span', { class: i < popped ? 'on' : '' })));

      function pop(b, color) {
        if (b.classList.contains('pop')) return;
        b.classList.add('pop');
        ctx.tone('pop');
        ctx.speak(ctx.L(color.name));
        popped += 1;
        drawCounter();
        ctx.later(() => b.remove(), 320);
        if (popped === GOAL) ctx.later(ctx.finish, 700);
      }

      function spawn() {
        if (popped >= GOAL || field.children.length > 7) return;
        const color = U.pick(COLORS);
        const size = U.randInt(70, 120) + 'px';
        const b = h('button', {
          class: 'bubble', type: 'button', 'aria-label': ctx.L(color.name),
          style: {
            left: U.randInt(2, 78) + '%', width: size, height: size,
            background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,.95) 0 12%, ' + color.hex + 'aa 45%, ' + color.hex + ' 100%)',
            animationDuration: U.randInt(60, 90) / 10 + 's',
          },
        });
        b.addEventListener('pointerdown', () => pop(b, color));
        b.addEventListener('animationend', (e) => {
          if (e.animationName === 'floatUp') b.remove();
        });
        field.append(b);
      }

      stage.append(h('p', { class: 'question' }, ctx.L({ bn: 'বুদবুদ ফাটাও!', en: 'Pop the bubbles!' })), counter, field);
      drawCounter();
      spawn();
      ctx.later(spawn, 500);
      ctx.every(spawn, 1100);
      ctx.speak(ctx.L({ bn: 'বুদবুদ ফাটাও!', en: 'Pop the bubbles!' }));
    },
  });

  /* 2. Animal friends */
  KS.registerGame({
    id: 'animals', type: 'explore', bands: ['tiny'], skill: 'language', icon: '🐄', goal: 6,
    title: { bn: 'পশুপাখি বন্ধু', en: 'Animal Friends' },
    desc: { bn: 'ছবি ছুঁয়ে নাম আর ডাক শোনো', en: 'Tap to hear each animal’s name and sound' },
    tip: {
      bn: 'পশুর ডাক নকল করে শিশুকে শোনান — "গরু বলে হাম্বা!" এতে কথা বলা ও শোনার দক্ষতা বাড়ে।',
      en: 'Copy the animal sounds together — "The cow says moo!" It grows speaking and listening skills.',
    },
    items: [
      { emoji: '🐄', name: { bn: 'গরু', en: 'Cow' }, say: { bn: 'গরু বলে হাম্বা', en: 'The cow says moo' } },
      { emoji: '🐈', name: { bn: 'বিড়াল', en: 'Cat' }, say: { bn: 'বিড়াল বলে মিয়াও', en: 'The cat says meow' } },
      { emoji: '🐕', name: { bn: 'কুকুর', en: 'Dog' }, say: { bn: 'কুকুর বলে ঘেউ ঘেউ', en: 'The dog says woof woof' } },
      { emoji: '🦆', name: { bn: 'হাঁস', en: 'Duck' }, say: { bn: 'হাঁস বলে প্যাঁক প্যাঁক', en: 'The duck says quack quack' } },
      { emoji: '🐓', name: { bn: 'মোরগ', en: 'Rooster' }, say: { bn: 'মোরগ বলে কুক্কুরুকু', en: 'The rooster says cock-a-doodle-doo' } },
      { emoji: '🐐', name: { bn: 'ছাগল', en: 'Goat' }, say: { bn: 'ছাগল বলে ভ্যা ভ্যা', en: 'The goat says maa' } },
      { emoji: '🐅', name: { bn: 'বাঘ', en: 'Tiger' }, say: { bn: 'বাঘ বলে হালুম', en: 'The tiger says roar' } },
      { emoji: '🐘', name: { bn: 'হাতি', en: 'Elephant' }, say: { bn: 'হাতির আছে লম্বা শুঁড়', en: 'The elephant has a long trunk' } },
      { emoji: '🐸', name: { bn: 'ব্যাঙ', en: 'Frog' }, say: { bn: 'ব্যাঙ বলে ঘ্যাঙর ঘ্যাঙ', en: 'The frog says ribbit' } },
      { emoji: '🐦', name: { bn: 'পাখি', en: 'Bird' }, say: { bn: 'পাখি গায় কিচিরমিচির', en: 'The bird sings tweet tweet' } },
      { emoji: '🐑', name: { bn: 'ভেড়া', en: 'Sheep' }, say: { bn: 'ভেড়া বলে ব্যা ব্যা', en: 'The sheep says baa' } },
      { emoji: '🐎', name: { bn: 'ঘোড়া', en: 'Horse' }, say: { bn: 'ঘোড়া দৌড়ায় টগবগ', en: 'The horse goes neigh' } },
    ],
  });

  /* 3. Find the color */
  KS.registerGame({
    id: 'colors', type: 'quiz', bands: ['tiny'], skill: 'world', icon: '🎨', rounds: 5,
    title: { bn: 'রঙ চিনি', en: 'Find the Color' },
    desc: { bn: 'যে রঙের নাম শুনবে সেটা ছুঁয়ে দাও', en: 'Tap the color you hear' },
    tip: {
      bn: 'দিনে একটা "রঙের দিন" করুন — আজ সবাই মিলে ঘরে যত লাল জিনিস আছে খুঁজুন।',
      en: 'Have a "color of the day" — hunt for everything red in the house together.',
    },
    makeRound(ctx, i) {
      const opts = U.sample(COLORS, i < 2 ? 2 : 3);
      const target = U.pick(opts);
      return {
        q: ctx.lang === 'bn' ? target.name.bn + ' রঙটা ছুঁয়ে দাও' : 'Tap the ' + target.name.en + ' one',
        optClass: 'tall',
        options: opts.map((c) => ({
          key: c.id,
          html: '<span class="blob" style="background:' + c.hex + '"></span>',
          aria: ctx.L(c.name),
          correct: c === target,
          hint: ctx.lang === 'bn' ? 'এটা ' + c.name.bn : 'That one is ' + c.name.en,
        })),
      };
    },
  });

  /* 4. Shapes */
  const SHAPES = [
    { id: 'circle', name: { bn: 'বৃত্ত (গোল)', en: 'circle' }, svg: '<circle cx="50" cy="50" r="42"/>' },
    { id: 'square', name: { bn: 'বর্গ', en: 'square' }, svg: '<rect x="10" y="10" width="80" height="80" rx="6"/>' },
    { id: 'triangle', name: { bn: 'ত্রিভুজ', en: 'triangle' }, svg: '<polygon points="50,8 94,90 6,90"/>' },
    { id: 'star', name: { bn: 'তারা', en: 'star' }, svg: '<polygon points="50,5 61,37 95,37 67,57 78,91 50,71 22,91 33,57 5,37 39,37"/>' },
    { id: 'heart', name: { bn: 'হার্ট', en: 'heart' }, svg: '<path d="M50 90C20 68 5 50 5 31 5 16 16 6 30 6c10 0 16 6 20 14 4-8 10-14 20-14 14 0 25 10 25 25 0 19-15 37-45 59z"/>' },
    { id: 'rect', name: { bn: 'আয়ত', en: 'rectangle' }, svg: '<rect x="4" y="25" width="92" height="50" rx="6"/>' },
  ];
  KS.registerGame({
    id: 'shapes', type: 'quiz', bands: ['tiny', 'pre'], skill: 'logic', icon: '🔺', rounds: 5,
    title: { bn: 'আকার চিনি', en: 'Shape Friends' },
    desc: { bn: 'গোল, তিনকোনা, তারা — আকার খুঁজে বের করো', en: 'Circle, triangle, star — find the shape' },
    tip: {
      bn: 'রুটি গোল, জানালা চারকোনা! খাবার টেবিলে বা রাস্তায় আকার খুঁজে নাম বলুন।',
      en: 'A roti is a circle, a window is a rectangle! Name shapes you spot at meals or on walks.',
    },
    makeRound(ctx, i) {
      const opts = U.sample(SHAPES, i < 2 ? 2 : 3);
      const target = U.pick(opts);
      return {
        q: ctx.lang === 'bn' ? target.name.bn + ' কোনটা?' : 'Where is the ' + target.name.en + '?',
        optClass: 'tall',
        options: opts.map((s) => ({
          key: s.id,
          html: '<svg viewBox="0 0 100 100" class="shape" fill="' + U.pick(COLORS).hex + '">' + s.svg + '</svg>',
          aria: ctx.L(s.name),
          correct: s === target,
          hint: ctx.lang === 'bn' ? 'এটা ' + s.name.bn : 'That is a ' + s.name.en,
        })),
      };
    },
  });

  /* 5. Big or small */
  const BIG_SMALL = ['🐘', '🐶', '🍎', '🚗', '⚽', '🐻', '🌳', '🐟', '🎈', '🐱', '🏠', '🦆'];
  KS.registerGame({
    id: 'bigsmall', type: 'quiz', bands: ['tiny'], skill: 'logic', icon: '🐘', rounds: 5,
    title: { bn: 'বড় না ছোট?', en: 'Big or Small?' },
    desc: { bn: 'কোনটা বড় আর কোনটা ছোট বলো', en: 'Spot which one is big and which is small' },
    tip: {
      bn: 'বাবার জুতো আর শিশুর জুতো পাশাপাশি রেখে জিজ্ঞেস করুন — কোনটা বড়?',
      en: "Put dad's shoe next to your child's shoe and ask — which one is big?",
    },
    makeRound(ctx) {
      const e = U.pick(BIG_SMALL);
      const askBig = Math.random() < 0.5;
      return {
        q: askBig ? ctx.L({ bn: 'কোনটা বড়?', en: 'Which one is big?' }) : ctx.L({ bn: 'কোনটা ছোট?', en: 'Which one is small?' }),
        optClass: 'tall',
        options: U.shuffle(['big', 'small']).map((size) => ({
          key: size,
          html: '<span class="emoji-' + size + '">' + e + '</span>',
          aria: size === 'big' ? ctx.L({ bn: 'বড়', en: 'big' }) : ctx.L({ bn: 'ছোট', en: 'small' }),
          correct: (size === 'big') === askBig,
        })),
      };
    },
  });

  /* 6. Fruits & vegetables */
  KS.registerGame({
    id: 'fruits', type: 'explore', bands: ['tiny'], skill: 'language', icon: '🥭', goal: 6,
    title: { bn: 'ফল ও সবজি', en: 'Fruits & Vegetables' },
    desc: { bn: 'ছবি ছুঁয়ে ফল আর সবজির নাম শেখো', en: 'Tap to learn the names of fruits and vegetables' },
    tip: {
      bn: 'বাজারে বা রান্নাঘরে সত্যিকারের ফল-সবজি ধরতে দিন, গন্ধ নিতে দিন, নাম বলুন।',
      en: 'At the market or in the kitchen, let your child hold, smell and name real fruits and vegetables.',
    },
    items: [
      { emoji: '🥭', name: { bn: 'আম', en: 'Mango' }, say: { bn: 'আম, মিষ্টি আম', en: 'Mango, a sweet mango' } },
      { emoji: '🍌', name: { bn: 'কলা', en: 'Banana' } },
      { emoji: '🍎', name: { bn: 'আপেল', en: 'Apple' } },
      { emoji: '🍇', name: { bn: 'আঙুর', en: 'Grapes' } },
      { emoji: '🍉', name: { bn: 'তরমুজ', en: 'Watermelon' } },
      { emoji: '🍍', name: { bn: 'আনারস', en: 'Pineapple' } },
      { emoji: '🥥', name: { bn: 'নারকেল', en: 'Coconut' } },
      { emoji: '🍊', name: { bn: 'কমলা', en: 'Orange' } },
      { emoji: '🥕', name: { bn: 'গাজর', en: 'Carrot' } },
      { emoji: '🍆', name: { bn: 'বেগুন', en: 'Eggplant' } },
      { emoji: '🥔', name: { bn: 'আলু', en: 'Potato' } },
      { emoji: '🍅', name: { bn: 'টমেটো', en: 'Tomato' } },
      { emoji: '🌶️', name: { bn: 'মরিচ', en: 'Chili' }, say: { bn: 'মরিচ, খুব ঝাল!', en: 'Chili, very spicy!' } },
      { emoji: '🌽', name: { bn: 'ভুট্টা', en: 'Corn' } },
    ],
  });

  /* 7. My body */
  KS.registerGame({
    id: 'body', type: 'explore', bands: ['tiny'], skill: 'world', icon: '👂', goal: 5,
    title: { bn: 'আমার শরীর', en: 'My Body' },
    desc: { bn: 'চোখ, কান, নাক — কোনটা দিয়ে কী করি?', en: 'Eyes, ears, nose — what do they do?' },
    tip: {
      bn: '"তোমার নাক কোথায়?" — খেলাটার পর শিশুকে নিজের শরীরে দেখাতে বলুন।',
      en: 'After playing, ask "Where is your nose?" and let your child point to it.',
    },
    items: [
      { emoji: '👁️', name: { bn: 'চোখ', en: 'Eyes' }, say: { bn: 'চোখ দিয়ে আমরা দেখি', en: 'We see with our eyes' } },
      { emoji: '👂', name: { bn: 'কান', en: 'Ears' }, say: { bn: 'কান দিয়ে আমরা শুনি', en: 'We hear with our ears' } },
      { emoji: '👃', name: { bn: 'নাক', en: 'Nose' }, say: { bn: 'নাক দিয়ে আমরা গন্ধ নিই', en: 'We smell with our nose' } },
      { emoji: '👄', name: { bn: 'মুখ', en: 'Mouth' }, say: { bn: 'মুখ দিয়ে আমরা খাই আর কথা বলি', en: 'We eat and talk with our mouth' } },
      { emoji: '✋', name: { bn: 'হাত', en: 'Hands' }, say: { bn: 'হাত দিয়ে আমরা ধরি', en: 'We hold things with our hands' } },
      { emoji: '🦶', name: { bn: 'পা', en: 'Feet' }, say: { bn: 'পা দিয়ে আমরা হাঁটি', en: 'We walk with our feet' } },
      { emoji: '🦷', name: { bn: 'দাঁত', en: 'Teeth' }, say: { bn: 'দাঁত দিয়ে আমরা চিবাই', en: 'We chew with our teeth' } },
      { emoji: '💪', name: { bn: 'বাহু', en: 'Arms' }, say: { bn: 'বাহু দিয়ে আমরা জড়িয়ে ধরি', en: 'We hug with our arms' } },
    ],
  });
})(window.KS);
