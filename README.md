# Rock Drum Course

An interactive drum course that runs as a static web page: a four level curriculum with pass tests, theory, reading (notation and tabs), technique, a rhythm library, a 3D kit, a metronome, a groove player with MIDI scoring, a song lab and practice tools.

No account, no server, no build step. Progress lives in the visitor's own browser.

Live version: https://ipantelidis.github.io/drums-tutorial/

## Running it locally

The page is split into ES modules, so it has to be served over HTTP rather than opened as a `file://` URL. Any static server works:

```
npx serve .            # or: python -m http.server 8080
```

then open http://localhost:8080 (or the port the server prints). `npm start` does the same thing.

## Layout

```
index.html              markup for every view, loads css/style.css and js/main.js
css/style.css           all styles
js/main.js              entry point: wires views to renderers and initialises features
js/core/                things everything else builds on
  audio.js              synthesized kit, click and band sounds (Web Audio)
  scheduler.js          lookahead scheduler for tight timing
  speech.js             spoken counting and read aloud
  state.js              progress store (localStorage), XP, ranks, badges, toast
  nav.js                view switching, with onView() hooks for features
js/data/                content as data, no logic
  grooves.js            the pattern library (every groove, rudiment and fill)
  curriculum.js         levels, goals, exercises, pass tests
  content.js            theory, reading legend and examples, technique, warm up, common mistakes
  kit-parts.js          the text behind each part of the 3D kit
js/render/notation.js   notation (SVG), tabs (text) and count labels generated from groove data
js/features/            one module per view or tool
  player.js             groove player, editing grid, tempo ramp, band, pass tests
  metronome.js          metronome, gap trainer, tempo trainer
  scoring.js            MIDI, keyboard and touch input, hit matching, latency calibration
  kit3d.js              Three.js kit (library loaded from a CDN on first open)
  curriculum.js         curriculum view
  learn.js              theory, technique, mistakes, reading, rhythm library views
  quiz.js               reading challenge and tab reading test
  practice.js           weekly plan, session timer, log, today's session, export and import
  home.js               home dashboard and badges
  songs.js              song lab
  (core/tempo-detect.js  BPM detection, pure function used by the song lab)
test/                   node unit test for the detector and a browser smoke test page
```

Adding a groove means adding one object to `js/data/grooves.js`. Notation, tab, playback, the rhythm library and the song lab pick it up automatically.

## Song lab

Search for a real song, get its artwork and a 30 second preview (iTunes Search API, no key needed), then find its tempo by tapping along, by letting the page analyse the preview, or by dropping in an audio file of the song. The detected tempo is matched against the groove library so you can open the closest patterns at the song's tempo and mute the parts you want to play yourself. One click searches for drum tabs, sheet music, drum covers, lessons and drumless tracks on other sites, and a pasted YouTube link plays inside the page. Saved songs, with notes and structure, are stored with the rest of the progress and included in the export.

## Tests

```
npm run check    # syntax check every module
npm test         # BPM detector against synthetic tracks at known tempos
```

For a click-through of every view, serve the project root (`npm start`) and open `/test/smoke.html`; each line should read `ok`.

## Notes

- MIDI input needs Chrome or Edge over HTTPS (GitHub Pages provides HTTPS) or on localhost.
- The 3D kit loads Three.js from cdnjs the first time it is opened. Song search and tempo detection from a preview need an internet connection; everything else works offline once loaded.
- Progress is stored in the visitor's own browser (localStorage). Export and import from the Practice tab.
- Every view has its own URL, for example `#/play` or `#/songs`, so the back button and bookmarks work.
- The look is deliberately old: serif text, typewriter labels, paper for notation. No web fonts or images; it is all CSS.
- All exercises are original. Named drummers are described, not transcribed.
