/* Games for ages 3–5 (Curious Cubs): counting, letters, matching, patterns, feelings. */
(function (KS) {
  'use strict';
  const { util: U } = KS;
  const span = (e) => '<span>' + e + '</span>';

  /* 8. Let's count */
  const COUNT_EMOJI = ['🍎', '⭐', '🐟', '🎈', '🐥', '🌸', '🚗', '🍌', '🦋', '⚽'];
  KS.registerGame({
    id: 'count', type: 'quiz', bands: ['pre'], skill: 'math', icon: '🔢', rounds: 5,
    title: { bn: 'চলো গুনি', en: "Let's Count" },
    desc: { bn: 'ছবি গুনে ঠিক সংখ্যাটা বেছে নাও', en: 'Count the pictures and pick the number' },
    tip: {
      bn: 'আঙুল দিয়ে একটা একটা করে ছুঁয়ে গুনতে শেখান। সিঁড়ি, চামচ, বোতাম — সবকিছুই গোনা যায়!',
      en: 'Teach your child to touch each item while counting. Stairs, spoons, buttons — everything can be counted!',
    },
    makeRound(ctx, i) {
      const n = U.randInt(1, i < 2 ? 5 : 10);
      const e = U.pick(COUNT_EMOJI);
      return {
        q: ctx.L({ bn: 'কয়টা আছে? গুনে দেখো', en: "How many are there? Let's count!" }),
        visual: '<div class="emoji-grid">' + U.repeat(span(e), n) + '</div>',
        optClass: 'num',
        options: U.numberChoices(n, 3, 1, 10).map((c) => ({ key: String(c), text: ctx.n(c), correct: c === n })),
      };
    },
  });

  /* 9. Memory cards */
  KS.registerGame({
    id: 'memory', type: 'memory', bands: ['pre', 'early', 'primary'], skill: 'memory', icon: '🃏',
    title: { bn: 'মনে রাখার খেলা', en: 'Memory Cards' },
    desc: { bn: 'কার্ড উল্টে একই রকম জোড়া খুঁজে বের করো', en: 'Flip the cards and find matching pairs' },
    tip: {
      bn: 'তাড়াহুড়ো নয় — শিশুকে বলতে বলুন "আগে এখানে মাছ দেখেছিলাম"। এভাবে মনোযোগ ও স্মৃতি বাড়ে।',
      en: 'No rushing — ask your child to say aloud "I saw the fish here". It strengthens focus and memory.',
    },
    levels: [
      { label: { bn: 'সহজ', en: 'Easy' }, pairs: 3 },
      { label: { bn: 'মাঝারি', en: 'Medium' }, pairs: 6 },
      { label: { bn: 'চ্যালেঞ্জ', en: 'Challenge' }, pairs: 8 },
    ],
    pool: [
      { emoji: '🐶', name: { bn: 'কুকুর', en: 'Dog' } }, { emoji: '🐱', name: { bn: 'বিড়াল', en: 'Cat' } },
      { emoji: '🐟', name: { bn: 'মাছ', en: 'Fish' } }, { emoji: '🦋', name: { bn: 'প্রজাপতি', en: 'Butterfly' } },
      { emoji: '🥭', name: { bn: 'আম', en: 'Mango' } }, { emoji: '🌸', name: { bn: 'ফুল', en: 'Flower' } },
      { emoji: '⛵', name: { bn: 'নৌকা', en: 'Boat' } }, { emoji: '🌙', name: { bn: 'চাঁদ', en: 'Moon' } },
      { emoji: '🐘', name: { bn: 'হাতি', en: 'Elephant' } }, { emoji: '🍌', name: { bn: 'কলা', en: 'Banana' } },
      { emoji: '🚲', name: { bn: 'সাইকেল', en: 'Bicycle' } }, { emoji: '⭐', name: { bn: 'তারা', en: 'Star' } },
    ],
  });

  /* 10. Bangla letters */
  const BN_LETTERS = [
    ['অ', '🐍', 'অজগর', 'python'], ['আ', '🥭', 'আম', 'mango'], ['ই', '🐭', 'ইঁদুর', 'mouse'],
    ['ঈ', '🦅', 'ঈগল', 'eagle'], ['উ', '🐫', 'উট', 'camel'], ['ঊ', '🌅', 'ঊষা', 'dawn'],
    ['ঋ', '🧘', 'ঋষি', 'sage'], ['এ', '🪕', 'একতারা', 'one-string lute'], ['ঐ', '🐘', 'ঐরাবত', 'royal elephant'],
    ['ও', '⚖️', 'ওজন', 'weight'], ['ঔ', '💊', 'ঔষধ', 'medicine'],
  ].map(([letter, emoji, word, en]) => ({
    letter, emoji, group: { bn: 'স্বরবর্ণ', en: 'Vowels' },
    name: { bn: word, en: word + ' · ' + en }, say: { bn: letter + '। ' + letter + '-তে ' + word, en: letter + '। ' + word },
  }));
  const BN_CONSONANTS = [
    ['ক', '🍌', 'কলা', 'banana'], ['খ', '🐇', 'খরগোশ', 'rabbit'], ['গ', '🐄', 'গরু', 'cow'], ['ঘ', '⏰', 'ঘড়ি', 'clock'],
    ['ঙ', '🐸', 'ব্যাঙ', 'frog'], ['চ', '👓', 'চশমা', 'glasses'], ['ছ', '☂️', 'ছাতা', 'umbrella'], ['জ', '🚢', 'জাহাজ', 'ship'],
    ['ঝ', '🧺', 'ঝুড়ি', 'basket'], ['ঞ', '📏', 'ইঞ্চি', 'inch'], ['ট', '🍅', 'টমেটো', 'tomato'], ['ঠ', '👄', 'ঠোঁট', 'lips'],
    ['ড', '🥚', 'ডিম', 'egg'], ['ঢ', '🥁', 'ঢোল', 'drum'], ['ণ', '🦌', 'হরিণ', 'deer'], ['ত', '🍉', 'তরমুজ', 'watermelon'],
    ['থ', '🍽️', 'থালা', 'plate'], ['দ', '🚪', 'দরজা', 'door'], ['ধ', '🌾', 'ধান', 'rice plant'], ['ন', '⛵', 'নৌকা', 'boat'],
    ['প', '🐦', 'পাখি', 'bird'], ['ফ', '🌸', 'ফুল', 'flower'], ['ব', '📖', 'বই', 'book'], ['ভ', '🐻', 'ভালুক', 'bear'],
    ['ম', '🐟', 'মাছ', 'fish'], ['য', '👯', 'যমজ', 'twins'], ['র', '🚀', 'রকেট', 'rocket'], ['ল', '🍋', 'লেবু', 'lemon'],
    ['শ', '🪷', 'শাপলা', 'water lily'], ['ষ', '🐂', 'ষাঁড়', 'bull'], ['স', '☀️', 'সূর্য', 'sun'], ['হ', '🐘', 'হাতি', 'elephant'],
    ['ড়', '⛰️', 'পাহাড়', 'hill'], ['ঢ়', '🌧️', 'আষাঢ়', 'rainy month'], ['য়', '🦚', 'ময়ূর', 'peacock'], ['ৎ', '🎉', 'উৎসব', 'festival'],
    ['ং', '🎨', 'রং', 'color'], ['ঃ', '😢', 'দুঃখ', 'sadness'], ['ঁ', '🌙', 'চাঁদ', 'moon'],
  ].map(([letter, emoji, word, en]) => ({
    letter, emoji, group: { bn: 'ব্যঞ্জনবর্ণ', en: 'Consonants' },
    name: { bn: word, en: word + ' · ' + en }, say: { bn: letter + '। ' + word, en: letter + '। ' + word },
  }));
  KS.registerGame({
    id: 'bnletters', type: 'explore', bands: ['pre', 'early'], skill: 'language', icon: 'অ', goal: 8,
    cardShows: 'letter', speakLang: 'bn',
    title: { bn: 'বাংলা বর্ণমালা', en: 'Bangla Alphabet' },
    desc: { bn: 'স্বরবর্ণ ও ব্যঞ্জনবর্ণ — ছুঁয়ে শোনো, ছবিতে চেনো', en: 'Vowels and consonants — tap, listen and see a picture' },
    tip: {
      bn: 'দিনে ২–৩টা বর্ণই যথেষ্ট। চাল বা বালুর উপর আঙুল দিয়ে বর্ণটা লিখতে দিন — হাতে লিখে শেখা মনে থাকে বেশি।',
      en: 'Two or three letters a day is plenty. Let your child trace the letter in rice or sand — writing by hand sticks better.',
    },
    items: BN_LETTERS.concat(BN_CONSONANTS),
  });

  /* 11. English ABC */
  const ABC = [
    ['A', '🍎', 'Apple', 'আপেল'], ['B', '⚽', 'Ball', 'বল'], ['C', '🐱', 'Cat', 'বিড়াল'], ['D', '🐶', 'Dog', 'কুকুর'],
    ['E', '🥚', 'Egg', 'ডিম'], ['F', '🐟', 'Fish', 'মাছ'], ['G', '🍇', 'Grapes', 'আঙুর'], ['H', '🎩', 'Hat', 'টুপি'],
    ['I', '🍦', 'Ice cream', 'আইসক্রিম'], ['J', '🧃', 'Juice', 'জুস'], ['K', '🪁', 'Kite', 'ঘুড়ি'], ['L', '🦁', 'Lion', 'সিংহ'],
    ['M', '🌙', 'Moon', 'চাঁদ'], ['N', '👃', 'Nose', 'নাক'], ['O', '🍊', 'Orange', 'কমলা'], ['P', '🦜', 'Parrot', 'টিয়া পাখি'],
    ['Q', '👸', 'Queen', 'রানি'], ['R', '🐇', 'Rabbit', 'খরগোশ'], ['S', '☀️', 'Sun', 'সূর্য'], ['T', '🐅', 'Tiger', 'বাঘ'],
    ['U', '☂️', 'Umbrella', 'ছাতা'], ['V', '🚐', 'Van', 'ভ্যান'], ['W', '⌚', 'Watch', 'ঘড়ি'], ['X', '🦊', 'Fox', 'শিয়াল'],
    ['Y', '🪀', 'Yo-yo', 'ইয়ো-ইয়ো'], ['Z', '🦓', 'Zebra', 'জেব্রা'],
  ].map(([letter, emoji, word, bn]) => ({
    letter, emoji,
    name: { bn: word + ' · ' + bn, en: word },
    say: { bn: letter + ' for ' + word, en: letter === 'X' ? 'X. Fox ends with X' : letter + '. ' + letter + ' for ' + word },
    sub: letter === 'X' ? { bn: 'Fox শব্দের শেষে X', en: 'X is at the end of fox' } : null,
  }));
  KS.registerGame({
    id: 'abc', type: 'explore', bands: ['pre', 'early'], skill: 'language', icon: '🔤', goal: 8,
    cardShows: 'letter', speakLang: 'en',
    title: { bn: 'ইংরেজি ABC', en: 'English ABC' },
    desc: { bn: 'A থেকে Z — ইংরেজি বর্ণ আর শব্দ শেখো', en: 'A to Z — learn English letters and words' },
    tip: {
      bn: 'ইংরেজি শব্দের পাশাপাশি বাংলা মানেটাও বলুন — Apple মানে আপেল। দুই ভাষা একসাথে শেখা শিশুর জন্য স্বাভাবিক।',
      en: 'Say the Bangla meaning along with the English word — Apple means আপেল. Learning two languages together is natural for children.',
    },
    items: ABC,
  });

  /* 12. Odd one out */
  const CATS = {
    fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍍', '🥭'],
    animals: ['🐶', '🐱', '🐮', '🐷', '🐸', '🐵', '🐔', '🐰'],
    vehicles: ['🚗', '🚌', '🚲', '✈️', '🚂', '⛵', '🚁', '🚜'],
    clothes: ['👕', '👖', '👗', '🧦', '🧢', '👟', '🧤'],
    plants: ['🌳', '🌸', '🌵', '🍀', '🌻', '🌴'],
  };
  KS.registerGame({
    id: 'oddone', type: 'quiz', bands: ['pre', 'early'], skill: 'logic', icon: '🔍', rounds: 5,
    title: { bn: 'কোনটা আলাদা?', en: 'Odd One Out' },
    desc: { bn: 'দলের সাথে মেলে না এমন ছবিটা খুঁজে বের করো', en: "Find the picture that doesn't belong" },
    tip: {
      bn: 'ঠিক হলে জিজ্ঞেস করুন "কেন এটা আলাদা?" — কারণ বলতে পারাটাই আসল চিন্তার দক্ষতা।',
      en: 'When they get it, ask "Why is it different?" — explaining the reason is the real thinking skill.',
    },
    makeRound(ctx) {
      const [a, b] = U.sample(Object.keys(CATS), 2);
      const odd = U.pick(CATS[b]);
      const group = U.sample(CATS[a], 3);
      return {
        q: ctx.L({ bn: 'কোনটা বাকিগুলোর মতো না?', en: 'Which one is different?' }),
        optClass: 'emoji-opts', cols: 4,
        options: U.shuffle(group.concat([odd])).map((e) => ({ key: e, text: e, correct: e === odd })),
      };
    },
  });

  /* 13. What comes next */
  const PAT_SETS = [['🔴', '🔵', '🟡'], ['⭐', '🌙', '☀️'], ['🍎', '🍌', '🍇'], ['🐶', '🐱', '🐰'], ['🟩', '🟧', '🟪'], ['🌸', '🍀', '🍁']];
  const PATTERNS = { AB: [0, 1, 0, 1, 0, 1], AAB: [0, 0, 1, 0, 0, 1], ABB: [0, 1, 1, 0, 1, 1], ABC: [0, 1, 2, 0, 1, 2] };
  KS.registerGame({
    id: 'pattern', type: 'quiz', bands: ['pre', 'early'], skill: 'logic', icon: '🔁', rounds: 5,
    title: { bn: 'এরপর কী আসবে?', en: 'What Comes Next?' },
    desc: { bn: 'নকশাটা দেখে পরের ছবিটা বেছে নাও', en: 'Look at the pattern and choose what comes next' },
    tip: {
      bn: 'হাততালি-পা ঠোকা-হাততালি-পা ঠোকা… শরীর দিয়ে প্যাটার্ন বানান। এটাই পরে গণিতের ভিত্তি হয়।',
      en: 'Clap-stomp-clap-stomp… make patterns with your body. This is the foundation of later math.',
    },
    makeRound(ctx, i) {
      const set = U.pick(PAT_SETS);
      const seq = PATTERNS[i < 2 ? 'AB' : U.pick(Object.keys(PATTERNS))];
      const shown = seq.slice(0, 5).map((k) => span(set[k])).join('');
      const answer = set[seq[5]];
      return {
        q: ctx.L({ bn: 'প্রশ্নবোধকের জায়গায় কী বসবে?', en: 'What goes in the question mark?' }),
        visual: '<div class="pattern-row">' + shown + '<span class="qmark">?</span></div>',
        optClass: 'emoji-opts',
        options: U.shuffle(set).map((e) => ({ key: e, text: e, correct: e === answer })),
      };
    },
  });

  /* 14. Shadow match */
  const SHADOW = ['🐘', '🦒', '🐇', '🐢', '🦋', '🐟', '🚗', '✈️', '🌳', '🍌', '🐓', '🦀', '🐌', '🍎', '🐪', '🦆', '🐄', '⛵'];
  KS.registerGame({
    id: 'shadow', type: 'quiz', bands: ['pre'], skill: 'logic', icon: '👤', rounds: 5,
    title: { bn: 'কার ছায়া?', en: 'Shadow Match' },
    desc: { bn: 'ছায়া দেখে আসল ছবিটা চিনে নাও', en: 'Look at the shadow and find the picture' },
    tip: {
      bn: 'রাতে টর্চ জ্বেলে দেয়ালে হাতের ছায়া দিয়ে পাখি বা কুকুর বানান — শিশু খুব মজা পাবে।',
      en: 'At night, use a torch to make hand-shadow birds and dogs on the wall — children love it.',
    },
    makeRound(ctx) {
      const opts = U.sample(SHADOW, 3);
      const target = U.pick(opts);
      return {
        q: ctx.L({ bn: 'এটা কার ছায়া?', en: 'Whose shadow is this?' }),
        visual: '<span class="shadow">' + target + '</span>',
        optClass: 'emoji-opts',
        options: opts.map((e) => ({ key: e, text: e, correct: e === target })),
      };
    },
  });

  /* 15. Feelings */
  const FEELINGS = [
    { e: '😀', q: { bn: 'কে খুশি?', en: 'Who feels happy?' }, name: { bn: 'খুশি', en: 'happy' } },
    { e: '😢', q: { bn: 'কে দুঃখ পেয়েছে?', en: 'Who feels sad?' }, name: { bn: 'দুঃখী', en: 'sad' } },
    { e: '😠', q: { bn: 'কে রাগ করেছে?', en: 'Who feels angry?' }, name: { bn: 'রাগী', en: 'angry' } },
    { e: '😨', q: { bn: 'কে ভয় পেয়েছে?', en: 'Who feels scared?' }, name: { bn: 'ভয় পেয়েছে', en: 'scared' } },
    { e: '😴', q: { bn: 'কার ঘুম পেয়েছে?', en: 'Who feels sleepy?' }, name: { bn: 'ঘুমঘুম', en: 'sleepy' } },
    { e: '😲', q: { bn: 'কে অবাক হয়েছে?', en: 'Who feels surprised?' }, name: { bn: 'অবাক', en: 'surprised' } },
  ];
  KS.registerGame({
    id: 'feelings', type: 'quiz', bands: ['pre', 'early'], skill: 'life', icon: '😊', rounds: 5,
    title: { bn: 'আমার অনুভূতি', en: 'My Feelings' },
    desc: { bn: 'মুখ দেখে মনের অনুভূতি চেনো', en: 'Read faces and name the feeling' },
    tip: {
      bn: 'শিশুকে জিজ্ঞেস করুন "তুমি কখন রাগ করো?" অনুভূতির নাম দিতে পারলে শিশু নিজেকে সামলাতে শেখে।',
      en: 'Ask "When do you feel angry?" Children who can name feelings learn to manage them.',
    },
    makeRound(ctx) {
      const opts = U.sample(FEELINGS, 3);
      const target = U.pick(opts);
      return {
        q: ctx.L(target.q),
        optClass: 'emoji-opts',
        options: opts.map((f) => ({
          key: f.e, text: f.e, aria: ctx.L(f.name), correct: f === target,
          hint: ctx.lang === 'bn' ? 'এই মুখটা ' + f.name.bn : 'This face looks ' + f.name.en,
        })),
      };
    },
  });
})(window.KS);
