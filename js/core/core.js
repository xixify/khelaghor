/* Khelaghor core: namespace, age bands, skill areas and the game registry. */
(function () {
  'use strict';
  const KS = (window.KS = window.KS || {});
  KS.engines = KS.engines || {};
  KS.pages = KS.pages || {};
  KS.data = KS.data || {};

  KS.BAND_ORDER = Object.freeze(['tiny', 'pre', 'early', 'primary']);

  KS.BANDS = Object.freeze({
    tiny: {
      emoji: '🐣', color: 'var(--tiny)', ink: '#B5541B',
      name: { bn: 'ছোট্ট সোনা', en: 'Little Sprouts' },
      ages: { bn: '১–৩ বছর', en: 'Ages 1–3' },
      blurb: { bn: 'রঙ, শব্দ, ছোঁয়া আর আনন্দ', en: 'Colors, sounds, touch and joy' },
    },
    pre: {
      emoji: '🐻', color: 'var(--pre)', ink: '#2B8A3E',
      name: { bn: 'কচিকাঁচা', en: 'Curious Cubs' },
      ages: { bn: '৩–৫ বছর', en: 'Ages 3–5' },
      blurb: { bn: 'বর্ণ, গোনা আর মিল খোঁজা', en: 'Letters, counting and matching' },
    },
    early: {
      emoji: '🚀', color: 'var(--early)', ink: '#1864AB',
      name: { bn: 'ছোট্ট অভিযাত্রী', en: 'Young Explorers' },
      ages: { bn: '৫–৭ বছর', en: 'Ages 5–7' },
      blurb: { bn: 'যোগ-বিয়োগ, শব্দ আর ভালো অভ্যাস', en: 'Adding, words and good habits' },
    },
    primary: {
      emoji: '🦉', color: 'var(--primary)', ink: '#5F3DC4',
      name: { bn: 'ক্ষুদে জ্ঞানী', en: 'Bright Minds' },
      ages: { bn: '৭–১০ বছর', en: 'Ages 7–10' },
      blurb: { bn: 'গুণ, ভগ্নাংশ, সময় আর দেশ', en: 'Times tables, fractions, time and country' },
    },
  });

  KS.SKILLS = Object.freeze({
    motor: { emoji: '✋', name: { bn: 'হাত ও চোখের দক্ষতা', en: 'Hand & eye skills' } },
    language: { emoji: '🔤', name: { bn: 'ভাষা ও বর্ণ', en: 'Language & letters' } },
    math: { emoji: '🔢', name: { bn: 'সংখ্যা ও গণিত', en: 'Numbers & math' } },
    logic: { emoji: '🧩', name: { bn: 'চিন্তা ও যুক্তি', en: 'Thinking & logic' } },
    memory: { emoji: '🧠', name: { bn: 'মনোযোগ ও স্মৃতি', en: 'Focus & memory' } },
    world: { emoji: '🌍', name: { bn: 'চারপাশের জগৎ', en: 'World around us' } },
    life: { emoji: '💛', name: { bn: 'অনুভূতি ও ভালো অভ্যাস', en: 'Feelings & good habits' } },
    creative: { emoji: '🎨', name: { bn: 'সৃজনশীলতা', en: 'Creativity' } },
  });

  const TYPES = ['quiz', 'explore', 'memory', 'custom'];
  const games = [];

  function validate(def) {
    const problems = [];
    if (!def.id) problems.push('missing id');
    if (!TYPES.includes(def.type)) problems.push('bad type');
    if (!Array.isArray(def.bands) || !def.bands.every((b) => KS.BAND_ORDER.includes(b))) problems.push('bad bands');
    if (!KS.SKILLS[def.skill]) problems.push('bad skill');
    ['title', 'desc', 'tip'].forEach((k) => {
      if (!def[k] || !def[k].bn || !def[k].en) problems.push('missing ' + k);
    });
    if (def.type === 'quiz' && typeof def.makeRound !== 'function') problems.push('quiz needs makeRound');
    if (def.type === 'explore' && !Array.isArray(def.items)) problems.push('explore needs items');
    if (def.type === 'custom' && typeof def.start !== 'function') problems.push('custom needs start');
    if (games.some((g) => g.id === def.id)) problems.push('duplicate id');
    return problems;
  }

  KS.registerGame = function (def) {
    const problems = validate(def);
    if (problems.length) {
      console.error('[Khelaghor] game "' + def.id + '" not registered:', problems.join(', '));
      return false;
    }
    games.push(Object.freeze(Object.assign({}, def)));
    return true;
  };

  KS.getGames = () => games.slice();
  KS.getGame = (id) => games.find((g) => g.id === id) || null;
  /** Games for a band: ones made mainly for this age first, shared games after. */
  KS.gamesForBand = (band) => {
    const list = games.filter((g) => g.bands.includes(band));
    return list.filter((g) => g.bands[0] === band).concat(list.filter((g) => g.bands[0] !== band));
  };
})();
