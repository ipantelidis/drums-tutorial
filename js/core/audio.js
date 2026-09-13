// Synthesized drum kit, click and band sounds on top of the Web Audio API.

export const Audio = (() => {
  let ctx = null, master = null;
  function ensure() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function noise(len) {
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(); s.buffer = buf; return s;
  }
  function env(t, peak, decay, attack = 0.001) {
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(Math.max(peak, 0.0002), t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + decay); return g;
  }
  const V = {
    kk(t, v) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.09);
      const g = env(t, 1.1 * v, 0.38, 0.002); o.connect(g).connect(master); o.start(t); o.stop(t + 0.4);
      const c = noise(0.02), cg = env(t, 0.25 * v, 0.02), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500; c.connect(hp).connect(cg).connect(master); c.start(t);
    },
    sn(t, v) {
      const n = noise(0.3), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 0.6;
      n.connect(bp).connect(env(t, 0.75 * v, 0.16 + 0.08 * v)).connect(master); n.start(t);
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(170, t + 0.05);
      o.connect(env(t, 0.45 * v, 0.1)).connect(master); o.start(t); o.stop(t + 0.15);
    },
    hh(t, v) { const n = noise(0.08), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000; n.connect(hp).connect(env(t, 0.35 * v, 0.06)).connect(master); n.start(t); },
    ho(t, v) { const n = noise(0.5), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5000; n.connect(hp).connect(env(t, 0.3 * v, 0.42)).connect(master); n.start(t); },
    hf(t, v) { const n = noise(0.05), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3500; n.connect(bp).connect(env(t, 0.3 * v, 0.04)).connect(master); n.start(t); },
    tom(t, v, f, d) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.4, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.06);
      o.connect(env(t, 0.8 * v, d, 0.002)).connect(master); o.start(t); o.stop(t + d + 0.05);
      const n = noise(0.03); n.connect(env(t, 0.12 * v, 0.03)).connect(master); n.start(t);
    },
    t1(t, v) { V.tom(t, v, 210, 0.3); }, t2(t, v) { V.tom(t, v, 150, 0.36); }, fl(t, v) { V.tom(t, v, 95, 0.5); },
    rd(t, v) {
      const g = env(t, 0.22 * v, 0.9, 0.002); g.connect(master);
      [760, 1130, 1670, 2490].forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f * (1 + i * 0.003); const og = ctx.createGain(); og.gain.value = 0.25 / (i + 1); o.connect(og).connect(g); o.start(t); o.stop(t + 1); });
      const n = noise(0.05), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000; n.connect(hp).connect(env(t, 0.2 * v, 0.05)).connect(master); n.start(t);
    },
    cr(t, v) { const n = noise(1.6), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500; n.connect(hp).connect(env(t, 0.5 * v, 1.5, 0.003)).connect(master); n.start(t); },
    click(t, v, accent) { const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = accent ? 1600 : 1000; o.connect(env(t, (accent ? 0.5 : 0.3) * v, accent ? 0.05 : 0.03)).connect(master); o.start(t); o.stop(t + 0.06); },
    sub(t, v) { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 2400; o.connect(env(t, 0.14 * v, 0.02)).connect(master); o.start(t); o.stop(t + 0.03); }
  };
  function play(voice, t, v = 1, extra) { ensure(); if (V[voice]) V[voice](t, Math.min(v, 1.6), extra); }
  V.bass = (t, v, freq) => {
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = freq / 2;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(220, t + 0.25); f.Q.value = 2;
    const g = env(t, 0.45 * v, 0.42, 0.005); o.connect(f); o2.connect(f); f.connect(g).connect(master); o.start(t); o2.start(t); o.stop(t + 0.5); o2.stop(t + 0.5);
  };
  V.pad = (t, v, x) => { const freq = x.f, dur = x.dur;
    [1, 1.498, 2, 1.26].forEach((r, i) => { const o = ctx.createOscillator(); o.type = i === 3 ? 'triangle' : 'sine'; o.frequency.value = freq * r; o.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06 * v, t + 0.15); g.gain.setValueAtTime(0.06 * v, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05); });
  };
  return { ensure, play, now: () => ensure().currentTime, ctx: () => ensure() };
})();
