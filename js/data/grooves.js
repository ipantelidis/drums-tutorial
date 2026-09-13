// The pattern library. Every groove, rudiment and fill in the course is data here; notation, tabs and playback are generated from it.

// Velocity codes: x normal, X accent, o ghost, . rest. Spaces are ignored.
// spb = grid steps per beat (4 sixteenths, 3 triplets, 6 sixteenth triplets, 2 for x/8 meters where the beat is the eighth note).
export function row(str) { return [...str.replace(/[\s|]/g, '')].map(c => c === 'x' ? 1 : c === 'X' ? 1.3 : c === 'o' ? 0.35 : 0); }
export const VOICE_NAMES = { cr: 'Crash', rd: 'Ride', ho: 'Open hat', hh: 'Hi hat', hf: 'Hat foot', sn: 'Snare', t1: 'High tom', t2: 'Mid tom', fl: 'Floor tom', kk: 'Kick' };
export const VOICE_ORDER = ['cr', 'rd', 'ho', 'hh', 'sn', 't1', 't2', 'fl', 'kk', 'hf'];
export const GROOVES = [
  // ---- Rudiments and control ----
  { id: 'ss8', cat: 'Rudiments', name: 'Single stroke roll, eighths', bpm: 80, voices: { sn: row('x.x. x.x. x.x. x.x.') }, stick: 'R.L. R.L. R.L. R.L.',
    desc: 'Alternate hands, every note the same volume and height. Let the stick rebound instead of lifting it. This is the first page idea of Stick Control: alternate strokes until they are boring.' },
  { id: 'ss16', cat: 'Rudiments', name: 'Single stroke roll, sixteenths', bpm: 70, voices: { sn: row('xxxx xxxx xxxx xxxx') }, stick: 'RLRL RLRL RLRL RLRL',
    desc: 'Same as the eighths but twice as dense. If the right hand is louder, you are hearing the beginner asymmetry. Practice starting with the left.' },
  { id: 'ds16', cat: 'Rudiments', name: 'Double stroke roll', bpm: 60, voices: { sn: row('xxxx xxxx xxxx xxxx') }, stick: 'RRLL RRLL RRLL RRLL',
    desc: 'Two strokes per hand. At slow tempo play two full wrist strokes. Above roughly 120 BPM the second note comes from the fingers and rebound, not the wrist. Keep the second note as loud as the first.' },
  { id: 'pd', cat: 'Rudiments', name: 'Single paradiddle', bpm: 70, voices: { sn: row('Xxxx Xxxx Xxxx Xxxx') }, stick: 'RLRR LRLL RLRR LRLL',
    desc: 'Right left right right, left right left left. Accent the first note of each group. The paradiddle is the skeleton of hundreds of grooves and fills because the lead hand switches every four notes.' },
  { id: 'pdkit', cat: 'Rudiments', name: 'Paradiddle around the kit', bpm: 70, voices: { sn: row('xx.. xx.. xx.. xx..'), fl: row('..xx ..xx ..xx ..xx') }, stick: 'RLRR LRLL RLRR LRLL',
    desc: 'The single strokes stay on the snare and the doubles move to the floor tom. Later move the doubles to any drum. This is how rudiments turn into fills.' },
  { id: 'flam', cat: 'Rudiments', name: 'Flam', bpm: 60, voices: { sn: row('oX.. oX.. oX.. oX..') }, stick: 'lR.. rL.. lR.. rL..',
    desc: 'A quiet grace note just before a full stroke, so the two notes smear into one fat sound. In this grid the grace note is a sixteenth early, which is far too wide; a real flam is a few milliseconds. Start one stick high and one low and drop them together.' },
  { id: 'drag', cat: 'Rudiments', name: 'Drag (ruff)', bpm: 60, voices: { sn: row('ooX. ooX. ooX. ooX.') }, stick: 'llR. rrL. llR. rrL.',
    desc: 'Two quiet bounced notes from one hand into a full stroke from the other. As with the flam, the real spacing is much tighter than this grid shows. The double should be a rebound, not two wrist strokes.' },
  { id: 'acc1', cat: 'Rudiments', name: 'Accent control, accent on the beat', bpm: 80, voices: { sn: row('Xxxx Xxxx Xxxx Xxxx') }, stick: 'RLRL RLRL RLRL RLRL',
    desc: 'Sixteenths at one quiet volume with one loud note. The quiet notes are taps from low height, the accent is a full stroke. Do not slow down for the accent.' },
  { id: 'acc2', cat: 'Rudiments', name: 'Accent control, accent on the e', bpm: 80, voices: { sn: row('xXxx xXxx xXxx xXxx') }, stick: 'RLRL RLRL RLRL RLRL',
    desc: 'Same sixteenths, accent moved to the second note. Moving the accent around the beat is the whole idea behind Syncopation and it is the fastest way to understand where beats live.' },
  { id: 'acc3', cat: 'Rudiments', name: 'Accent control, accent on the and', bpm: 80, voices: { sn: row('xxXx xxXx xxXx xxXx') }, stick: 'RLRL RLRL RLRL RLRL', desc: 'Accent on the third sixteenth, which is the offbeat eighth.' },
  { id: 'acc4', cat: 'Rudiments', name: 'Accent control, accent on the a', bpm: 80, voices: { sn: row('xxxX xxxX xxxX xxxX') }, stick: 'RLRL RLRL RLRL RLRL', desc: 'Accent on the last sixteenth, the note that pushes into the next beat. The hardest of the four to keep steady.' },
  { id: 'coord1', cat: 'Rudiments', name: 'Hat and kick coordination', bpm: 80, voices: { hh: row('x.x. x.x. x.x. x.x.'), kk: row('x... x... x... x...') },
    desc: 'Right hand plays eighths on the hi hat, right foot plays quarters. The hand and foot must land at exactly the same instant on the beat. Listen for a single attack, not a flam.' },
  { id: 'coord2', cat: 'Rudiments', name: 'Hat and snare coordination', bpm: 80, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...') },
    desc: 'Eighths on the hat, snare on 2 and 4. Both hands hit together on 2 and 4. The flam between hat and snare is the single most common beginner sound; fix it here before adding the kick.' },

  // ---- Basic rock ----
  { id: 'rock1', cat: 'Basic rock', name: 'Core rock beat', bpm: 100, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x... .... x... ....') },
    desc: 'Kick on 1 and 3, snare on 2 and 4, eighths on the hi hat. Most of Oasis, a lot of early Radiohead and half of all rock music is this beat with small changes to the kick.' },
  { id: 'rock2', cat: 'Basic rock', name: 'Kick on the and of 3', bpm: 100, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x... .... x.x. ....') },
    desc: 'The most common variation. The extra kick lands with a hi hat note, so it should feel easy.' },
  { id: 'rock3', cat: 'Basic rock', name: 'Double kick on 1', bpm: 100, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x.x. .... x... ....') },
    desc: 'Kick on 1 and the and of 1. Keep the second kick the same volume as the first.' },
  { id: 'rock4', cat: 'Basic rock', name: 'Kick on the and of 2', bpm: 100, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x... ..x. x... ....') },
    desc: 'The kick after the snare gives a forward lean. Common in mid tempo rock and Britpop.' },
  { id: 'rock5', cat: 'Basic rock', name: 'Kick on the and of 4, pushing into 1', bpm: 100, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x... .... x... ..x.') },
    desc: 'The last kick anticipates the next bar. Beginners tend to rush this one. Keep the hat eighths as your anchor.' },
  { id: 'rockcrash', cat: 'Basic rock', name: 'Britpop straight eighths with crash and open hat', bpm: 105, voices: { cr: row('x... .... .... ....'), hh: row('..x. x.x. x.x. x...'), ho: row('.... .... .... ..x.'), sn: row('.... x... .... x...'), kk: row('x... ..x. x... ....') },
    desc: 'Crash on 1 with the kick, open hat on the and of 4 that closes on the next 1. Oasis style: steady, unfussy, loud and consistent. The open hat is a foot move as much as a hand move.' },
  { id: 'ride', cat: 'Basic rock', name: 'Ride groove with hat foot', bpm: 100, voices: { rd: row('x.x. x.x. x.x. x.x.'), hf: row('x... x... x... x...'), sn: row('.... x... .... x...'), kk: row('x... .... x.x. ....') },
    desc: 'Move the right hand to the ride and keep the left foot busy closing the hi hat on every beat. Rock choruses often move to the ride for a bigger sound.' },
  { id: 'alt8', cat: 'Basic rock', name: 'Driving eighths, mid 90s alt rock style', bpm: 112, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x... ..x. ..x. ....') },
    desc: 'Kick on 1, the and of 2 and the and of 3. The syncopated kicks pull against the hat eighths. Early Radiohead and Oasis both live here.' },

  // ---- Sixteenth grooves ----
  { id: 'six1', cat: 'Sixteenth grooves', name: 'Sixteenth hats with ghost notes', bpm: 85, voices: { hh: row('xxxx xxxx xxxx xxxx'), sn: row('..o. X..o ..o. X...'), kk: row('x... ..x. x... ....') },
    desc: 'Both hands alternate on the hat (right left right left) and the left hand drops to the snare for ghosts. Ghost notes are barely audible. Accent 2 and 4.' },
  { id: 'six2', cat: 'Sixteenth grooves', name: 'Sixteenth kick figure', bpm: 95, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x..x .... x..x ....') },
    desc: 'The second kick lands on the a of the beat, between hat notes. The foot has to play a sixteenth while the hand plays eighths. Count e and a out loud.' },
  { id: 'six3', cat: 'Sixteenth grooves', name: 'Sixteenth hats with open hat pickup', bpm: 90, voices: { hh: row('xxxx xxxx xxxx xxx.'), ho: row('.... .... .... ...x'), sn: row('.... x... .... x...'), kk: row('x... ..x. x... ....') },
    desc: 'The open hat on the last sixteenth closes on 1. The foot lifts for one sixteenth and stamps down on the beat.' },
  { id: 'six4', cat: 'Sixteenth grooves', name: 'Funk rock ghost groove', bpm: 92, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.o.. X..o .o.. X...'), kk: row('x... ..x. x... ....') },
    desc: 'Eighth hats, ghost notes on the e of 1 and the a of 2. The ghosts sit between hat notes, which is where the difficulty is.' },

  // ---- Half time ----
  { id: 'half1', cat: 'Half time', name: 'Half time groove', bpm: 90, voices: { hh: row('x.x. x.x. x.x. x.x.'), ho: row('.... .... .... ..x.'), sn: row('.... .... x... ....'), kk: row('x... ..x. .... ....') },
    desc: 'The snare moves to 3 so the bar feels twice as long. Used for heavy verses and the moment a song drops down before a big chorus.' },
  { id: 'half2', cat: 'Half time', name: 'Half time with sixteenth kicks', bpm: 85, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... .... x... ....'), kk: row('x..x .... .... x...') },
    desc: 'Half time with a kick on the a of 1 and on 4. The space in the middle of the bar is the point; do not fill it.' },

  // ---- Shuffle (triplet grid) ----
  { id: 'shuf1', cat: 'Shuffle', name: 'Basic shuffle', bpm: 110, spb: 3, voices: { hh: row('x.x x.x x.x x.x'), sn: row('... x.. ... x..'), kk: row('x.. ... x.. ...') },
    desc: 'Each beat is a triplet and the hat plays the first and third notes: long, short, long, short. Count "1 trip let" and play on 1 and let.' },
  { id: 'shuf2', cat: 'Shuffle', name: 'Shuffle with skipping kick', bpm: 110, spb: 3, voices: { hh: row('x.x x.x x.x x.x'), sn: row('... x.. ... x..'), kk: row('x.x ... x.x ...') },
    desc: 'The kick copies the shuffle rhythm on 1 and 3. Keep the kick doubles even.' },
  { id: 'halfshuf', cat: 'Shuffle', name: 'Half time shuffle, my own version', bpm: 95, spb: 3, voices: { hh: row('x.x x.x x.x x.x'), sn: row('..o ..o X.o ..o'), kk: row('x.. ..x ... ...') },
    desc: 'The famous half time shuffle family (Purdie, Porcaro, Bonham on Fool in the Rain) has ghost notes on the triplet partials and one big snare on 3. This is my simplified original version. Ghosts as quiet as you can make them.' },

  // ---- Odd meters ----
  { id: 'waltz', cat: 'Odd meters', name: '3/4 rock groove', bpm: 110, beats: 3, sig: '3/4', voices: { hh: row('x.x. x.x. x.x.'), sn: row('.... x... x...'), kk: row('x... .... ....') },
    desc: 'Three beats per bar. Snare on 2 and 3 gives a rock feel rather than a waltz. Count 1 2 3 out loud for a full minute before adding limbs.' },
  { id: 'six8a', cat: 'Odd meters', name: '6/8 groove (tempo is the eighth note)', bpm: 180, beats: 6, spb: 2, beam: 6, sig: '6/8', voices: { hh: row('x. x. x. x. x. x.'), sn: row('.. .. .. x. .. ..'), kk: row('x. .. .. .. .. ..'), fl: row('.. .. .. .. .. o.') },
    desc: 'Six eighths per bar, felt as two groups of three. Kick on 1, snare on 4. The count is 1 2 3 4 5 6 with weight on 1 and 4. The tempo number here is the eighth note, so 180 means a relaxed 6/8.' },
  { id: 'six8b', cat: 'Odd meters', name: '6/8 slow ballad, Mason style', bpm: 150, beats: 6, spb: 2, beam: 6, sig: '6/8', voices: { rd: row('x. x. x. x. x. x.'), sn: row('.. .. .. X. .. ..'), kk: row('x. .. .. .. x. ..'), hf: row('x. .. .. x. .. ..') },
    desc: 'Ride on every eighth, snare on 4, kick on 1 and 5. Slow 6/8 is a Pink Floyd home ground (Us and Them is often described as 6/8 or 12/8). Playing this slowly and evenly is harder than playing it fast.' },
  { id: 'seven4', cat: 'Odd meters', name: '7/4 groove, Pink Floyd style', bpm: 115, beats: 7, sig: '7/4', voices: { hh: row('x.x. x.x. x.x. x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x... .... x... x...'), kk: row('x... .... x.x. .... x... .... ....') },
    desc: 'Seven quarter notes per bar. Money is the famous example and is commonly described as 7/4, though I am not certain how Mason himself counts it. Feel it as 3 + 4 or 4 + 3; this groove is written to feel like 4 + 3. Original pattern.' },
  { id: 'seven8', cat: 'Odd meters', name: '7/8 groove, Selway style (tempo is the eighth)', bpm: 200, beats: 7, spb: 2, sig: '7/8', voices: { hh: row('x. x. x. x. x. x. x.'), sn: row('.. .. x. .. .. .. x.'), kk: row('x. .. .. x. .. x. ..') },
    desc: 'Seven eighths, grouped 3 + 2 + 2 with kicks on 1, 4 and 6. Radiohead use 7/8 sections (2 + 2 = 5 is usually described this way). Count 1 2 3 1 2 1 2 until it stops feeling lopsided.' },
  { id: 'five4', cat: 'Odd meters', name: '5/4 groove, Selway style', bpm: 95, beats: 5, sig: '5/4', voices: { hh: row('x.x. x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x... ..x.'), kk: row('x... .... x... .... x...') },
    desc: 'Five beats, felt as 3 + 2. 15 Step is the well known Radiohead example in 5/4. The snare on the and of 5 makes the bar turn around. Original pattern.' },

  // ---- Bonham style ----
  { id: 'bon1', cat: 'Bonham style', name: 'Triplet kick figure', bpm: 90, spb: 6, voices: { hh: row('x..x.. x..x.. x..x.. x..x..'), sn: row('...... x..... ...... x.....'), kk: row('x.x.x. ...... x...x. ......') },
    desc: 'Eighth hats with kick triplets underneath on beat 1 and a kick on 3 and its last triplet note. Bonham fitted triplet based kick figures under straight hats constantly (Good Times Bad Times is the textbook case, though this is not that pattern). Start at 60.' },
  { id: 'bon2', cat: 'Bonham style', name: 'Kick doubles leading into the beat', bpm: 95, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x...'), kk: row('x... ...x x... ...x') },
    desc: 'The kick on the a of 2 and the a of 4 leads into the next downbeat, so 4 a 1 becomes a rolling figure. Play the a quieter than the beat. Heel up gives you the speed.' },
  { id: 'bon3', cat: 'Bonham style', name: 'Heavy slow groove, behind the beat', bpm: 70, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... X... .... X...'), kk: row('x.x. .... x... ..x.') },
    desc: 'Slow, huge and slightly late. Bonham sat the snare a hair behind the click and hit it very hard. Play this with the click and try letting 2 and 4 land just after it, without slowing down. When the Levee Breaks has this weight, though this is not that pattern.' },
  { id: 'bon4', cat: 'Bonham style', name: 'Hands and foot triplet fill (R L K)', bpm: 100, spb: 3, bars: 2, voices: { hh: row('x.. x.. x.. x.. | ... ... ... ...'), sn: row('... x.. ... x.. | xx. xx. ... ...'), t1: row('... ... ... ... | ... ... xx. ...'), fl: row('... ... ... ... | ... ... ... xx.'), kk: row('x.. ... x.. ... | ..x ..x ..x ..x') }, stick: '... ... ... ... | RLK RLK RLK RLK',
    desc: 'Bar 1 is a plain groove. Bar 2 is right, left, kick repeated as triplets, moving from snare to high tom to floor tom. This hand hand foot triplet is the single most recognisable Bonham fill device. Start very slowly; the kick note is the one that drags.' },

  // ---- Mason style ----
  { id: 'mason1', cat: 'Mason style', name: 'Slow spacious groove', bpm: 62, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... X... .... X...'), kk: row('x... .... x... ....'), t2: row('.... .... .... ...x') },
    desc: 'Nick Mason is a master of leaving space. Nothing fancy here except the tempo and the single mid tom on the a of 4 that pulls into the next bar. At 62 BPM every gap is exposed. Under 60 counts toward the Slow and steady badge.' },
  { id: 'mason2', cat: 'Mason style', name: 'Tom melody groove', bpm: 60, voices: { t1: row('x... x... .... x...'), t2: row('..x. .... x... ..x.'), fl: row('.... ..x. .... ....'), kk: row('x... .... x... ....') },
    desc: 'The groove lives on the toms instead of the snare. Mason used tom based patterns to make drums melodic (the famous rototom intro to Time is the model, not reproduced here). Tune your electronic toms so this sounds like a phrase.' },

  // ---- Selway style ----
  { id: 'sel1', cat: 'Selway style', name: 'Displaced backbeat', bpm: 100, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... ..x. ....'), kk: row('x... .... x... x...') },
    desc: 'The second snare is moved from 4 to the and of 3, so the bar feels like it trips forward. Phil Selway does this kind of displacement a lot. Keep the hats dead straight so the displacement is heard against something.' },
  { id: 'sel2', cat: 'Selway style', name: 'Motorik drive', bpm: 120, voices: { hh: row('xxxx xxxx xxxx xxxx'), sn: row('.... x... .... x..o'), kk: row('x... x... x... x...') },
    desc: 'Kick on every beat, sixteenth hats, snare on 2 and 4 with a ghost pickup. The Krautrock pulse that runs under a lot of In Rainbows era Radiohead. Relentless evenness is the whole skill.' },
  { id: 'sel3', cat: 'Selway style', name: 'Chopped loop feel', bpm: 92, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('.... x... .... x.x.'), kk: row('x..x ..x. .... x...') },
    desc: 'Late 90s Radiohead drums often sound like a sampled loop that was cut up. The extra snare on the and of 4 and the sixteenth kick on the a of 1 give that stuttering feel. Original pattern.' },

  // ---- Fills (bar 1 groove, bar 2 fill) ----
  { id: 'fill1', cat: 'Fills', name: 'Eighth note snare fill', bpm: 100, bars: 2, voices: { hh: row('x.x. x.x. x.x. x.x. | .... .... .... ....'), sn: row('.... x... .... x... | x.x. x.x. x.x. x.x.'), kk: row('x... .... x... .... | x... x... x... x...') }, stick: '.... .... .... .... | R.L. R.L. R.L. R.L.',
    desc: 'Your first fill. Eight even snare notes with the kick keeping quarters. Land back on 1 with a crash if you like. The most common error is speeding up through the fill.' },
  { id: 'fill2', cat: 'Fills', name: 'Sixteenth note snare fill', bpm: 95, bars: 2, voices: { hh: row('x.x. x.x. x.x. x.x. | .... .... .... ....'), sn: row('.... x... .... x... | xxxx xxxx xxxx xxxx'), kk: row('x... .... x... .... | x... x... x... x...') }, stick: '.... .... .... .... | RLRL RLRL RLRL RLRL',
    desc: 'Sixteen even notes. Keep the kick quarters going; they are what stop you from rushing.' },
  { id: 'fill3', cat: 'Fills', name: 'Sixteenths around the kit', bpm: 95, bars: 2, voices: { hh: row('x.x. x.x. x.x. x.x. | .... .... .... ....'), sn: row('.... x... .... x... | xxxx .... .... ....'), t1: row('.... .... .... .... | .... xxxx .... ....'), t2: row('.... .... .... .... | .... .... xxxx ....'), fl: row('.... .... .... .... | .... .... .... xxxx'), kk: row('x... .... x... .... | x... x... x... x...') }, stick: '.... .... .... .... | RLRL RLRL RLRL RLRL',
    desc: 'One beat on each drum, snare, high tom, mid tom, floor tom. Lead with the right hand so you are not crossing over. Moving between drums is where time gets lost; the metronome will tell you.' },
  { id: 'fill4', cat: 'Fills', name: 'Eighth note tom fill with kick', bpm: 100, bars: 2, voices: { hh: row('x.x. x.x. x.x. x.x. | .... .... .... ....'), sn: row('.... x... .... x... | x.x. .... .... ....'), t1: row('.... .... .... .... | .... x.x. .... ....'), t2: row('.... .... .... .... | .... .... x.x. ....'), fl: row('.... .... .... .... | .... .... .... x.x.'), kk: row('x... .... x... .... | x... x... x... x...') },
    desc: 'Eighths down the toms. Simpler than the sixteenth version and often sounds bigger. Bonham and Mason both favoured wide, slow tom fills over fast ones.' },
  { id: 'fill5', cat: 'Fills', name: 'Half bar fill (beats 3 and 4)', bpm: 100, bars: 2, voices: { hh: row('x.x. x.x. x.x. x.x. | x.x. x.x. .... ....'), sn: row('.... x... .... x... | .... x... xxxx ....'), t1: row('.... .... .... .... | .... .... .... xx..'), fl: row('.... .... .... .... | .... .... .... ..xx'), kk: row('x... .... x... .... | x... .... x... ....') },
    desc: 'Keep the groove for beats 1 and 2, fill on 3 and 4. Most real fills in songs are this length or shorter.' },
  { id: 'fill6', cat: 'Fills', name: 'Triplet fill', bpm: 100, spb: 3, bars: 2, voices: { hh: row('x.. x.. x.. x.. | ... ... ... ...'), sn: row('... x.. ... x.. | xxx xxx ... ...'), t1: row('... ... ... ... | ... ... xxx ...'), fl: row('... ... ... ... | ... ... ... xxx'), kk: row('x.. ... x.. ... | x.. x.. x.. x..') }, stick: '... ... ... ... | RLR LRL RLR LRL',
    desc: 'Three notes per beat. Triplet fills sound rolling and loose, which is why they suit blues based rock. Say "trip let" as you play until the spacing is even.' },
  { id: 'fill7', cat: 'Fills', name: 'Sixteenth triplet flourish', bpm: 80, spb: 6, bars: 2, voices: { hh: row('x..x.. x..x.. x..x.. x..x.. | x..x.. x..x.. ...... ......'), sn: row('...... x..... ...... x..... | ...... x..... xxxxxx ......'), t1: row('...... ...... ...... ...... | ...... ...... ...... xxx...'), fl: row('...... ...... ...... ...... | ...... ...... ...... ...xxx'), kk: row('x..... ...... x..... ...... | x..... ...... x..... ......') },
    desc: 'Six notes on beat 3, then three and three on beat 4. Sixteenth triplets are the fast flourish you hear at the end of Bonham phrases. Only attempt after sixteenth fills are clean at 110.' },
  { id: 'fill8', cat: 'Fills', name: 'Linear fill, hands and feet alternating', bpm: 90, bars: 2, voices: { hh: row('x.x. x.x. x.x. x.x. | .... .... .... ....'), sn: row('.... x... .... x... | x..x x..x .... ....'), t1: row('.... .... .... .... | .... .... x..x ....'), fl: row('.... .... .... .... | .... .... .... x..x'), kk: row('x... .... x... .... | .xx. .xx. .xx. .xx.') }, stick: '.... .... .... .... | RKKL RKKL RKKL RKKL',
    desc: 'Linear means no two limbs hit at once. Right, kick, kick, left, moving across the drums. This is the gateway to the more modern fill vocabulary.' },

  // ---- Advanced ----
  { id: 'linear1', cat: 'Advanced', name: 'Linear groove', bpm: 90, voices: { hh: row('.x.x .x.x .x.x .xx.'), sn: row('..o. x... ..o. x...'), kk: row('x... ..x. x... ...x') },
    desc: 'Every sixteenth is played by exactly one limb. The hat falls on the e and a, the snare on the and of 1 and beat 2, the kick fills the rest. Sounds like a drum machine when it is even.' },
  { id: 'flamgroove', cat: 'Advanced', name: 'Flams on the backbeat', bpm: 90, voices: { hh: row('x.x. x.x. x.x. x.x.'), sn: row('...o X... ...o X...'), kk: row('x... .... x.x. ....') },
    desc: 'The snare on 2 and 4 becomes a flam. The grid shows the grace note a sixteenth early, which is far too wide; make it almost simultaneous. Flammed backbeats are a Bonham signature and make the snare sound twice as big.' },
  { id: 'herta', cat: 'Advanced', name: 'Herta', bpm: 80, voices: { sn: row('xxx. x.xx x.x. xxx.') }, stick: 'RLR. L.RL R.L. RLR.',
    desc: 'Two sixteenths followed by two eighths, so the group is one and a half beats long and cycles against the bar. Classic fill ingredient. The doubles are single strokes here, not bounced.' },
  { id: 'sixtrip', cat: 'Advanced', name: 'Sixteenth triplets on the snare', bpm: 60, spb: 6, voices: { sn: row('Xxxxxx Xxxxxx Xxxxxx Xxxxxx') }, stick: 'RLRLRL RLRLRL RLRLRL RLRLRL',
    desc: 'Six notes per beat, accent on the beat. Keep the wrists low and let the fingers help. If the six notes bunch up, go slower.' },
  { id: 'poly43', cat: 'Advanced', name: 'Straight 4/4 under a riff in 3 (Kashmir idea)', bpm: 80, bars: 3, voices: { hh: row('x.x. x.x. x.x. x.x. | x.x. x.x. x.x. x.x. | x.x. x.x. x.x. x.x.'), sn: row('.... X... .... X... | .... X... .... X... | .... X... .... X...'), kk: row('x... .... x... .... | x... .... x... .... | x... .... x... ....'), fl: row('X... x... x... X... | x... x... X... x... | x... X... x... x...') },
    desc: 'The drums play straight 4/4 for three bars while the floor tom marks a riff in groups of three, so they line up again every 12 beats. This is the tension in Kashmir, where Bonham stays in 4 against a riff in 3. Original arrangement of the idea. Once it feels natural, drop the floor tom and just hear the riff in your head.' },
];

// Dynamics: the same groove at four volumes.
(function () {
  const base = GROOVES.find(g => g.id === 'rock1'); const vs = [0.4, 0.7, 1, 1.3]; const voices = {};
  for (const v in base.voices) voices[v] = vs.flatMap(s => base.voices[v].map(x => x ? Math.min(1.5, x * s) : 0));
  GROOVES.push({ id: 'dyn1', cat: 'Dynamics and form', name: 'Same groove, four volumes (p, mp, f, ff)', bpm: 100, bars: 4, voices,
    desc: 'The same beat played soft, medium, loud and very loud, one bar each. Each step up should be a clear change without any change in tempo. Beginners speed up when they play louder. Use the Dynamics slider in the player to hear the whole groove scaled too.' });
})();
// Song form: verse, chorus, with fills at the turnarounds.
function barOf(id, barIdx) { const g = GROOVES.find(x => x.id === id); const n = (g.beats || 4) * (g.spb || 4); const out = {}; for (const v in g.voices) out[v] = g.voices[v].slice(barIdx * n, (barIdx + 1) * n); return out; }
function sequence(id, name, bpm, items, desc) {
  const voices = {}; let bars = 0; const labels = [];
  for (const it of items) for (let r = 0; r < (it.rep || 1); r++) { const b = barOf(it.g, it.bar || 0); for (const v of VOICE_ORDER) { if (!voices[v]) voices[v] = []; } for (const v of VOICE_ORDER) voices[v].push(...(b[v] || new Array(16).fill(0))); bars++; labels.push(it.label || ''); }
  for (const v in voices) if (!voices[v].some(x => x)) delete voices[v];
  GROOVES.push({ id, cat: 'Dynamics and form', name, bpm, bars, voices, barLabels: labels, desc });
}
sequence('form1', 'Song form: intro, verse, chorus (16 bars)', 108, [
  { g: 'coord1', rep: 2, label: 'Intro' }, { g: 'rock1', rep: 3, label: 'Verse' }, { g: 'fill1', bar: 1, label: 'Fill' },
  { g: 'rock2', rep: 3, label: 'Verse' }, { g: 'fill5', bar: 1, label: 'Fill' },
  { g: 'rockcrash', rep: 3, label: 'Chorus' }, { g: 'fill3', bar: 1, label: 'Fill' }, { g: 'ride', rep: 2, label: 'Chorus' },
], 'A miniature song. Two bars of hats and kick as an intro, eight bars of verse with a fill in bar 4 and a half bar fill in bar 8, then a chorus with crash and open hats, a big fill, and two bars on the ride. Drummers mark the form: the fill announces the change, the crash confirms it.');

// Normalise: pad or trim rows, attach defaults.
GROOVES.forEach(g => {
  g.beats = g.beats || 4; g.spb = g.spb || 4; g.bars = g.bars || 1; g.sig = g.sig || (g.beats + '/4'); g.beam = g.beam || g.spb;
  const n = g.beats * g.spb * g.bars;
  for (const v in g.voices) { const a = g.voices[v]; if (a.length !== n) { console.warn('length', g.id, v, a.length, n); while (a.length < n) a.push(0); a.length = n; } }
  if (g.stick) { g.stick = g.stick.replace(/[\s|]/g, ''); if (g.stick.length !== n) console.warn('stick', g.id, g.stick.length, n); }
});
export const G = id => GROOVES.find(g => g.id === id);
