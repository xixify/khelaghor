/*
 * Logic tests for every game, run with:  node --test tests/
 * Loads the browser scripts in a sandbox (no DOM needed) and checks the data each game produces.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const FILES = [
  'js/core/core.js', 'js/core/util.js', 'js/core/store.js', 'js/core/i18n.js', 'js/core/sound.js',
  'js/games/tiny.js', 'js/games/pre.js', 'js/games/early.js', 'js/games/primary.js', 'js/games/activities.js',
];

function load() {
  const memory = new Map();
  const window = {
    localStorage: {
      getItem: (k) => (memory.has(k) ? memory.get(k) : null),
      setItem: (k, v) => memory.set(k, String(v)),
    },
  };
  const sandbox = { window, console, Math, Date, JSON, Set, Map, Array, Object, String, Number };
  vm.createContext(sandbox);
  FILES.forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f }));
  return window.KS;
}

const KS = load();
const ctxFor = (lang) => {
  KS.i18n.setLang(lang);
  return { lang, t: KS.i18n.t, L: KS.i18n.L, n: KS.i18n.n };
};

test('registers exactly 30 games with unique ids', () => {
  const games = KS.getGames();
  assert.equal(games.length, 30);
  assert.equal(new Set(games.map((g) => g.id)).size, 30);
});

test('every age band has at least 6 games', () => {
  KS.BAND_ORDER.forEach((band) => assert.ok(KS.gamesForBand(band).length >= 6, band));
});

test('every game has bilingual title, description and parent tip', () => {
  KS.getGames().forEach((g) => {
    ['title', 'desc', 'tip'].forEach((k) => {
      assert.ok(g[k].bn && g[k].en, g.id + '.' + k);
      assert.match(g[k].bn, /[ঀ-৿]/, g.id + '.' + k + ' bn should contain Bangla script');
    });
  });
});

test('explore games have names in both languages', () => {
  KS.getGames().filter((g) => g.type === 'explore').forEach((g) => {
    g.items.forEach((it) => assert.ok(it.name.bn && it.name.en, g.id + ': ' + JSON.stringify(it)));
    assert.ok(g.items.length >= (g.goal || 6), g.id + ' needs at least goal items');
  });
});

test('memory game has enough pictures for the biggest level', () => {
  const g = KS.getGame('memory');
  const biggest = Math.max(...g.levels.map((l) => l.pairs));
  assert.ok(g.pool.length >= biggest);
});

test('quiz rounds always have exactly one right answer and no duplicate options', () => {
  const quizzes = KS.getGames().filter((g) => g.type === 'quiz');
  ['bn', 'en'].forEach((lang) => {
    const ctx = ctxFor(lang);
    quizzes.forEach((g) => {
      for (let run = 0; run < 300; run++) {
        const r = g.makeRound(ctx, run % (g.rounds || 5));
        const label = g.id + ' [' + lang + '] ' + JSON.stringify(r.q);
        assert.ok(r.q && String(r.q).trim(), label + ' empty question');
        assert.ok(r.options.length >= 2, label + ' needs 2+ options');
        assert.equal(r.options.filter((o) => o.correct).length, 1, label + ' must have one correct option');
        const keys = r.options.map((o) => o.key);
        assert.equal(new Set(keys).size, keys.length, label + ' duplicate option keys ' + keys);
        const shown = r.options.map((o) => o.text || o.html);
        assert.equal(new Set(shown).size, shown.length, label + ' duplicate visible options');
        r.options.forEach((o) => assert.ok(o.text || o.html, label + ' option has no content'));
      }
    });
  });
});

test('math answers are actually correct', () => {
  const ctx = ctxFor('en');
  for (let i = 0; i < 200; i++) {
    const add = KS.getGame('add').makeRound(ctx, 3);
    const [a, b] = add.q.split(/[+=]/).map((s) => parseInt(s, 10));
    assert.equal(Number(add.options.find((o) => o.correct).text), a + b);

    const mul = KS.getGame('multiply').makeRound(ctx, 4);
    const [x, y] = mul.q.split(/[×=]/).map((s) => parseInt(s, 10));
    assert.equal(Number(mul.options.find((o) => o.correct).text), x * y);

    const sub = KS.getGame('subtract').makeRound(ctx, 4);
    const [p, q] = sub.q.split(/[−=]/).map((s) => parseInt(s, 10));
    assert.equal(Number(sub.options.find((o) => o.correct).text), p - q);
  }
});

test('fraction distractors never equal the right value', () => {
  const ctx = ctxFor('en');
  for (let i = 0; i < 300; i++) {
    const r = KS.getGame('fractions').makeRound(ctx, 4);
    const value = (k) => { const [a, b] = k.split('/').map(Number); return a / b; };
    const right = value(r.options.find((o) => o.correct).key);
    r.options.filter((o) => !o.correct).forEach((o) => assert.notEqual(value(o.key), right));
  }
});

test('Bangla digits and translations', () => {
  ctxFor('bn');
  assert.equal(KS.i18n.n(2026), '২০২৬');
  assert.equal(KS.i18n.L({ bn: 'আম', en: 'Mango' }), 'আম');
  assert.equal(KS.i18n.t('stickerCount', { n: '৩' }), 'এই খেলায় মোট ৩টি স্টিকার');
  ctxFor('en');
  assert.equal(KS.i18n.n(12), '12');
  assert.equal(KS.i18n.L({ bn: 'আম', en: 'Mango' }), 'Mango');
});

test('progress records effort counts per game', () => {
  KS.progress.reset();
  KS.progress.record('count', 'math');
  assert.equal(KS.progress.record('count', 'math'), 2);
  assert.equal(KS.progress.all().count.plays, 2);
});

test('util.numberChoices returns unique values containing the answer', () => {
  for (let i = 0; i < 500; i++) {
    const c = KS.util.numberChoices(1, 4, 0, 3);
    assert.ok(c.includes(1));
    assert.equal(new Set(c).size, c.length);
    c.forEach((v) => assert.ok(v >= 0 && v <= 3));
  }
});

test('spelling words: pieces join back into the word', () => {
  const { en, bn } = KS.data.SPELL_WORDS;
  en.concat(bn).forEach((w) => assert.equal(w.parts.join(''), w.word));
  assert.ok(en.length >= 4 && bn.length >= 4);
});
