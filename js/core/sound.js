/* Speech (Web Speech API) and gentle tones (Web Audio). Both fail silently when unsupported. */
(function (KS) {
  'use strict';
  let enabled = KS.store.get('sound', true) !== false;
  let audio = null;

  const synth = () => (typeof window !== 'undefined' && window.speechSynthesis) || null;

  function voices() {
    const s = synth();
    return s ? s.getVoices() : [];
  }

  function pickVoice(lang) {
    const list = voices();
    if (lang === 'bn') {
      return list.find((v) => /^bn[-_]BD/i.test(v.lang)) || list.find((v) => /^bn/i.test(v.lang)) || null;
    }
    return list.find((v) => /^en[-_](US|GB|IN)/i.test(v.lang)) || list.find((v) => /^en/i.test(v.lang)) || null;
  }

  function speak(text, langOverride) {
    const s = synth();
    if (!enabled || !s || !text) return;
    const lang = langOverride || KS.i18n.lang;
    const voice = pickVoice(lang);
    // A non-Bangla voice reading Bangla script sounds broken, so stay quiet instead.
    if (lang === 'bn' && !voice) return;
    try {
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
      if (voice) u.voice = voice;
      u.rate = 0.85;
      u.pitch = 1.1;
      s.cancel();
      s.speak(u);
    } catch (err) {
      console.warn('[Khelaghor] speech failed', err);
    }
  }

  function audioCtx() {
    try {
      if (!audio) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        audio = new C();
      }
      if (audio.state === 'suspended') audio.resume();
      return audio;
    } catch (err) {
      return null;
    }
  }

  function beep(freq, dur, type, when, vol) {
    const a = audioCtx();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    const t0 = a.currentTime + (when || 0);
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  const TONES = {
    good: () => [523, 659, 784].forEach((f, i) => beep(f, 0.18, 'triangle', i * 0.11)),
    soft: () => beep(300, 0.22, 'sine', 0, 0.06),
    pop: () => beep(600 + Math.random() * 500, 0.09, 'sine', 0, 0.1),
    tap: () => beep(880, 0.05, 'sine', 0, 0.05),
    note: (f) => beep(f || 440, 0.35, 'triangle', 0, 0.14),
    fanfare: () => [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.25, 'triangle', i * 0.14)),
  };

  KS.sound = {
    get enabled() {
      return enabled;
    },
    toggle() {
      enabled = !enabled;
      KS.store.set('sound', enabled);
      if (!enabled) KS.sound.stop();
      return enabled;
    },
    speak,
    tone(kind, freq) {
      if (enabled && TONES[kind]) TONES[kind](freq);
    },
    stop() {
      const s = synth();
      if (s) s.cancel();
    },
    hasBanglaVoice: () => Boolean(pickVoice('bn')),
  };

  // Voice lists load asynchronously in some browsers.
  const s = synth();
  if (s && typeof s.addEventListener === 'function') s.addEventListener('voiceschanged', voices);
})(window.KS);
