/* Games for ages 5–7 (Young Explorers): adding, taking away, words, sorting, habits. */
(function (KS) {
  'use strict';
  const { util: U } = KS;
  const group = (e, n, cls) => '<span class="grp' + (cls ? ' ' + cls : '') + '">' + U.repeat('<span>' + e + '</span>', n) + '</span>';
  const numOptions = (ctx, answer, count, min, max) =>
    U.numberChoices(answer, count, min, max).map((c) => ({ key: String(c), text: ctx.n(c), correct: c === answer }));

  /* 16. Adding */
  KS.registerGame({
    id: 'add', type: 'quiz', bands: ['early'], skill: 'math', icon: '➕', rounds: 5,
    title: { bn: 'যোগের মজা', en: 'Add Together' },
    desc: { bn: 'ছবি মিলিয়ে যোগ করো (১০ পর্যন্ত)', en: 'Put the pictures together and add (up to 10)' },
    tip: {
      bn: 'খাবার সময় যোগ করুন: "তোমার প্লেটে ২টা রুটি, আমি আরও ১টা দিলাম — এখন কয়টা?"',
      en: 'Add at mealtimes: "You have 2 rotis, I give you 1 more — how many now?"',
    },
    makeRound(ctx, i) {
      const a = U.randInt(1, 5);
      const b = U.randInt(1, Math.min(5, 10 - a));
      const e = U.pick(['🍎', '⭐', '🐥', '🌸', '🍬', '🎈']);
      return {
        q: ctx.n(a) + ' + ' + ctx.n(b) + ' = ?',
        say: ctx.lang === 'bn' ? ctx.n(a) + ' আর ' + ctx.n(b) + ' মিলে কত হয়?' : 'What is ' + a + ' plus ' + b + '?',
        visual: '<div class="sum-row">' + group(e, a) + '<b class="op">+</b>' + group(e, b) + '<b class="op">=</b><span class="qmark">?</span></div>',
        optClass: 'num',
        options: numOptions(ctx, a + b, i < 2 ? 3 : 4, 1, 10),
      };
    },
  });

  /* 17. Taking away */
  KS.registerGame({
    id: 'subtract', type: 'quiz', bands: ['early'], skill: 'math', icon: '➖', rounds: 5,
    title: { bn: 'কয়টা রইল?', en: 'Take Away' },
    desc: { bn: 'কিছু চলে গেলে কয়টা থাকে? বিয়োগ শেখো', en: 'Some go away — how many are left?' },
    tip: {
      bn: '৫টা বিস্কুট রাখুন, শিশু ২টা খেলো — বাকি কয়টা? সত্যিকারের জিনিস দিয়ে বিয়োগ সবচেয়ে সহজ।',
      en: 'Put out 5 biscuits; your child eats 2 — how many are left? Real objects make subtraction easy.',
    },
    makeRound(ctx, i) {
      const a = U.randInt(3, i < 2 ? 6 : 10);
      const b = U.randInt(1, a - 1);
      const e = U.pick(['🐟', '🍪', '🎈', '🐤', '🍓']);
      return {
        q: ctx.n(a) + ' − ' + ctx.n(b) + ' = ?',
        say: ctx.lang === 'bn'
          ? ctx.n(a) + 'টা থেকে ' + ctx.n(b) + 'টা চলে গেল। কয়টা রইল?'
          : a + ' take away ' + b + '. How many are left?',
        visual: '<div class="sum-row">' + group(e, a - b) + group(e, b, 'gone') + '</div>',
        optClass: 'num',
        options: numOptions(ctx, a - b, 3, 0, 10),
      };
    },
  });

  /* 18. More or less */
  KS.registerGame({
    id: 'compare', type: 'quiz', bands: ['early'], skill: 'math', icon: '⚖️', rounds: 6,
    title: { bn: 'বেশি না কম?', en: 'More or Less?' },
    desc: { bn: 'কোন দিকে বেশি, কোন সংখ্যা বড় — তুলনা করো', en: 'Which side has more? Which number is bigger?' },
    tip: {
      bn: 'দুই হাতে কয়েকটা করে মার্বেল বা ডাল নিয়ে জিজ্ঞেস করুন — কোন হাতে বেশি?',
      en: 'Hold a few beans in each hand and ask — which hand has more?',
    },
    makeRound(ctx, i) {
      const groupsMode = i % 2 === 0;
      const max = groupsMode ? 9 : 20;
      const [a, b] = U.sample(Array.from({ length: max }, (_, k) => k + 1), 2);
      const askMore = Math.random() < 0.6;
      const right = askMore ? Math.max(a, b) : Math.min(a, b);
      const e = U.pick(['🍎', '🐠', '⭐', '🍬']);
      const q = groupsMode
        ? (askMore ? { bn: 'কোন দিকে বেশি আছে?', en: 'Which side has more?' } : { bn: 'কোন দিকে কম আছে?', en: 'Which side has less?' })
        : (askMore ? { bn: 'কোন সংখ্যাটা বড়?', en: 'Which number is bigger?' } : { bn: 'কোন সংখ্যাটা ছোট?', en: 'Which number is smaller?' });
      return {
        q: ctx.L(q),
        optClass: groupsMode ? 'groups tall' : 'num big-num',
        options: [a, b].map((v) => ({
          key: String(v),
          html: groupsMode ? '<span class="emoji-grid small">' + U.repeat('<span>' + e + '</span>', v) + '</span>' : null,
          text: groupsMode ? null : ctx.n(v),
          aria: ctx.n(v),
          correct: v === right,
        })),
      };
    },
  });

  /* 19. Word & picture */
  const VOCAB = [
    ['🐱', 'বিড়াল', 'cat'], ['🐶', 'কুকুর', 'dog'], ['🐟', 'মাছ', 'fish'], ['🌳', 'গাছ', 'tree'], ['🏠', 'বাড়ি', 'house'],
    ['🌙', 'চাঁদ', 'moon'], ['☀️', 'সূর্য', 'sun'], ['🍎', 'আপেল', 'apple'], ['📖', 'বই', 'book'], ['⛵', 'নৌকা', 'boat'],
    ['🐘', 'হাতি', 'elephant'], ['🌸', 'ফুল', 'flower'], ['🚌', 'বাস', 'bus'], ['🥛', 'দুধ', 'milk'], ['🐦', 'পাখি', 'bird'],
    ['⭐', 'তারা', 'star'], ['🍚', 'ভাত', 'rice'], ['☂️', 'ছাতা', 'umbrella'], ['🐄', 'গরু', 'cow'], ['✏️', 'পেন্সিল', 'pencil'],
  ].map(([e, bn, en]) => ({ e, word: { bn, en } }));
  KS.registerGame({
    id: 'wordpic', type: 'quiz', bands: ['early'], skill: 'language', icon: '📖', rounds: 6,
    title: { bn: 'শব্দ পড়ি, ছবি চিনি', en: 'Word & Picture' },
    desc: { bn: 'শব্দটা পড়ে মিলিয়ে ঠিক ছবিটা বেছে নাও', en: 'Read the word and pick the matching picture' },
    tip: {
      bn: 'ঘরের জিনিসে কাগজে নাম লিখে লাগিয়ে দিন — "দরজা", "টেবিল"। শিশু খেলতে খেলতে পড়তে শিখবে।',
      en: 'Stick paper labels on things at home — "door", "table". Your child will start reading through play.',
    },
    makeRound(ctx) {
      const opts = U.sample(VOCAB, 3);
      const target = U.pick(opts);
      const word = ctx.L(target.word);
      return {
        q: ctx.lang === 'bn' ? '“' + word + '” কোনটা?' : 'Which one is “' + word + '”?',
        say: word,
        visual: '<div class="word-card">' + word + '</div>',
        optClass: 'emoji-opts',
        options: opts.map((v) => ({ key: v.e, text: v.e, aria: ctx.L(v.word), correct: v === target })),
      };
    },
  });

  /* 20. Sort it out */
  const SORTS = [
    {
      q: { bn: 'এটা ফল না সবজি?', en: 'Is it a fruit or a vegetable?' },
      a: { e: '🍎', name: { bn: 'ফল', en: 'Fruit' }, items: ['🥭', '🍌', '🍇', '🍉', '🍍', '🍊', '🍓', '🥥'] },
      b: { e: '🥕', name: { bn: 'সবজি', en: 'Vegetable' }, items: ['🥕', '🥔', '🍆', '🥦', '🧅', '🥬', '🧄'] },
    },
    {
      q: { bn: 'এটা জীব না জড়?', en: 'Is it living or non-living?' },
      a: { e: '🌱', name: { bn: 'জীব (প্রাণ আছে)', en: 'Living' }, items: ['🐄', '🌳', '🐦', '👶', '🐟', '🌻', '🐈', '🦋'] },
      b: { e: '🪨', name: { bn: 'জড় (প্রাণ নেই)', en: 'Non-living' }, items: ['🪨', '🚗', '✏️', '🪑', '⚽', '📱', '🔑', '🧸'] },
    },
    {
      q: { bn: 'এটা কোথায় থাকে — পানিতে না ডাঙায়?', en: 'Where does it live — water or land?' },
      a: { e: '🌊', name: { bn: 'পানিতে', en: 'Water' }, items: ['🐟', '🐙', '🐳', '🦀', '🐬', '🦈'] },
      b: { e: '🏞️', name: { bn: 'ডাঙায়', en: 'Land' }, items: ['🐄', '🐘', '🐅', '🐇', '🐐', '🦒'] },
    },
  ];
  KS.registerGame({
    id: 'sort', type: 'quiz', bands: ['early'], skill: 'world', icon: '🧺', rounds: 6,
    title: { bn: 'ভাগ করে সাজাই', en: 'Sort It Out' },
    desc: { bn: 'ফল না সবজি? জীব না জড়? ঠিক দলে রাখো', en: 'Fruit or vegetable? Living or not? Put it in the right group' },
    tip: {
      bn: 'কাপড় ভাঁজ করার সময় শিশুকে সাজাতে দিন — বাবার জামা, মায়ের জামা, নিজের জামা। এটাও শ্রেণিবিভাগ!',
      en: "Let your child sort laundry — dad's, mum's, their own. That's classification too!",
    },
    makeRound(ctx) {
      const s = U.pick(SORTS);
      const fromA = Math.random() < 0.5;
      const item = U.pick(fromA ? s.a.items : s.b.items);
      return {
        q: ctx.L(s.q),
        visual: '<span class="big-emoji">' + item + '</span>',
        optClass: 'labelled',
        options: [s.a, s.b].map((side) => ({
          key: side.e,
          html: '<span class="opt-emoji">' + side.e + '</span><span class="opt-label">' + ctx.L(side.name) + '</span>',
          aria: ctx.L(side.name),
          correct: (side === s.a) === fromA,
        })),
      };
    },
  });

  /* 21. Good habits */
  const HABITS = [
    { q: { bn: 'খাওয়ার আগে আমরা কী করি?', en: 'What do we do before eating?' }, right: ['🧼', { bn: 'সাবান দিয়ে হাত ধুই', en: 'Wash hands with soap' }], wrong: [['📺', { bn: 'টিভি দেখি', en: 'Watch TV' }], ['🟫', { bn: 'কাদা মাখি', en: 'Play in the mud' }]] },
    { q: { bn: 'ঘুম থেকে উঠে আমরা কী করি?', en: 'What do we do after waking up?' }, right: ['🪥', { bn: 'দাঁত ব্রাশ করি', en: 'Brush our teeth' }], wrong: [['🍬', { bn: 'চকলেট খাই', en: 'Eat chocolate' }], ['😴', { bn: 'আবার ঘুমাই', en: 'Go back to sleep' }]] },
    { q: { bn: 'কেউ সাহায্য করলে আমরা কী বলি?', en: 'What do we say when someone helps us?' }, right: ['🙏', { bn: 'ধন্যবাদ', en: 'Thank you' }], wrong: [['🙈', { bn: 'কিছু বলি না', en: 'Nothing' }], ['😝', { bn: 'জিভ দেখাই', en: 'Stick out our tongue' }]] },
    { q: { bn: 'রাস্তা পার হওয়ার সময় কী করি?', en: 'What do we do when crossing the road?' }, right: ['🤝', { bn: 'বড়দের হাত ধরি', en: "Hold a grown-up's hand" }], wrong: [['🏃', { bn: 'একা দৌড় দিই', en: 'Run across alone' }], ['📱', { bn: 'ফোন দেখি', en: 'Look at a phone' }]] },
    { q: { bn: 'খেলা শেষে খেলনা কোথায় রাখি?', en: 'Where do toys go after playing?' }, right: ['📦', { bn: 'খেলনার বাক্সে', en: 'Back in the toy box' }], wrong: [['🛏️', { bn: 'বিছানায় ছড়িয়ে', en: 'Spread on the bed' }], ['🚪', { bn: 'দরজার সামনে', en: 'In front of the door' }]] },
    { q: { bn: 'বন্ধু মন খারাপ করলে কী করি?', en: 'What do we do when a friend is sad?' }, right: ['🤗', { bn: 'পাশে বসে কথা বলি', en: 'Sit with them and talk' }], wrong: [['😂', { bn: 'হাসাহাসি করি', en: 'Laugh at them' }], ['🚶', { bn: 'চলে যাই', en: 'Walk away' }]] },
    { q: { bn: 'ময়লা কোথায় ফেলি?', en: 'Where does rubbish go?' }, right: ['🗑️', { bn: 'ময়লার ঝুড়িতে', en: 'In the dustbin' }], wrong: [['🛣️', { bn: 'রাস্তায়', en: 'On the road' }], ['🏞️', { bn: 'নদীতে', en: 'In the river' }]] },
    { q: { bn: 'ভুল করলে আমরা কী বলি?', en: 'What do we say when we make a mistake?' }, right: ['🙇', { bn: 'দুঃখিত', en: 'Sorry' }], wrong: [['😤', { bn: 'রাগ দেখাই', en: 'Get angry' }], ['🤫', { bn: 'লুকিয়ে থাকি', en: 'Hide it' }]] },
    { q: { bn: 'তৃষ্ণা পেলে কী খাই?', en: 'What do we drink when thirsty?' }, right: ['💧', { bn: 'পরিষ্কার পানি', en: 'Clean water' }], wrong: [['🥤', { bn: 'অনেক কোমল পানীয়', en: 'Lots of fizzy drinks' }], ['☕', { bn: 'কড়া চা', en: 'Strong tea' }]] },
  ];
  KS.registerGame({
    id: 'habits', type: 'quiz', bands: ['early', 'pre'], skill: 'life', icon: '🧼', rounds: 5,
    title: { bn: 'ভালো অভ্যাস', en: 'Good Habits' },
    desc: { bn: 'পরিচ্ছন্নতা, ভদ্রতা আর নিরাপত্তা — ঠিক কাজটা বেছে নাও', en: 'Cleanliness, kindness and safety — choose the right thing to do' },
    tip: {
      bn: 'শিশু যখন সত্যিই ভালো কাজটা করে, নির্দিষ্ট করে প্রশংসা করুন: "তুমি নিজে হাত ধুয়েছ, খুব ভালো!"',
      en: 'When your child really does the good thing, praise it specifically: "You washed your hands by yourself — great!"',
    },
    makeRound: (function () {
      const nextHabit = U.deck(HABITS);
      return function (ctx) {
        const item = nextHabit();
        const all = [item.right].concat(item.wrong);
        return {
          q: ctx.L(item.q),
          optClass: 'labelled stack',
          cols: 1,
          options: U.shuffle(all).map(([e, label]) => ({
            key: e,
            html: '<span class="opt-emoji">' + e + '</span><span class="opt-label">' + ctx.L(label) + '</span>',
            aria: ctx.L(label),
            correct: e === item.right[0],
          })),
        };
      };
    })(),
  });

  /* 22. Opposites */
  const OPPOSITES = [
    [['🔥', { bn: 'গরম', en: 'hot' }], ['❄️', { bn: 'ঠান্ডা', en: 'cold' }]],
    [['🐘', { bn: 'বড়', en: 'big' }], ['🐭', { bn: 'ছোট', en: 'small' }]],
    [['☀️', { bn: 'দিন', en: 'day' }], ['🌙', { bn: 'রাত', en: 'night' }]],
    [['😀', { bn: 'খুশি', en: 'happy' }], ['😢', { bn: 'দুঃখী', en: 'sad' }]],
    [['⬆️', { bn: 'উপরে', en: 'up' }], ['⬇️', { bn: 'নিচে', en: 'down' }]],
    [['🐇', { bn: 'দ্রুত', en: 'fast' }], ['🐢', { bn: 'ধীরে', en: 'slow' }]],
    [['🦒', { bn: 'লম্বা', en: 'tall' }], ['🐧', { bn: 'খাটো', en: 'short' }]],
    [['📖', { bn: 'খোলা', en: 'open' }], ['📕', { bn: 'বন্ধ', en: 'closed' }]],
    [['🪶', { bn: 'হালকা', en: 'light' }], ['🪨', { bn: 'ভারী', en: 'heavy' }]],
  ];
  KS.registerGame({
    id: 'opposites', type: 'quiz', bands: ['early'], skill: 'language', icon: '🔄', rounds: 5,
    title: { bn: 'উল্টো শব্দ', en: 'Opposites' },
    desc: { bn: 'গরম-ঠান্ডা, দিন-রাত — উল্টোটা খুঁজে বের করো', en: 'Hot-cold, day-night — find the opposite' },
    tip: {
      bn: '"আমি বলি উপরে, তুমি বলো…?" — মুখে মুখে উল্টো শব্দের খেলা গাড়িতে বা হাঁটার সময় খেলুন।',
      en: '"I say up, you say…?" Play the opposites game out loud on walks or car rides.',
    },
    makeRound(ctx) {
      const pair = U.pick(OPPOSITES);
      const flip = Math.random() < 0.5;
      const [from, to] = flip ? [pair[1], pair[0]] : pair;
      const others = U.sample(OPPOSITES.filter((p) => p !== pair), 2).map((p) => U.pick(p));
      const word = ctx.L(from[1]);
      return {
        q: ctx.lang === 'bn' ? '“' + word + '”-এর উল্টো কী?' : 'What is the opposite of “' + word + '”?',
        visual: '<div class="word-card"><span class="big-emoji inline">' + from[0] + '</span> ' + word + '</div>',
        optClass: 'labelled',
        cols: 3,
        options: U.shuffle(others.concat([to])).map(([e, label]) => ({
          key: e,
          html: '<span class="opt-emoji">' + e + '</span><span class="opt-label">' + ctx.L(label) + '</span>',
          aria: ctx.L(label),
          correct: e === to[0],
        })),
      };
    },
  });
})(window.KS);
