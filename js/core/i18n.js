/* Bangla / English UI strings and helpers. Bangla is the default language. */
(function (KS) {
  'use strict';

  const DICT = {
    bn: {
      appName: 'খেলাঘর',
      tagline: 'খেলে খেলে শিখি',
      heroLine: 'প্রতিটি শিশু শেখে নিজের গতিতে। এখানে কোনো দৌড় নেই, কোনো র‍্যাংক নেই — শুধু আনন্দে শেখা।',
      chooseAge: 'কে খেলবে? বয়স বেছে নাও',
      home: 'হোম', parents: 'অভিভাবক কর্নার', stickers: 'স্টিকার খাতা',
      langSwitch: 'English', soundOn: 'শব্দ চালু', soundOff: 'শব্দ বন্ধ',
      back: 'ফিরে যাও', listen: 'আবার শোনো',
      playAgain: 'আবার খেলি', moreGames: 'অন্য খেলা',
      youDidIt: 'তুমি পেরেছ!', stickerEarned: 'চেষ্টা করার জন্য তুমি একটা স্টিকার পেলে!',
      stickerCount: 'এই খেলায় মোট {n}টি স্টিকার',
      allSkills: 'সব', gamesCount: '{n}টি খেলা',
      tapToExplore: 'যেকোনো ছবিতে ছোঁও', imDone: 'আমার শেখা হলো ⭐',
      forParents: 'অভিভাবকের জন্য টিপস',
      watch: 'ভালো করে দেখো…', yourTurn: 'এবার তোমার পালা!', watchAgain: 'চলো আবার দেখি',
      letsPlay: 'চলো খেলি', otherAges: 'অন্য বয়সের খেলা',
      notTried: 'এখনো খেলা হয়নি', timesPlayed: '{n} বার খেলা হয়েছে',
      reset: 'স্টিকার খাতা মুছে ফেলুন', resetConfirm: 'সব স্টিকার মুছে যাবে। নিশ্চিত?',
      pickLevel: 'কতগুলো কার্ড নিয়ে খেলবে?',
      noBnVoice: 'এই ডিভাইসে বাংলা কণ্ঠ পাওয়া যায়নি, তাই বাংলা লেখা পড়ে শোনানো যাবে না। পাশে বসে আপনি পড়ে শোনান — শিশুর জন্য সেটাই সবচেয়ে ভালো!',
      footer: 'খেলাঘর — বাংলাদেশের পরিবারের জন্য ভালোবাসা দিয়ে বানানো। সব খেলা বিনামূল্যে, কোনো বিজ্ঞাপন নেই, কোনো তথ্য সংগ্রহ নেই।',
      featureNoRace: 'দৌড় নয়, দক্ষতা', featureNoRaceText: 'কোনো টাইমার, স্কোরবোর্ড বা র‍্যাংক নেই। ভুল হলে শিশু আবার চেষ্টা করে — বকা নয়, উৎসাহ।',
      featureBilingual: 'বাংলা ও ইংরেজি', featureBilingualText: 'মাতৃভাষায় শেখার ভিত্তি, সাথে ইংরেজির হাতেখড়ি। এক ক্লিকে ভাষা বদলান।',
      featureTogether: 'একসাথে খেলুন', featureTogetherText: 'প্রতিটি খেলার সাথে অভিভাবকের জন্য টিপস — স্ক্রিনের বাইরে কীভাবে শেখাবেন।',
      skillAreas: 'যেসব দক্ষতা গড়ে ওঠে', parentCta: 'হোমস্কুলিং শুরু করবেন কীভাবে?', parentCtaBtn: 'অভিভাবক কর্নারে যান',
    },
    en: {
      appName: 'Khelaghor',
      tagline: 'Learn by playing',
      heroLine: 'Every child learns at their own pace. No race, no ranking — just joyful learning.',
      chooseAge: "Who's playing? Pick an age",
      home: 'Home', parents: 'Parent Corner', stickers: 'Sticker Book',
      langSwitch: 'বাংলা', soundOn: 'Sound on', soundOff: 'Sound off',
      back: 'Go back', listen: 'Listen again',
      playAgain: 'Play again', moreGames: 'Other games',
      youDidIt: 'You did it!', stickerEarned: 'You earned a sticker for trying!',
      stickerCount: '{n} stickers in this game',
      allSkills: 'All', gamesCount: '{n} games',
      tapToExplore: 'Tap any picture', imDone: "I'm done ⭐",
      forParents: 'Tips for parents',
      watch: 'Watch carefully…', yourTurn: 'Your turn!', watchAgain: "Let's watch again",
      letsPlay: "Let's play", otherAges: 'Games for other ages',
      notTried: 'Not played yet', timesPlayed: 'Played {n} times',
      reset: 'Clear sticker book', resetConfirm: 'All stickers will be removed. Are you sure?',
      pickLevel: 'How many cards?',
      noBnVoice: 'No Bangla voice was found on this device, so Bangla text cannot be read aloud. Sit beside your child and read it to them — that is the best way anyway!',
      footer: 'Khelaghor — made with love for families in Bangladesh. Every game is free, with no ads and no data collection.',
      featureNoRace: 'Skills, not a race', featureNoRaceText: 'No timers, scoreboards or rankings. A mistake just means "try again" — encouragement, never scolding.',
      featureBilingual: 'Bangla & English', featureBilingualText: 'A strong start in the mother tongue, plus first steps in English. Switch with one tap.',
      featureTogether: 'Play together', featureTogetherText: 'Every game has tips for parents on how to keep learning away from the screen.',
      skillAreas: 'Skills your child builds', parentCta: 'How do I start homeschooling?', parentCtaBtn: 'Visit the Parent Corner',
    },
  };

  const PRAISE = {
    bn: ['দারুণ!', 'খুব ভালো!', 'সাবাশ!', 'চমৎকার!', 'বাহ্‌, ঠিক হয়েছে!'],
    en: ['Great job!', 'Wonderful!', 'Well done!', 'You got it!', 'Yes, that is right!'],
  };
  const ENCOURAGE = {
    bn: ['আবার চেষ্টা করো, তুমি পারবে!', 'প্রায় হয়ে গেছে, আরেকবার দেখো!', 'কোনো সমস্যা নেই, আবার চেষ্টা করি!'],
    en: ["Let's try again, you can do it!", 'Almost! Have another look.', "That's okay, let's try again!"],
  };

  const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
  let lang = KS.store.get('lang', 'bn') === 'en' ? 'en' : 'bn';

  const i18n = {
    get lang() {
      return lang;
    },
    setLang(next) {
      lang = next === 'en' ? 'en' : 'bn';
      KS.store.set('lang', lang);
      if (typeof document !== 'undefined') document.documentElement.lang = lang;
    },
    t(key, vars) {
      const raw = (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
      if (!vars) return raw;
      return Object.keys(vars).reduce((s, k) => s.split('{' + k + '}').join(vars[k]), raw);
    },
    /** Pick the current-language text from a {bn, en} object (strings pass through). */
    L(obj) {
      if (obj == null) return '';
      if (typeof obj === 'string') return obj;
      return obj[lang] != null ? obj[lang] : obj.en;
    },
    /** Format a number with Bangla digits in Bangla mode. */
    n(num) {
      const s = String(num);
      return lang === 'bn' ? s.replace(/\d/g, (d) => BN_DIGITS[d]) : s;
    },
    praise() {
      return KS.util.pick(PRAISE[lang]);
    },
    encourage() {
      return KS.util.pick(ENCOURAGE[lang]);
    },
  };

  KS.i18n = i18n;
})(window.KS);
