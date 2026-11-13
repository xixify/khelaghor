/* Small pure helpers used by games. None of these mutate their inputs. */
(function (KS) {
  'use strict';

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const sample = (arr, n) => shuffle(arr).slice(0, n);
  const repeat = (str, n) => Array.from({ length: n }, () => str).join('');

  /** Unique numeric choices in [min, max] that include `correct`, mostly near it. */
  function numberChoices(correct, count, min, max) {
    const set = new Set([correct]);
    const room = max - min + 1;
    const want = Math.min(count, room);
    let guard = 0;
    while (set.size < want && guard++ < 300) {
      const spread = guard < 60 ? 3 : 10;
      const v = correct + randInt(-spread, spread);
      if (v >= min && v <= max) set.add(v);
    }
    for (let v = min; set.size < want && v <= max; v++) set.add(v);
    return shuffle(Array.from(set));
  }

  /** Returns a function that hands out items without repeats until the pool is used up. */
  function deck(items) {
    let queue = [];
    return function next() {
      if (!queue.length) queue = shuffle(items);
      return queue.shift();
    };
  }

  KS.util = Object.freeze({ randInt, shuffle, pick, sample, repeat, numberChoices, deck });
})(window.KS);
