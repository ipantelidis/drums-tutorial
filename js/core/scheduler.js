// Lookahead scheduler: audio events are queued slightly ahead of time, UI callbacks fire on the animation frame.
import { Audio } from './audio.js';

export function makeScheduler(onEvent) {
  let timer = null, nextTime = 0, running = false; const LOOK = 0.12, TICK = 25; const uiQueue = [];
  function start(genNext) {
    Audio.ensure(); running = true; nextTime = Audio.now() + 0.08; uiQueue.length = 0;
    function loop() {
      while (running && nextTime < Audio.now() + LOOK) {
        const step = genNext(nextTime);
        if (!step) { stop('end'); return; }
        uiQueue.push({ time: nextTime, ui: step.ui }); nextTime += step.dur;
      }
    }
    loop(); timer = setInterval(loop, TICK); requestAnimationFrame(frame);
  }
  function frame() {
    if (!running) return; const now = Audio.now();
    while (uiQueue.length && uiQueue[0].time <= now + 0.005) { const e = uiQueue.shift(); onEvent({ type: 'ui', ...e.ui, time: e.time }); }
    requestAnimationFrame(frame);
  }
  function stop(kind = 'stop') { if (!running) return; running = false; clearInterval(timer); timer = null; onEvent({ type: kind }); }
  return { start, stop, isRunning: () => running };
}
