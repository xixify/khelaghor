/* Parent Corner: the homeschooling philosophy, age guides, routine and screen-time guidance. */
(function (KS) {
  'use strict';
  const { h } = KS;

  const PRINCIPLES = [
    { e: '🐢', t: { bn: 'নিজের গতিতে', en: 'At their own pace' }, p: { bn: 'অন্য শিশুর সাথে তুলনা করবেন না। গতকালের চেয়ে আজ একটু এগোলেই সেটা সাফল্য।', en: 'Do not compare with other children. A little further than yesterday is success.' } },
    { e: '🤲', t: { bn: 'খেলাই শেখা', en: 'Play is learning' }, p: { bn: 'ছোট শিশুরা মুখস্থ করে নয়, ছুঁয়ে, দেখে, খেলে শেখে। পড়ার টেবিলের চেয়ে মেঝেতে বসে শেখা বেশি কার্যকর।', en: 'Young children learn by touching, seeing and playing — not by memorising. The floor beats the study desk.' } },
    { e: '💬', t: { bn: 'কথা বলুন অনেক', en: 'Talk a lot' }, p: { bn: 'রান্না, বাজার, গোসল — সব কাজে শিশুর সাথে কথা বলুন। শব্দভাণ্ডারই পড়া ও লেখার ভিত্তি।', en: 'Talk during cooking, shopping, bath time. Vocabulary is the foundation of reading and writing.' } },
    { e: '🌳', t: { bn: 'স্ক্রিনের বাইরেও', en: 'Beyond the screen' }, p: { bn: 'এই খেলাগুলো শুরুর ধাপ। আসল শেখা হয় বাস্তবে — উঠোনে, রান্নাঘরে, বই হাতে।', en: 'These games are a starting point. Real learning happens in the yard, the kitchen, and with books in hand.' } },
  ];

  const AGE_GUIDE = {
    tiny: {
      focus: { bn: 'কথা শোনা ও বলা, রঙ-আকার চেনা, হাতের নড়াচড়া, নিরাপদ ভালোবাসার সম্পর্ক।', en: 'Listening and talking, colors and shapes, hand movement, a safe loving bond.' },
      offline: { bn: 'ছড়া ও গান ("আয় আয় চাঁদ মামা"), ছবির বই দেখা, পানি-বালু নিয়ে খেলা, হাঁড়ি-চামচ দিয়ে বাজনা।', en: 'Rhymes and songs, picture books, water and sand play, making music with pots and spoons.' },
      screen: { bn: '২ বছরের কম বয়সে স্ক্রিন এড়িয়ে চলাই ভালো। ২–৩ বছরে দিনে অল্প কয়েক মিনিট, সবসময় আপনার কোলে বসে, একসাথে।', en: 'Under 2, it is best to avoid screens. From 2–3, just a few minutes a day, always together on your lap.' },
    },
    pre: {
      focus: { bn: 'বর্ণ ও সংখ্যা চেনা, গোনা, মিল-অমিল খোঁজা, অনুভূতি বোঝা, নিজে নিজে কাজ করা।', en: 'Recognising letters and numbers, counting, matching, understanding feelings, doing things independently.' },
      offline: { bn: 'চাল/বালুতে বর্ণ লেখা, ডাল গোনা, ব্লক দিয়ে ঘর বানানো, গল্প বলা, ঘরের ছোট কাজে সাহায্য।', en: 'Tracing letters in rice or sand, counting lentils, building with blocks, storytelling, helping with small chores.' },
      screen: { bn: 'দিনে সর্বোচ্চ ১ ঘণ্টা, কম হলে আরও ভালো। ১০–১৫ মিনিটের ছোট সেশন যথেষ্ট।', en: 'No more than 1 hour a day — less is better. Short 10–15 minute sessions are enough.' },
    },
    early: {
      focus: { bn: 'পড়া শুরু, ১০ পর্যন্ত যোগ-বিয়োগ, শ্রেণিবিভাগ, ভালো অভ্যাস, মনোযোগ ধরে রাখা।', en: 'Beginning to read, adding and subtracting to 10, sorting, good habits, holding attention.' },
      offline: { bn: 'প্রতিদিন একসাথে গল্পের বই পড়া, হাতের লেখা অনুশীলন, বাগান করা, দোকান-দোকান খেলা।', en: 'Read a storybook together daily, handwriting practice, gardening, playing shop.' },
      screen: { bn: 'পড়াশোনার স্ক্রিন টাইম ২০–৩০ মিনিট রাখুন, তারপর একই বিষয় খাতা-কলমে বা বাস্তবে করুন।', en: 'Keep learning screen time to 20–30 minutes, then do the same topic on paper or in real life.' },
    },
    primary: {
      focus: { bn: 'নামতা ও গুণ, ভগ্নাংশ, সময় ও টাকা, দেশ ও প্রকৃতি জানা, নিজে প্রশ্ন করতে শেখা।', en: 'Times tables, fractions, time and money, knowing the country and nature, learning to ask questions.' },
      offline: { bn: 'দিনলিপি লেখা, রান্নায় মাপজোখ, বাজারের হিসাব, ম্যাপ দেখা, ছোট বিজ্ঞান পরীক্ষা (পানিতে কী ডোবে-ভাসে)।', en: 'Keeping a diary, measuring in cooking, shopping sums, reading maps, small science experiments (what floats or sinks).' },
      screen: { bn: 'স্ক্রিনকে "পুরস্কার" বানাবেন না। একটা নির্দিষ্ট সময় ঠিক করুন এবং পরিবারের সবাই সেটা মেনে চলুন।', en: 'Do not make screens a "reward". Set a fixed time and have the whole family follow it.' },
    },
  };

  const ROUTINE = [
    ['🌅', { bn: 'সকাল', en: 'Morning' }, { bn: 'নাস্তা, ঘরের ছোট কাজ, ১৫ মিনিট গল্প বা ছড়া', en: 'Breakfast, a small chore, 15 minutes of stories or rhymes' }],
    ['📚', { bn: 'শেখার সময়', en: 'Learning time' }, { bn: 'একটা ভাষা আর একটা গণিতের কাজ (খাতা-কলম বা বাস্তব জিনিস দিয়ে)', en: 'One language and one math activity (paper or real objects)' }],
    ['🎮', { bn: 'খেলাঘর', en: 'Khelaghor' }, { bn: '১০–২০ মিনিট একসাথে খেলাঘরের ১–২টা খেলা', en: '10–20 minutes playing 1–2 Khelaghor games together' }],
    ['🌳', { bn: 'বাইরে খেলা', en: 'Outdoor play' }, { bn: 'দৌড়ঝাঁপ, গাছ-পাখি দেখা, বল খেলা', en: 'Running, watching trees and birds, ball games' }],
    ['🎨', { bn: 'বিকেল', en: 'Afternoon' }, { bn: 'আঁকা, বানানো, গান বা নাচ', en: 'Drawing, making things, songs or dance' }],
    ['🌙', { bn: 'রাত', en: 'Night' }, { bn: 'ঘুমের আগে বই পড়া আর "আজ কী শিখলে?" গল্প', en: 'A bedtime book and a "what did you learn today?" chat' }],
  ];

  function section(title, ...kids) {
    return h('section', { class: 'p-section' }, h('h2', {}, title), ...kids);
  }

  KS.pages.parents = function parents(root) {
    const { L } = KS.i18n;
    root.append(
      h('section', { class: 'band-head parents-head' },
        h('span', { class: 'band-emoji' }, '👨‍👩‍👧‍👦'),
        h('div', {},
          h('h1', {}, L({ bn: 'অভিভাবক কর্নার', en: 'Parent Corner' })),
          h('p', {}, L({ bn: 'বাড়িতে আনন্দের সাথে শেখানোর সহজ গাইড', en: 'A simple guide to joyful learning at home' })))),
      section(L({ bn: 'আমাদের ভাবনা', en: 'Our approach' }),
        h('div', { class: 'feature-grid' }, PRINCIPLES.map((x) =>
          h('div', { class: 'feature' }, h('span', { class: 'feature-emoji' }, x.e), h('h3', {}, L(x.t)), h('p', {}, L(x.p)))))),
      section(L({ bn: 'বয়স অনুযায়ী গাইড', en: 'Guide by age' }),
        h('div', { class: 'age-guide' }, KS.BAND_ORDER.map((k) => {
          const g = AGE_GUIDE[k];
          const b = KS.BANDS[k];
          return h('article', { class: 'guide-card band-' + k },
            h('h3', {}, b.emoji + ' ' + L(b.ages) + ' · ' + L(b.name)),
            h('p', {}, h('b', {}, L({ bn: 'মূল দক্ষতা: ', en: 'Focus: ' })), L(g.focus)),
            h('p', {}, h('b', {}, L({ bn: 'স্ক্রিন ছাড়া: ', en: 'Off-screen ideas: ' })), L(g.offline)),
            h('p', {}, h('b', {}, L({ bn: 'স্ক্রিন টাইম: ', en: 'Screen time: ' })), L(g.screen)),
            h('a', { class: 'btn small', href: '#/age/' + k }, L({ bn: 'এই বয়সের খেলা', en: 'Games for this age' }) + ' →'));
        }))),
      section(L({ bn: 'একটা সহজ দৈনিক রুটিন', en: 'A simple daily rhythm' }),
        h('p', { class: 'muted' }, L({ bn: 'এটা কঠোর নিয়ম নয় — আপনার পরিবারের সুবিধামতো বদলে নিন।', en: 'This is not a strict rule — adapt it to your family.' })),
        h('ol', { class: 'routine' }, ROUTINE.map(([e, t, d]) =>
          h('li', {}, h('span', { class: 'r-emoji' }, e), h('div', {}, h('b', {}, L(t)), h('p', {}, L(d))))))),
      section(L({ bn: 'খেলাঘর কীভাবে ব্যবহার করবেন', en: 'How to use Khelaghor' }),
        h('ul', { class: 'howto' },
          h('li', {}, L({ bn: 'শিশুর বয়সের ঘর বেছে নিন, তবে চাইলে ছোট বা বড় ঘরের খেলাও খেলতে পারে।', en: "Pick your child's age group — but they are free to try games from younger or older groups." })),
          h('li', {}, L({ bn: 'প্রতিটি খেলার নিচে "অভিভাবকের জন্য টিপস" খুলে পড়ুন — স্ক্রিনের বাইরে কী করবেন সেখানে আছে।', en: 'Open "Tips for parents" under every game — it explains what to do away from the screen.' })),
          h('li', {}, L({ bn: 'ভুল উত্তরে কোনো শাস্তি নেই। শিশুকে নিজে চেষ্টা করতে দিন, সাথে সাথে উত্তর বলে দেবেন না।', en: 'There is no penalty for wrong answers. Let your child try on their own — do not give the answer straight away.' })),
          h('li', {}, L({ bn: 'স্টিকার দেওয়া হয় চেষ্টার জন্য, জেতার জন্য নয়। স্টিকার খাতায় দেখুন শিশু কোন দক্ষতায় বেশি খেলছে, কোনটায় কম।', en: 'Stickers are for effort, not winning. Use the Sticker Book to see which skills your child explores most and least.' })),
          h('li', {}, L({ bn: 'সব তথ্য শুধু আপনার ডিভাইসেই থাকে। কোনো অ্যাকাউন্ট বা ইন্টারনেট সার্ভারে কিছু পাঠানো হয় না।', en: 'Everything stays on your device. No account, nothing is sent to a server.' }))))
    );
  };

  KS.pages.stickers = function stickers(root) {
    const { L, t, n } = KS.i18n;
    const progress = KS.progress.all();
    const games = KS.getGames();
    const bySkill = Object.keys(KS.SKILLS).map((s) => ({
      s,
      plays: games.filter((g) => g.skill === s).reduce((sum, g) => sum + ((progress[g.id] || {}).plays || 0), 0),
    }));
    const max = Math.max(1, ...bySkill.map((x) => x.plays));
    const total = bySkill.reduce((sum, x) => sum + x.plays, 0);

    const reset = h('button', { class: 'btn small alt', type: 'button' }, '🧹 ' + t('reset'));
    reset.addEventListener('click', () => {
      if (window.confirm(t('resetConfirm'))) {
        KS.progress.reset();
        root.replaceChildren();
        KS.pages.stickers(root);
      }
    });

    root.append(
      h('section', { class: 'band-head stickers-head' },
        h('span', { class: 'band-emoji' }, '📒'),
        h('div', {},
          h('h1', {}, t('stickers')),
          h('p', {}, L({ bn: 'প্রতিটি স্টিকার চেষ্টার জন্য — জেতার জন্য নয়।', en: 'Every sticker is for trying — not for winning.' })),
          h('p', { class: 'big-count' }, '⭐ ' + n(total)))),
      h('section', { class: 'p-section' },
        h('h2', {}, L({ bn: 'কোন দক্ষতায় কতটা খেলা হলো', en: 'Skills explored' })),
        h('p', { class: 'muted' }, L({ bn: 'ছোট বারগুলো দেখে ঠিক করুন আগামী সপ্তাহে কোন ধরনের খেলা একটু বেশি খেলবেন। ভারসাম্যই লক্ষ্য।', en: 'Look at the short bars to choose what to explore next week. Balance is the goal.' })),
        h('div', { class: 'skill-bars' }, bySkill.map((x) =>
          h('div', { class: 'skill-bar' },
            h('span', { class: 'sb-label' }, KS.SKILLS[x.s].emoji + ' ' + L(KS.SKILLS[x.s].name)),
            h('span', { class: 'sb-track' }, h('span', { class: 'sb-fill', style: { width: (x.plays / max) * 100 + '%' } })),
            h('span', { class: 'sb-num' }, n(x.plays)))))),
      h('section', { class: 'p-section' },
        h('h2', {}, L({ bn: 'আমার স্টিকার', en: 'My stickers' })),
        h('div', { class: 'sticker-grid' }, games.map((g) => {
          const plays = (progress[g.id] || {}).plays || 0;
          return h('a', { class: 'sticker' + (plays ? ' got' : ''), href: '#/play/' + g.id, title: plays ? t('timesPlayed', { n: n(plays) }) : t('notTried') },
            h('span', { class: 'st-icon' }, g.icon),
            h('span', { class: 'st-name' }, L(g.title)),
            h('span', { class: 'st-count' }, plays ? '⭐ ' + n(plays) : t('notTried')));
        })),
        h('div', { class: 'center' }, reset))
    );
  };
})(window.KS);
