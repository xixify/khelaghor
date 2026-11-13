/* Games for ages 7–10 (Bright Minds): times tables, clocks, Taka, fractions, Bangladesh. */
(function (KS) {
  'use strict';
  const { util: U } = KS;

  /* 23. Multiplication garden */
  KS.registerGame({
    id: 'multiply', type: 'quiz', bands: ['primary'], skill: 'math', icon: '🌷', rounds: 6,
    title: { bn: 'গুণের বাগান', en: 'Times-Table Garden' },
    desc: { bn: 'ফুলের সারি দেখে গুণ বুঝে নাও', en: 'See multiplication as rows of flowers' },
    tip: {
      bn: 'নামতা মুখস্থের আগে "৩ সারিতে ৪টা করে" — এভাবে গুণ বোঝান। ডিমের ট্রে বা জানালার গ্রিল দারুণ উদাহরণ।',
      en: 'Before memorising tables, show "3 rows of 4". Egg trays and window grills are great examples.',
    },
    makeRound(ctx, i) {
      const a = U.randInt(2, i < 3 ? 4 : 6);
      const b = U.randInt(2, i < 3 ? 5 : 9);
      const product = a * b;
      const flower = U.pick(['🌷', '🌻', '🌼', '🍓', '🍎']);
      const rows = Array.from({ length: a }, () => '<div>' + U.repeat('<span>' + flower + '</span>', b) + '</div>').join('');
      const near = [product + a, product - a, product + b, product - b, product + 1, product - 1].filter((v) => v > 0 && v !== product);
      const choices = U.shuffle([product].concat(U.sample(Array.from(new Set(near)), 3)));
      return {
        q: ctx.n(a) + ' × ' + ctx.n(b) + ' = ?',
        say: ctx.lang === 'bn'
          ? ctx.n(a) + 'টা সারিতে ' + ctx.n(b) + 'টা করে ফুল। মোট কয়টা?'
          : a + ' rows of ' + b + ' flowers. How many in all?',
        visual: '<div class="array">' + rows + '</div>',
        optClass: 'num',
        options: choices.map((c) => ({ key: String(c), text: ctx.n(c), correct: c === product })),
      };
    },
  });

  /* 24. Tell the time */
  function clockSvg(ctx, hh, mm) {
    const nums = Array.from({ length: 12 }, (_, k) => {
      const v = k + 1;
      const ang = (v * 30 - 90) * (Math.PI / 180);
      const x = (100 + Math.cos(ang) * 72).toFixed(1);
      const y = (100 + Math.sin(ang) * 72 + 7).toFixed(1);
      return '<text x="' + x + '" y="' + y + '">' + ctx.n(v) + '</text>';
    }).join('');
    const ticks = Array.from({ length: 60 }, (_, k) =>
      '<line x1="100" y1="10" x2="100" y2="' + (k % 5 ? 15 : 20) + '" transform="rotate(' + k * 6 + ' 100 100)"/>').join('');
    const hourAng = (hh % 12) * 30 + mm * 0.5;
    return '<svg viewBox="0 0 200 200" class="clock" role="img">' +
      '<circle cx="100" cy="100" r="94" class="face"/><g class="ticks">' + ticks + '</g><g class="nums">' + nums + '</g>' +
      '<line x1="100" y1="100" x2="100" y2="52" class="hour" transform="rotate(' + hourAng + ' 100 100)"/>' +
      '<line x1="100" y1="100" x2="100" y2="26" class="minute" transform="rotate(' + mm * 6 + ' 100 100)"/>' +
      '<circle cx="100" cy="100" r="7" class="pin"/></svg>';
  }

  function timeWords(ctx, hh, mm) {
    const next = (hh % 12) + 1;
    if (ctx.lang === 'bn') {
      return { 0: ctx.n(hh) + 'টা', 15: 'সোয়া ' + ctx.n(hh) + 'টা', 30: 'সাড়ে ' + ctx.n(hh) + 'টা', 45: 'পৌনে ' + ctx.n(next) + 'টা' }[mm];
    }
    return { 0: hh + " o'clock", 15: 'quarter past ' + hh, 30: 'half past ' + hh, 45: 'quarter to ' + next }[mm];
  }

  KS.registerGame({
    id: 'clock', type: 'quiz', bands: ['primary'], skill: 'math', icon: '🕒', rounds: 6,
    title: { bn: 'ঘড়ি দেখি', en: 'Tell the Time' },
    desc: { bn: 'কাঁটাওয়ালা ঘড়ি দেখে সময় বলো', en: 'Read the time on a clock with hands' },
    tip: {
      bn: 'দিনের রুটিনকে সময়ের সাথে জুড়ুন: "সাড়ে ১টায় আমরা দুপুরের খাবার খাই।" বাসার ঘড়ি দেখে জিজ্ঞেস করুন।',
      en: 'Link routines to time: "We eat lunch at half past one." Ask your child to read the clock at home.',
    },
    makeRound(ctx, i) {
      const minuteSet = i < 2 ? [0] : i < 4 ? [0, 30] : [0, 15, 30, 45];
      const key = (hh, mm) => hh + ':' + mm;
      const hh = U.randInt(1, 12);
      const mm = U.pick(minuteSet);
      const seen = new Set([key(hh, mm)]);
      const options = [{ hh, mm }];
      let guard = 0;
      while (options.length < 3 && guard++ < 50) {
        const alt = Math.random() < 0.5 ? { hh: U.randInt(1, 12), mm } : { hh, mm: U.pick([0, 15, 30, 45]) };
        if (!seen.has(key(alt.hh, alt.mm))) {
          seen.add(key(alt.hh, alt.mm));
          options.push(alt);
        }
      }
      const digital = (o) => ctx.n(o.hh) + ':' + ctx.n(String(o.mm).padStart(2, '0'));
      return {
        q: ctx.L({ bn: 'এখন কয়টা বাজে?', en: 'What time is it?' }),
        visual: clockSvg(ctx, hh, mm),
        after: timeWords(ctx, hh, mm),
        optClass: 'labelled',
        cols: 3,
        options: U.shuffle(options).map((o) => ({
          key: key(o.hh, o.mm),
          html: '<span class="opt-big">' + digital(o) + '</span><span class="opt-label">' + timeWords(ctx, o.hh, o.mm) + '</span>',
          aria: timeWords(ctx, o.hh, o.mm),
          correct: o.hh === hh && o.mm === mm,
        })),
      };
    },
  });

  /* 25. Counting Taka */
  const MONEY = [
    { v: 1, type: 'coin' }, { v: 2, type: 'coin' }, { v: 5, type: 'coin' },
    { v: 10, type: 'note', color: '#F3A6B6' }, { v: 20, type: 'note', color: '#8CD99A' }, { v: 50, type: 'note', color: '#FFC078' },
  ];
  KS.registerGame({
    id: 'money', type: 'quiz', bands: ['primary'], skill: 'math', icon: '💰', rounds: 5,
    title: { bn: 'টাকা গুনি', en: 'Counting Taka' },
    desc: { bn: 'কয়েন আর নোট যোগ করে মোট টাকা বলো', en: 'Add up the coins and notes' },
    tip: {
      bn: 'দোকানে ছোট কেনাকাটায় শিশুকে টাকা গুনে দিতে দিন। "দোকানদার-ক্রেতা" খেলাও খুব কাজের।',
      en: 'Let your child count out money for small purchases. Playing "shopkeeper" at home works wonders too.',
    },
    makeRound(ctx, i) {
      const items = Array.from({ length: i < 2 ? 2 : 3 }, () => U.pick(i < 2 ? MONEY.slice(0, 4) : MONEY));
      const total = items.reduce((s, m) => s + m.v, 0);
      const deltas = U.sample([-10, -5, -2, -1, 1, 2, 5, 10].filter((d) => total + d > 0), 2);
      const choices = U.shuffle([total].concat(deltas.map((d) => total + d)));
      const visual = items.map((m) => m.type === 'coin'
        ? '<span class="coin">৳' + ctx.n(m.v) + '</span>'
        : '<span class="note" style="--c:' + m.color + '"><small>৳</small>' + ctx.n(m.v) + '</span>').join('<b class="op">+</b>');
      return {
        q: ctx.L({ bn: 'মোট কত টাকা?', en: 'How many Taka in all?' }),
        visual: '<div class="money">' + visual + '</div>',
        optClass: 'num',
        options: choices.map((c) => ({ key: String(c), text: '৳' + ctx.n(c), correct: c === total })),
      };
    },
  });

  /* 26. Know Bangladesh */
  const BD = [
    { q: { bn: 'বাংলাদেশের জাতীয় ফুল কোনটি?', en: 'What is the national flower of Bangladesh?' }, a: { bn: '🪷 শাপলা', en: '🪷 Water lily' }, w: [{ bn: '🌹 গোলাপ', en: '🌹 Rose' }, { bn: '🌻 সূর্যমুখী', en: '🌻 Sunflower' }] },
    { q: { bn: 'বাংলাদেশের জাতীয় ফল কোনটি?', en: 'What is the national fruit of Bangladesh?' }, a: { bn: 'কাঁঠাল', en: 'Jackfruit' }, w: [{ bn: '🥭 আম', en: '🥭 Mango' }, { bn: '🍌 কলা', en: '🍌 Banana' }] },
    { q: { bn: 'বাংলাদেশের জাতীয় পাখি কোনটি?', en: 'What is the national bird of Bangladesh?' }, a: { bn: 'দোয়েল', en: 'Magpie robin (Doel)' }, w: [{ bn: '🦚 ময়ূর', en: '🦚 Peacock' }, { bn: '🦜 টিয়া', en: '🦜 Parrot' }] },
    { q: { bn: 'বাংলাদেশের জাতীয় পশু কোনটি?', en: 'What is the national animal of Bangladesh?' }, a: { bn: '🐅 রয়েল বেঙ্গল টাইগার', en: '🐅 Royal Bengal Tiger' }, w: [{ bn: '🦁 সিংহ', en: '🦁 Lion' }, { bn: '🐘 হাতি', en: '🐘 Elephant' }] },
    { q: { bn: 'বাংলাদেশের জাতীয় মাছ কোনটি?', en: 'What is the national fish of Bangladesh?' }, a: { bn: '🐟 ইলিশ', en: '🐟 Hilsa (Ilish)' }, w: [{ bn: 'রুই', en: 'Rui' }, { bn: 'পাঙাশ', en: 'Pangas' }] },
    { q: { bn: 'বাংলাদেশের রাজধানীর নাম কী?', en: 'What is the capital of Bangladesh?' }, a: { bn: 'ঢাকা', en: 'Dhaka' }, w: [{ bn: 'চট্টগ্রাম', en: 'Chattogram' }, { bn: 'রাজশাহী', en: 'Rajshahi' }] },
    { q: { bn: 'আমাদের পতাকার রঙ কী কী?', en: 'What colors are on our flag?' }, a: { bn: '🟩🔴 সবুজ ও লাল', en: '🟩🔴 Green and red' }, w: [{ bn: '🟦⬜ নীল ও সাদা', en: '🟦⬜ Blue and white' }, { bn: '🟨🟥 হলুদ ও লাল', en: '🟨🟥 Yellow and red' }] },
    { q: { bn: 'আন্তর্জাতিক মাতৃভাষা দিবস কবে?', en: 'When is International Mother Language Day?' }, a: { bn: '২১শে ফেব্রুয়ারি', en: '21 February' }, w: [{ bn: '২৬শে মার্চ', en: '26 March' }, { bn: '১৪ই এপ্রিল', en: '14 April' }] },
    { q: { bn: 'বাংলাদেশের স্বাধীনতা দিবস কবে?', en: 'When is Independence Day in Bangladesh?' }, a: { bn: '২৬শে মার্চ', en: '26 March' }, w: [{ bn: '১৬ই ডিসেম্বর', en: '16 December' }, { bn: '২১শে ফেব্রুয়ারি', en: '21 February' }] },
    { q: { bn: 'বাংলাদেশের বিজয় দিবস কবে?', en: 'When is Victory Day in Bangladesh?' }, a: { bn: '১৬ই ডিসেম্বর', en: '16 December' }, w: [{ bn: '২৬শে মার্চ', en: '26 March' }, { bn: '১লা বৈশাখ', en: '1 Boishakh' }] },
    { q: { bn: 'পৃথিবীর সবচেয়ে বড় ম্যানগ্রোভ বন কোনটি?', en: 'Which is the largest mangrove forest in the world?' }, a: { bn: '🌳 সুন্দরবন', en: '🌳 The Sundarbans' }, w: [{ bn: 'লাউয়াছড়া', en: 'Lawachara' }, { bn: 'ভাওয়াল', en: 'Bhawal' }] },
    { q: { bn: 'পৃথিবীর দীর্ঘতম প্রাকৃতিক সমুদ্রসৈকত কোথায়?', en: 'Where is the longest natural sea beach in the world?' }, a: { bn: '🏖️ কক্সবাজার', en: "🏖️ Cox's Bazar" }, w: [{ bn: 'কুয়াকাটা', en: 'Kuakata' }, { bn: 'সেন্ট মার্টিন', en: "Saint Martin's" }] },
    { q: { bn: 'বাংলা নববর্ষ কোন দিন?', en: 'When is Bangla New Year?' }, a: { bn: '১লা বৈশাখ', en: '1 Boishakh (14 April)' }, w: [{ bn: '১লা জানুয়ারি', en: '1 January' }, { bn: '১লা ফাল্গুন', en: '1 Falgun' }] },
    { q: { bn: 'বাংলাদেশে কয়টি বিভাগ আছে?', en: 'How many divisions does Bangladesh have?' }, a: { bn: '৮টি', en: '8' }, w: [{ bn: '৬টি', en: '6' }, { bn: '১০টি', en: '10' }] },
    { q: { bn: 'আমাদের জাতীয় কবি কে?', en: 'Who is our national poet?' }, a: { bn: 'কাজী নজরুল ইসলাম', en: 'Kazi Nazrul Islam' }, w: [{ bn: 'জসীমউদ্‌দীন', en: 'Jasimuddin' }, { bn: 'সুকুমার রায়', en: 'Sukumar Ray' }] },
  ];
  KS.registerGame({
    id: 'bangladesh', type: 'quiz', bands: ['primary'], skill: 'world', icon: '🪷', rounds: 6,
    title: { bn: 'আমার বাংলাদেশ', en: 'Know Bangladesh' },
    desc: { bn: 'জাতীয় প্রতীক, দিবস আর প্রকৃতি — দেশকে জানো', en: 'National symbols, days and nature — know your country' },
    tip: {
      bn: 'প্রতিটি প্রশ্নের পর গল্প বলুন — একুশে ফেব্রুয়ারি কেন, সুন্দরবনে কী কী আছে। জানাটা গল্পে গভীর হয়।',
      en: 'After each question, tell the story — why 21 February matters, what lives in the Sundarbans. Stories make knowledge stick.',
    },
    makeRound: (function () {
      const nextQ = U.deck(BD);
      return function (ctx) {
        const item = nextQ();
        const opts = [{ label: item.a, correct: true }].concat(item.w.map((w) => ({ label: w, correct: false })));
        return {
          q: ctx.L(item.q),
          optClass: 'labelled stack',
          cols: 1,
          options: U.shuffle(opts).map((o) => ({ key: o.label.en, text: ctx.L(o.label), correct: o.correct })),
        };
      };
    })(),
  });

  /* 27. Fraction pizza */
  function pieSvg(parts, shaded) {
    if (parts === 1) return '<svg viewBox="0 0 200 200" class="pie"><circle cx="100" cy="100" r="90" class="on"/></svg>';
    const slices = Array.from({ length: parts }, (_, k) => {
      const a0 = (k / parts) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((k + 1) / parts) * 2 * Math.PI - Math.PI / 2;
      const p = (a) => (100 + 90 * Math.cos(a)).toFixed(2) + ',' + (100 + 90 * Math.sin(a)).toFixed(2);
      const large = a1 - a0 > Math.PI ? 1 : 0;
      return '<path d="M100,100 L' + p(a0) + ' A90,90 0 ' + large + ',1 ' + p(a1) + ' Z" class="' + (k < shaded ? 'on' : 'off') + '"/>';
    }).join('');
    return '<svg viewBox="0 0 200 200" class="pie">' + slices + '</svg>';
  }
  const fracHtml = (ctx, k, n) => '<span class="frac"><span>' + ctx.n(k) + '</span><span>' + ctx.n(n) + '</span></span>';

  KS.registerGame({
    id: 'fractions', type: 'quiz', bands: ['primary'], skill: 'math', icon: '🍕', rounds: 5,
    title: { bn: 'ভগ্নাংশের পিঠা', en: 'Fraction Pie' },
    desc: { bn: 'রঙ করা অংশ দেখে ভগ্নাংশ চেনো', en: 'Look at the colored part and name the fraction' },
    tip: {
      bn: 'রুটি বা কমলা ভাগ করার সময় বলুন — "৪ ভাগের ১ ভাগ তোমার।" হাতে-কলমে ভগ্নাংশ সহজ হয়।',
      en: 'When sharing a roti or an orange, say "1 out of 4 parts is yours." Fractions make sense with real food.',
    },
    makeRound(ctx, i) {
      const dens = i < 2 ? [2, 3, 4] : [2, 3, 4, 6, 8];
      const n = U.pick(dens);
      const k = U.randInt(1, n - 1);
      const value = k / n;
      const all = [];
      [2, 3, 4, 5, 6, 8].forEach((d) => {
        for (let x = 1; x < d; x++) if (Math.abs(x / d - value) > 1e-9) all.push([x, d]);
      });
      const sameDen = all.filter(([, d]) => d === n);
      const first = sameDen.length ? [U.pick(sameDen)] : [];
      const rest = U.sample(all.filter((f) => f !== first[0]), 2 - first.length);
      const options = U.shuffle([[k, n]].concat(first, rest));
      return {
        q: ctx.L({ bn: 'রঙ করা অংশটা কত ভাগ?', en: 'What fraction is colored?' }),
        visual: pieSvg(n, k),
        after: ctx.lang === 'bn' ? ctx.n(n) + ' ভাগের ' + ctx.n(k) + ' ভাগ!' : k + ' out of ' + n + ' parts!',
        optClass: 'num',
        options: options.map(([x, d]) => ({ key: x + '/' + d, html: fracHtml(ctx, x, d), aria: x + '/' + d, correct: x === k && d === n })),
      };
    },
  });
})(window.KS);
