/* localStorage wrapper. Storage can be blocked (private mode), so every call is guarded. */
(function (KS) {
  'use strict';
  const PREFIX = 'khelaghor:';

  function get(key, fallback) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  KS.store = Object.freeze({ get, set });

  /* Progress = stickers earned per game. It records effort, never speed or rank. */
  KS.progress = Object.freeze({
    all() {
      const data = get('progress', {});
      return data && typeof data === 'object' ? data : {};
    },
    record(gameId, skill) {
      const data = KS.progress.all();
      const prev = data[gameId] || { plays: 0 };
      const entry = { plays: (Number(prev.plays) || 0) + 1, skill, last: Date.now() };
      set('progress', Object.assign({}, data, { [gameId]: entry }));
      return entry.plays;
    },
    reset() {
      return set('progress', {});
    },
  });
})(window.KS);
