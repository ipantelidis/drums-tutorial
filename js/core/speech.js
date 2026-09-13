// Spoken counting and read aloud via the browser speech synthesis voice.

export const Speech = (() => {
  const on = () => document.getElementById('voice-on').checked && 'speechSynthesis' in window;
  let pending = 0;
  function say(text, opts = {}) {
    if (!on()) return;
    if (opts.short && speechSynthesis.pending) return; // never let counting fall behind
    const u = new SpeechSynthesisUtterance(text); u.rate = opts.rate || (opts.short ? 1.8 : 1.05); u.pitch = 1; u.lang = 'en-US';
    speechSynthesis.speak(u);
  }
  function stop() { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  return { say, stop, on };
})();
