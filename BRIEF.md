# Mine AI talk: brief

The contract for this deck. Change this file first when the talk changes, then the slides.

## The talk

- **What:** Ben presenting Mine AI MCP (`../2609_mine_ai_mcp`) at Google, solo, 18 November 2026.
- **Announced as:** "Beating Minecraft with an LLM: Engineering a Reliable Long-Horizon Agent" (see "What was
  promised"). That was the title slide; since Ben's copy pass (17 November) its subtitle reads "What I had to build so
  Claude could finish the game". "Shrink the AI's job" is the thesis and first shows on slide 18.
- **Slot:** 09:30 to 10:55 Sydney time, so 85 minutes are booked. The invite has a video call on it, so some of
  the audience may be remote.
- **Length:** 45 minutes of talk, 15 minutes of questions.
- **Audience:** mostly engineers, some marketing, some researchers. Some have never played Minecraft.
- **Content freeze:** 14 November. After that, only rehearsal fixes.

## What was promised

The title and abstract Ben sent the host on 22 October 2026. The audience turns up for this, so the deck has to
deliver every part of it.

> **Beating Minecraft with an LLM: Engineering a Reliable Long-Horizon Agent**
>
> What does it take to get an LLM from an empty Minecraft world to defeating the Ender Dragon? In this talk, I'll
> walk through Mine AI MCP, the tooling I built to let a language model observe the world, choose actions and
> respond to what actually happened. The completed run provides a concrete case study in long-horizon agent
> engineering: navigation, resource gathering, combat, failure and recovery. The focus is practical lessons for
> building and evaluating agents that need to keep working beyond a short demo.

| Promised | Where the deck delivers it | How well |
|---|---|---|
| "What does it take" to beat it | The question (14), the six layers (17), the idea (18) | Strong. Slide 14 is nearly the abstract's first sentence. |
| Empty world to the Ender Dragon | The route and its clips (5), the dragon clip (12), What happened in the run (its timeline) | Strong |
| Observe, choose actions, respond to what actually happened | The model asks for one whole job at a time, we died repeatedly to a spider (part 6) | Strong |
| Reliable | The rule on slide 17, how it got reliable (29) | Strong |
| Long-horizon | One prompt then hands off (13), the async design (We died of boredom, part 6), the timeline on What happened in the run | There, but no slide uses the word since the title's subtitle changed (17 November). Say it on slide 13. |

(Evening of 17 November, after Ben: "this one isn't clear to me". The Waiting rung is no longer "We died of boredom". Its headline is "One stuck job locked us out for good", with the 24 August ACTION_BUSY reply as the quote, the same fix line, the walk back to the Nether portal in the winning run as the table (requests 133 to 135: one navigate call, 5 min 38 s, two waits) and one click for a cancel (request 107). It has no "We died…" reveal. The 7 September death and the obsidian table are in its notes. Ben explained async on the winning-run stream at 1:21:09, during that same walk.) (Later that evening the headline became "One stuck job locked us out for good" and a sentence under the quote says what followed: five calls refused in two minutes, even reads of its own database, the job never answered, the server had to be killed. Timeline in the slide's notes, from the 24 August field note.)

| Navigation | Part 6: We got stuck under the ocean and couldn't get out (the Stream 11 clip, 5 Aug; 24 km walked), then How a pathfinder finds the way (Since the evening of 17 November its three callouts are a table, Baritone against stock mineflayer-pathfinder 2.4.5: prices every move in game ticks, separate code to walk each move, opens doors, falls 20 blocks with a water bucket, all four a tick for Baritone and a cross for mineflayer-pathfinder, on one click; then "Runs outside the Java game client", a cross for Baritone, on the next; then the fix line. "Planned in pieces" came off because it isn't a difference. Don't claim more kinds of move: 8 classes against 7 generators. The map is now drawn by site/pathfinder3d.js as raised blocks on a canvas, Canvas 2D with no WebGL, reading the flat .ast-grid in the markup for its cells and timing; the flat grid is hidden on screen and is what prints.) (an A* run, three things Baritone does well, the rebuild following it); Racing Baritone is in the appendix | Strong |
| Resource gathering | The model asks for one whole job at a time (part 6): the run's first collect_block on screen, smelting and crafting in its notes; the gear-up phase and the 0:23 tile on What happened in the run | Thinner since 16 November: one gathering call on screen, the rest in notes. |
| Combat | We died in the middle of a job (part 6): the six reflexes, the shared fighting engine, Dragon dodges; and the override, We died because a reflex wouldn't let us leave | Strong |
| Failure and recovery | The "1 in 3 calls went wrong" and "Still won" tiles on What happened in the run (one slide since 14 November), the creeper death, then respawning and walking back for its gear (a line under the creeper marker since 16 November) | Fine. Recovery is mostly spoken. |
| Lessons for building agents | Takeaways | Strong |
| Lessons for evaluating agents | 493 scenarios (29), second takeaway | There, but never called evaluating. Say it on slide 29 (its notes do). |
| Beyond a short demo | Takeaways notes ("for any agent that has to keep running for hours after the demo's over"; the kicker that said it came off on 14 November) | Fine |

Two things in the deck aren't promised, and stay: the fine print, and the Pokémon slides (8–10, 15 and 16), which are the
"why this problem" the abstract takes for granted.

## The story: seven parts, each a question

Ben, 10 November: the order worked, but the chapters of the story weren't clear on the slides. So the talk is now
seven parts, each named by the question it answers, and each opens with a card: the question on the left, and on
the right the list of all seven with the earlier ones ticked and this one lit. Between cards the same list stays
on screen as a rail of numbered boxes down the right edge, with the part the talk is in lit.

The one line: an LLM can beat Minecraft today, and what got it there was the tools built around the model, not a
better model.

| Part | Question | Card | Slides | What it says |
|---|---|---|---|---|
| | | | 1–2 | The title is up while the host introduces Ben. Then who he is: three months of long service leave, and a project to see how far AI could be pushed, with coding agents writing the code while he designed and directed it. |
| 1 | What is Minecraft? | 3 | 4–5 | "Today we're talking about Minecraft." A show of hands, then the route in one line. Its clip plays only if few hands stay up (the plan since 14 November, not the exception). |
| 2 | Why try it with AI? | 6 | 7–8 | People have been using games to test what models can do (the chapter card since Ben's copy pass, 17 November), and Pokémon is the one everybody watched: the headlines, all six at once in one beat (it took a long time), then one click puts a sticker on each run counting the extras its harness gave it (since 15 November, when part 4's help slide merged in: the early wins had help, Fable 5 had none), then why Minecraft is the harder one, with the example clip as an optional pop on that slide. Two slides since 14 November, were three. |
| 3 | Can an LLM do it? | 9 | 10–13 | "Bots have beaten it before", one quick line since 14 November (AltoClef's clip only with time to spare): two cards, AltoClef (code decides, beat the dragon ✓) beside an LLM (the model decides, beat the dragon ?). The question mark is what Ben wanted to know: can an LLM do the whole run and make its own calls? Moved here from the end of part 1 on 10 November (Ben's call), so the question is asked and answered in the same part. Then the dragon dying as the stream saw it, with sound: Ben on the webcam counting down the last hits, arms up, "We did it!". Then the prompt and the stats, which read as "here's what you just watched". Since 15 November (Ben: "do the reorder and I'll see how I feel about it") the run slide comes next, moved intact from part 7: "What happened in the run", its kicker now just "The winning run" and no data-chapter. The clip, the numbers, then what it did. To undo it, move the slide back after "Coding agents wrote the code" and give it back its data-chapter and the "Part 7 of 7 · the winning run" kicker (backup `/tmp/deck-backup-1115-035716-flow-pokemon-merge-run-move`). |
| 4 | How do you approach it? | 14 | 15–17 | "Was that the model, or what I built around it? Let's talk about how you'd even approach it." The card is just the question, with no line under it (Ben, 10 November: "better model, better tools" read oddly and he wouldn't talk to it). Pokémon had the same argument, one line on the card since 15 November (the stickers in part 2 showed it), then playing Pokémon and playing Minecraft, which builds into the six layers, the timing problem and the idea, "Shrink the AI's job". |
| 6 | What did I build? | 26.5 | to 38 | "Here's what that process built." A ladder since Ben's practice run on 16 November: six things that broke, each slide's headline the failure in the words it was written down in, the fix under it (controls, reflexes, replies, navigation and the race against Baritone, waiting, policy). See "Part 6: What did I build?". |
| 7 | What I'd take from this | none | The fine print, Takeaways, Links and questions | Since 15 November the run slide is in part 3, so part 7 opens on the fine print, which carries the part's data-chapter ("What I'd take from this") and the kicker "Part 7 of 7 · what I'd take from this": the honest limits before the takeaways. Still no card. The takeaways have no kicker; their notes say it is the ending, answer part 4 (tools) and point back at "The idea", the same three cards and icons. Then links and questions. On 14 November part 7 was "What happened in the run?" and the run slide opened it. |

Rules for the cards:

- A part's name is a question the room would ask next, in Ben's words where he has said them ("why attempt to
  beat it with AI?", "how do you even approach beating Minecraft with AI?").
- The name is written once, in the card's `data-chapter`. `deck.js` builds every card's list from those.
- The list is always in the same place, which is what Ben asked for on 10 November: "show the chapter number /
  minimised sidebar of chapters at all times, for constant positioning rather than bottom left". There is one list
  on the stage (`#parts`). On ordinary slides it is a rail of seven numbered boxes in the right margin: a tick for
  the parts done, green for the one the talk is in. On a chapter card it opens out into the full list with the
  names, still showing the part before, then that one gets its tick and the new one lights. Moving on folds it
  back to the rail. Going backwards it shows things as they stand, with no tick step.
- The rail gets out of the way on the title slide, on the full-screen dragon clip, while a pop clip plays and while the route clip
  on slide 5 is playing. Before part 1 nothing on it is lit; on the appendix slides all seven are ticked.
- The bottom-left label no longer names the part. It only shows what the rail can't: "Opening", "Who I am" and
  "Appendix". (It also named part 5's three areas until 12 November.) `data-section` still holds the full label, and the
  speaker view still shows it.
- The rail sits in the right margin from x = 1540, so slide content stops at 1528 (`tools/shoot.mjs` checks).
  The timeline on slide 8 moved 6 px left to clear it.
- Each card still has its own copy of the list, hidden on screen. It holds the space, and it is what prints. With
  reduced motion on, nothing animates. `tools/shoot.mjs` runs with reduced motion so its screenshots show the
  list in place.
- Part 7 has no card: the fine print carries its data-chapter (since 15 November; the run slide did on 14 November, the takeaways slide before that), so the list never opens there. The rail just moves to 7.
- Part 5 had three areas with their own opening slides ("Area 1 of 3") until 12 November. Ben cut them: the part
  goes straight to the MCP server.
- Each card costs about ten seconds. Nothing was taken from the time budget for them; the finish-by minutes are
  the same as before.
- Pokémon is told once since 15 November (Ben: "agree, let's merge it"). The harness parallel that was slide 15
  is now one click on the headlines in part 2, and the part 4 card points back at it.

How it got here, all Ben's calls on 10 November. The dragon clip started as a cold open on slide 2. The stats felt
wrong before he'd introduced himself, so the intro went between them. He gets introduced and handed to, so a video
of himself before he'd said who he was felt awkward, and the intro moved ahead of the clip. People who don't know
Minecraft would just be confused by the clip, so it moved to after the Minecraft section. A Pokémon video
straight after the intro didn't link to anything, so the Minecraft section moved ahead of Pokémon. Then the
chapters weren't clear, which is where the seven cards came from.

**The trim (14 November).** A colleague at Google reviewed the deck: the preamble was too long, the audience
is mostly technical, so go further into the technical detail, and the Pokémon part could be shorter (he liked the
motivation). Ben agreed. So the opening and parts 1–3 got shorter by merging and trimming, not by dropping facts:
the route's clip is the exception now, the Pokémon example clip is an optional pop on "Minecraft is a harder
problem" (its own slide is gone), the headlines come up all at once, and AltoClef is one line with its clip optional.
What came off the slides went into the notes as "If asked". The run section was folded down too (see part 6/7 below).

The clip has sound in the audience window only. A browser plays it muted if nobody has clicked in that window
yet, so click once before starting. With no room audio, `?silent` on the URL swaps in the silent screen recording.

## The intro (slide 2)

Under a minute, straight after the host hands over. It answers "why should I listen to this person about this?" with four things:
the job (one plain line on the left), why he built it, when, and one human thing. The proof is the dragon clip
on slide 12, so the slide only names it ("Beat Minecraft with an LLM"). The last three arrive as advancement pop-ups, one click each (the third after the paper, below):
long service leave; "Challenge Complete! Beat Minecraft with an LLM" with "Limit-testing AI capabilities, Jun–Sep
2026" under it; and, since 16 November, "Cited, Oct 2026: Google DeepMind's Argon paper", with "It lists this as one of two community projects
that killed the dragon end to end" under it (a writable book icon). It replaced "For fun: games and pickleball", cut after
the practice run to save time; the talk is at Google and the paper's authors were invited. The wording stays inside
what the paper says: it lists the project as one of two community dragon kills, and never says first. The full
reference: Faldor, Singh and Raileanu (Google DeepMind), "A team of Gemini 4 Argon agents beats Minecraft", arXiv 2610.22319 (arxiv.org/abs/2610.22319), 15 October 2026, section 7, Related work: "Two community projects have recently reported end-to-end dragon kills: a single Claude Opus 5 agent calling 37 high-level Minecraft tools on Normal difficulty (AI Bengineering, 2026), and a planner paired with an action-selection model on a fixed speedrun seed in Peaceful difficulty (Malde, 2026)." Its reference list gives the repo, the Hugging Face dataset and the run that defeated the Ender Dragon, 2026-09-15.
(Checked 16 November against the arXiv HTML and PDF; the affiliation is on the PDF's first page.)
Since 17 November (Ben: "include a link to that paper on that slide, and then maybe have a little transition or
animation that shows the title of the page and then does a little scroll down and highlights my AI Bengineering
reference") the tile ends with the link arxiv.org/abs/2610.22319 (a new tab), and one more click brings up the paper.
Reworked the same day (Ben: "more like a popup and for it to scroll through the whole paper down to the bottom - i
think that's how they'd show it on like a youtube video"), and again (Ben: "I would like the Google DeepMind paper
pop-up thing to happen before the animation in of the citing. And I would like the scroll to happen on a key press so
I can kind of control it by pressing the next button"). Then again (Ben: "Let's scroll to the bit above that, where I'm actually named in the paper, like AI Bengineering has
been called out as having a community project that has beaten the game, and I'll be like, that's me. Not the reference
bit."). The clicks are now: the long service leave tile; the challenge tile; the paper pops up as a window over the
dimmed slide and holds on the top of page 1 (header, title, authors, Google DeepMind) with no timer; the next press
scrolls down through pages 1 to 14 of the 17, accelerating so the middle is a blur, and stops on page 14, section 7,
Related work, on the paragraph "Two community projects have recently reported end-to-end dragon kills: a single Claude
Opus 5 agent calling 37 high-level Minecraft tools on Normal difficulty (AI Bengineering, 2026), and a planner paired
with an action-selection model on a fixed speedrun seed in Peaceful difficulty (Malde, 2026)."; the window widens while
the page zooms in on it (its text about 28 px), with the end of the paragraph before and four lines after in frame, and
slide 7's highlighter yellow sweeps "a single Claude Opus 5 agent ... (AI Bengineering, 2026)" over its two lines,
placed from the PDF's own character boxes, leaving "Two community projects have recently reported end-to-end dragon
kills:" unmarked above it. About 4.8 s in all, then it holds; the next press pops the paper away and the Cited tile,
with its link, slides in on the same click. So the Cited tile isn't on screen until the paper has closed. A press during
the scroll jumps to its end rather than moving on. Each motion plays only for a single → onto its click: ← from the
Cited tile lands on the highlighted hold, ← from the hold lands on the title, and jumps or the speaker window land on the
resting state (deck.js: `argon-play`, `argon-scrolling`, `argon-closing`, like the creeper). The two paper clicks and
the Cited tile are one unit in the markup (`<div class="who-cite">`, display: contents), so putting the citation before
"Challenge Complete!" is moving that div above the challenge tile; nothing else depends on the order. Everything in the
window is the PDF's own pages rendered headless with pdfium, nothing retyped: `media/argon-p01.webp` (page 1, sharp),
`argon-p02` to `argon-p14` (small, they only fly past) and `argon-cite.webp` (a sharp crop of page 14's paragraph, laid
over it for the zoom), about 0.8 MB in all. They load after the deck's first paint, page 1 first; if the scroll is asked
for before the rest are decoded, it holds on the title until they are. The reference-list entry on page 15 ("AI
Bengineering. Mine AI MCP: beating Minecraft with an LLM agent. ...") is no longer shown. The arXiv abs page gives the licence as CC BY 4.0, which the credits slide cites; page 1's own footer
says "© 2026 Google. All rights reserved", and goes past at page scale.
Since 14 November the challenge toast has a second line, "Codex and Claude Code wrote all the code, with me
steering" (its wording since 17 November), so the room knows from the start who typed the code; the new part 6 ("How I built it") is how.
The dates were Jul–Sep until 14 November. They are Jun–Sep now: the bot's earliest files are from 27 June 2026 (an
early project folder, `bot.log` "spawned as CodexBot", first file 13:51 that day). The long service leave card
stays as it is, since the project may have started a few days before the leave; the notes say so if asked.
The degree and "learnt on the job" are off the slide (10 November): they didn't help answer the question.

## Why this problem (slides 7–8)

Added 10 November. Ben's point: the deck went straight into Minecraft without saying why an AI playing a game is
worth an hour, or why now. The answer goes through Pokémon, which the room has already seen in the news. The
slides were one block until Ben reordered the start; then three of them were the motivation (8–10) and the fourth was
the harness parallel (15). Since 15 November the harness parallel is one click on the headlines, and part 2 is all of it.

- **The example clip (optional since 14 November).** Until the trim it was its own slide: a full-screen silent loop of
  an AI playing Pokémon on a stream, so the room had seen what it looks like before the headlines started (Ben asked
  for it on 10 November). Now it is a pop clip on "Minecraft is a harder problem": its thumbnail sits at the end of
  the Pokémon card's heading, Space plays it (18 s, silent) and it shrinks back in, and → passes it without playing,
  which is the default when time is short. The two "why a game" lines that were said over it are said on the
  headlines slide now: a game is where you can watch a model keep going for hours, and Pokémon got picked because
  everyone knows it, so a win needs no explaining.
- **Slide 8, the headlines.** Since 14 November all six cards are up when the slide opens, with no clicks: one beat,
  "it took from February 2025 to June 2026, and the early wins had a lot of help" (Gemini's first finish took 813
  hours). The card-by-card story is in the notes as "If asked". Until then they came in one a click, in date order.
  "Can Claude beat Pokémon?", where the name takes turns: Claude, Gemini, ChatGPT, one
  sliding up to replace the last every 2.4 seconds, the way the ChatKcal site's heading does it (Ben asked for that
  on 10 November in place of "the new model"). The order is the order the headlines come in. It's CSS only
  (`.rotator` in `deck.css`), starts on Claude each time the slide comes up, and holds on Claude with reduced
  motion and in print. Each name has its mark in front of it and wears the colour the ChatKcal site gives it on
  dark (Ben, 10 November: "add the icons and then we can use it to make the text the same width so it doesn't
  resize the text"). The window is one fixed width, the mark plus seven letters, with each name centred in it, so
  "beat Pokémon?" never moves. The marks are inline SVG copied from the ChatKcal site's sources: Claude and Gemini
  from Simple Icons (CC0), OpenAI from Lobe Icons (MIT). They are trademarks, used only to say which assistant is
  meant, and the credits slide has a line for them. Six screenshots come in one click at a time, one per milestone,
  February 2025 to June 2026, each the most official source there is for that step (Ben, 11 November: "first party /
  more official is best"): Anthropic's "Claude's extended thinking" post (24 Feb 2025, its "Claude plays Pokémon"
  section, the three-badges line in yellow); Sundar Pichai's post on X the day Gemini finished Blue (2 May 2025);
  Clad3815's post on X that GPT-5 finished Red, 6,470 steps against 18,184
  for o3 (14 Aug 2025, x.com/Clad3815/status/1955980772575268897; the post it quotes, Victory Road, is cropped out).
  He ran the stream; OpenAI only posted the start (OpenAI Developers, 7 Aug) and Greg Brockman shared the Victory
  Road post, so the finish comes from the developer, the closest source there is. Ben, 11 November: the card has to
  be a completion or milestone, not the stream starting, which is what the OpenAI Developers post (on the slide for
  a few hours on 11 November) was about; Joel Zhang's write-up "Gemini 3 Pro vs 2.5 Pro in Pokemon Crystal" (12 Dec 2025,
  blog.jcz.dev), with "Gemini 3 Pro became the Johto Champion without losing a single battle" in yellow: the harder
  sequel, finished at turn 24,178. Ben asked on 11 November why there was nothing between August and May; this is the
  best-sourced milestone in that gap. Google AI Studio posted it on 15 December 2025, but the post is only a link to an
  X article, so the card is Joel's page. Other things in the gap, not on the slide: GPT-5 finished Crystal on 25 August
  2025 (Clad3815 on X, 9,517 steps against 27,040 for o3); Opus 4.6 reached Victory Road in early 2026 (LessWrong);
  a Gemini 3.1 Pro run on Blue with most of the harness taken away (only second-hand, via LessWrong and Reddit).
  LessWrong for Opus 4.7 (16 May 2026; Anthropic didn't
  announce it, and the Opus 4.7 launch post doesn't mention Pokémon); and Anthropic's launch post for Claude Fable 5
  (9 Jun 2026). Until 11 November the first, second and fourth were Engadget (9 Apr), TechCrunch (3 May) and
  TechRadar (15 Aug), and Google's Gemini 2.5 report (7 Jul 2025) had a card of its own. Ben
  dropped it on 11 November: it and Pichai's post are the same milestone, two dates for one win. The report is in the
  notes now (a section of its own, 813 hours). Ben asked for screenshots of the actual headlines on 10 November, in
  place of the retyped cards, and then for a timeline between the two rows. So a date line runs across the middle and
  the cards alternate above and below it, each tied to its date: 24 Feb, 2 May, 14 Aug, 12 Dec, then 16 May and 9 Jun.
  Ben then asked for the dates to sit where they really fall, so the line is to scale: 2.6 px a day from 1 January
  2025 (at 40 px), a tick at the start of each month from February, and a "2025" and a "2026" label. Four dates bunch up on the left, the nine
  quiet months are an empty stretch of line, and the last two sit together at the right end. Each card sits over or
  under its own date.
- **The stickers (15 November).** Part 4's help slide merged into the headlines, Ben: "agree, let's merge it". The
  headlines get one click: a sticker on each run's card with the count from the old slide, 4, 5, 3 and 4 extras on
  Claude 3.7 Sonnet, Gemini 2.5 Pro, GPT-5 and Opus 4.7 (the LessWrong card), and a green "0 extras · screenshots
  only" on Fable 5. Gemini 3 Pro's Crystal card has none: the old slide didn't compare its harness. A line under the
  2025 cards says what they mean: "The earlier wins gave the model extra help on top of screenshots and memory,
  and Fable 5 won without any." (copy pass, 17 November) The chips, the sources and the rest of the old notes are in the headlines' notes as "If asked".
  CSS prefix `extras`; the old slide's `.runs` and `.helps` rules are still in `deck.css`.
- **Slide 15, the help (gone since 15 November, above).** "Early Pokémon wins needed a lot of help". Five runs in date order with what each one
  managed, "3 of 8 badges" through to "Beat FireRed". Each model name has its maker's mark beside it in the maker's
  colour (the same three marks as the rotating name on slide 8), with the version in white on the line under it.
  Two clicks. The first adds what each harness gave the model on top of the screenshot, as chips under a count:
  4, 5, 3 and 4 extras (Claude 3.7's "Game memory" chip is "Game data" now, so it can't be read as notes). Memory is left off every list and the key says "beyond screenshots and memory" (Ben, 11
  November: Fable's harness must still have had some memory or notes; Anthropic only says it saw raw screenshots,
  with no maps, navigation aids or game state, and the system card doesn't mention Pokémon). Before that the lists
  had a "Notes" chip and the counts were 5, 5, 4 and 5 (since 11 November, after the sources were checked: critics added to Claude 3.7 and Gemini,
  "Labels" and "Saved screenshots" to Opus 4.7, Gemini's pathfinder and puzzle solver as one "Helper agents" chip so
  the column fits). Under each list, a link to the closest thing to the source for that harness, code where
  there is any (Ben, 11 November): David Hershey's ClaudePlaysPokemonStarter on GitHub (March 2025, "a minimal
  implementation", not the stream's own code: a button tool, game memory, an optional on-screen navigator, summaries
  every 60 messages); Joel Zhang's write-up; the PokeAgent paper (no public code for the GPT Red run; Clad3815's FireRed
  repo is a later harness for another game); the stream runner's "ClaudePlaysPokemon Harness Changes" changelog
  (unsigned and undated, linked from the LessWrong post; for 4.7 it adds the crop and image-recall tools and drops the
  button limits and the last of the hints); Anthropic's Fable 5 post. The count isn't the point: the early lists did some of the
  playing (reading the game, finding paths, a critic); Opus 4.7's newer tools help it see. The second brings in the last column on its own, "0 extras" and a green "Screenshots only"
  chip that lands the way the Harder badges do on slide 9. Ben's point: the early wins turned into an argument
  about the harness and the tools, and the later ones say something about the model.
- **Slide 9, why Minecraft is harder.** Since 14 November its first step is the optional example clip (above), so
  skipping it costs one →. Pokémon and Minecraft side by side. Two rows they share are up from the
  start: both are famous (Ben, 10 November: "they're both very well known or maybe globally recognised, that's
  important too"; it is why a run makes the news with people who don't follow AI) and both are long. Then a
  click each: the clock (Pokémon waits while the model thinks, Minecraft doesn't) and the world (2D against 3D), then a
  third (Ben, 11 November, "an important point"): single player against multiplayer. Pokémon is one game on one
  machine; Minecraft is a server that runs the world, and you join it as a client (even single player starts a
  server inside the game). For the bot that means the server decides what happened, the world keeps going, and
  other players can change it. The 3D
  row is where Ben says his pun out loud: Minecraft brings an extra dimension, literally. It's in the notes, not
  on the slide, so the room hears it from him first.
  Each row has a badge over the gap between the two cards, which Ben asked for on 10 November ("little badges
  between the rows showing the ones that are the same vs harder", then "likewise" for the word): green "=
  Likewise" on the two shared rows, amber "→ Harder" pointing at Minecraft on the other three. A Harder badge lands
  just after its row fades in. Amber, not the red used for a layer with a gap on slide 17: red there means
  something was broken, and this only means harder.
- **Why now** is spoken on slide 9: the models only got through Pokémon in the last 18 months, and Minecraft is where
  it has gone next (this run in September 2026, DeepMind's Argon paper a month later).

Slide 15 came straight after the question on slide 14 until 15 November (model or tools is the same argument as
model or harness; the card's notes still say so, pointing back at the stickers), and slide 9 sets up the timing on the Minecraft slide (17), so both of those can go quicker than they did.

Checked against the pages on 10 November 2026:

| On a slide or in the notes | Where it comes from |
|---|---|
| "Claude isn't a great Pokémon player, and that's okay", 9 April 2025. Started as David Hershey's side project around Claude 3.5 Sonnet in June 2024, when leaving the first house was a big deal. The harness read the game's memory and drew an overlay. | Engadget |
| Claude 3.7 Sonnet beat three gym leaders; Claude 3.0 Sonnet couldn't leave the house. In the launch material. | Anthropic, 24 February 2025: the 3.7 Sonnet launch post and "Claude's extended thinking" |
| The Claude 4 launch post shows Opus 4's own Pokémon notes. | Anthropic, 22 May 2025 |
| Sundar Pichai on X, 2 May 2025 (US Pacific): "What a finish! Gemini 2.5 Pro just completed Pokémon Blue! Special thanks to @TheCodeOfJoel for creating and running the livestream, and to everyone who cheered Gem on along the way." On slide 8. | x.com/sundarpichai/status/1918455766542930004, through X's embed page |
| "Google's Gemini has beaten Pokémon Blue (with a little help)", 3 May 2025. Off the slide since 11 November. Gemini 2.5 Pro; the stream was run by Joel Z, who doesn't work for Google; screenshots with extra information drawn on, helper agents, and fixes by the developer during the run. Sundar Pichai posted about the win and joked about "API, Artificial Pokémon Intelligence". The developer: "Please don't consider this a benchmark". | TechCrunch |
| OpenAI Developers (@OpenAIDevs) on X, 27 May 2025: "Watch o3 play Pokémon—live. See how it plans its next move, explains its reasoning, analyzes the map visually, and saves to memory. Thank you community member @Clad3815 for putting this stream together!" And on 7 August 2025, the day GPT-5 launched: "GPT-5 is now playing Pokémon. Watch the Twitch stream below — and open the companion site to see its agent data in real time: prompts, reasoning, tools, self-critique, and more." | The posts themselves (x.com/OpenAIDevs/status/1927423373157511414 and /1953551715543744547), read through X's embed page on 11 November (the 7 August post is on slide 8). It quotes Clad3815: "We're live! GPT-5 vs. Pokémon Red". On OpenAI's developer forum the same announcement adds "(This stream wasn't put together by OpenAI.)". |
| Greg Brockman, OpenAI's president, on X, 14 August 2025: "gpt-5 plays Pokémon — 3x faster progress than o3:", sharing a post that GPT-5 had reached Victory Road. | x.com/gdb/status/1956026116944355624, read through X's embed page on 11 November. |
| Sundar Pichai on stage at Google I/O, 20 May 2025: "A couple of weeks ago, Gemini completed Pokemon Blue", then "one step closer to achieving API, artificial Pokemon intelligence". | A third-party transcript of the keynote (Singju Post). Google's own write-up of the keynote leaves it out, so check the video before quoting it word for word. |
| Google's Gemini 2.5 report has a section called "Gemini Plays Pokémon" (4.1, with more in appendix 8.2). The stream was set up on 28 March 2025 by Joel Zhang, "an independent developer not affiliated with Google". The first run finished on 2 May 2025 after 813 hours; a second run with the harness fixed took 406.5 hours. The harness turned the screen into text using the game's memory, because the model "struggled to utilize the raw pixels". With the screenshots taken away altogether it did about as well. | arXiv 2507.06261v1, 7 July 2025, by "Gemini Team, Google". Google hosts the same PDF at storage.googleapis.com/deepmind-media/gemini/gemini_v2_5_report.pdf, with the Google DeepMind logo on the first page. |
| "GPT-5 just completed Pokémon Red in a new world-record time – Claude, Gemini, and ChatGPT o3 aren't even close". 6,470 steps against 18,184 for o3. | TechRadar, 15 August 2025 (John-Anthony Disotto). The step counts are from arXiv 2603.15563, which cites it. |
| "Why the World's Best AI Systems Are Still So Bad at Pokémon", 13 January 2026. Not on the slide since the Google report took its place; it can come back. | TIME |
| "A Year Late, Claude Finally Beats Pokémon", 16 May 2026. Claude Opus 4.7 beat Red on Anthropic's own stream, with notes, walkable tiles marked and a new zoom tool; the critic and hints from earlier versions had been taken out. | LessWrong (Julian Bradshaw) |
| "Fable 5 beat FireRed with a minimal, vision-only harness." Raw screenshots, no maps, navigation aids or extra game state. | Anthropic's Claude Fable 5 launch post, 9 June 2026. It gives no hours, steps or code. |
| What the Claude, GPT and Gemini harnesses gave the model (as of mid-2025; see "Pokémon harnesses, checked 10 November" for the fuller picture). The emulator is frozen between actions, so thinking time costs nothing, and runs of hundreds of hours are common. | arXiv 2603.15563, "The PokeAgent Challenge", table 2 and appendix F |
| Hours: Gemini's two runs 813 and 406.5 (Google's own report, above). A person about 26, Fable 5 about 50 (an outside guess). | The 26 is HowLongToBeat's main-story time for Red and Blue, as quoted by CBR and Game Rant (one write-up says just under 25), and is on slide 16 as "~26 h". Fable 5's 50 is from a roundup at creategame.ai, second-hand: notes only, and say "about". |

- Say "minimal, vision-only harness" or "screenshots only". Never "no harness".
- Ben's line was that most of the big labs put Pokémon in their model releases. What's checked: Anthropic did, three
  times (3.7 Sonnet, Claude 4, Fable 5). Google did too, as Ben remembered: its CEO said it on stage at I/O 2025, and
  the Gemini 2.5 report gives it a section. It isn't in Google's launch blog posts (the Gemini 2.5, 3
  and 4 posts and the I/O 2025 posts were checked) or in its model cards (2.5 Pro, 2.5 Deep Think, 2.5 Flash and 3 Pro
  were read in full). The Gemini and GPT streams are run by outside developers, and Google's report says so. OpenAI
  did mention it, on X rather than in launch material (checked 10 November, correcting an earlier "nothing
  official turned up"): its developer account posted both streams, and its president posted about the GPT-5 run.
  No sign of Pokémon in an OpenAI launch post or system card, but openai.com would not load here, so that part
  rests on search results and not on reading the pages. So the slide asks whether the model can beat Pokémon, by name, and never says "the launch". "ChatGPT" in the
  heading is the name the room knows; the run in the August card is GPT-5, so say that out loud.
- The cards on slide 8 are screenshots of the pages as they looked on 10 and 11 November 2026, cropped to the
  masthead, the headline and the byline. The two X posts are taken from X's own embed page (platform.twitter.com),
  cropped to the author, the words and the date, with the attached stream video and the like and reply row hidden,
  and the clock set to US Pacific so the dates match the ones on the line. `tools/capture-headlines.mjs` takes them again (it needs the network; the deck itself still
  fetches nothing from other sites, the images are in `site/media/headlines/`). Ad slots, share buttons, straplines and
  lead photos are hidden or cropped out. Nothing is retyped or moved. The three yellow highlights are ours: one in each
  of Anthropic's posts and one in Joel's.
- (Off the slide since 11 November.) The Google card was three crops of the report's PDF, not of the arXiv page, which Ben found too plain (10 November):
  the Google DeepMind logo from the first page; the headings "4. Example use cases of Gemini 2.5 Pro" and "4.1.
  Gemini Plays Pokémon"; and three lines from that section with the sentence about finishing the game after 813
  hours in yellow. Ben asked for the text because a highlighted heading with nothing under it read as missing
  context. The card is 600 px wide, half as wide again as the others, so those lines can be read. The report's
  title is no longer on the card; say it. `tools/capture-report.py` takes the crops from a downloaded copy of
  the PDF (the usage line is at the top; it needs PyMuPDF, which `uv` fetches).
- No Pokémon artwork and no photos from the articles on the cards (they aren't ours to use). The mastheads are only
  there as part of the screenshots.
- Two exceptions, both Ben's call. The first is the Pikachu icon on slide 9, which he asked for on 10 November
  ("an icon of pikachu vs a minecraft icon"): the Pokémon card is headed by a 16 x 16 Pikachu face and the
  Minecraft card by a grass block. The Pikachu is `site/art/pikachu.png`, drawn a pixel at a time by
  `tools/draw-pikachu.py` to sit next to the pack's icons. It is not a sprite taken from the games, but Pikachu is
  still Nintendo, Creatures and Game Freak's character, so the credits slide says whose it is, and whether it goes
  in the published copy is Ben's decision, like the clip. The grass block is the pack's own (see Icons under Look).
- The second is the example clip, a pop on "Minecraft is a harder problem" since 14 November: a few seconds of someone else's stream of a
  Nintendo game. Name the stream out loud and in the notes. It's a different thing to publish than to show in a room,
  so `pokemon-example.mp4` stays out of anything pushed until Ben says otherwise; without the file the slide shows a
  placeholder. The file is there since 10 November (see "Clips"), and the credits slide names the stream.

## Thesis

**Shrink the AI's job.** Anything that can be programmed and tested gets taken away from the model, until
only the decisions that need judgement are left.

The question the talk asks (slide 14): *how do you approach it?* Ben's framing, said rather than shown: is
the hard part the decisions the model makes, or carrying those decisions out in the game? The answer is carrying them out. The model and the harness were fine; the gaps were
further down (see "The layers"). The takeaways slide comes back to it: "The model's decisions were already good enough, and most of my work went into carrying them out."

The old question, "did the model beat Minecraft, or did 58,000 lines of code?", is off the slides (10 November).
The 58,294 figure still appears on "The MCP part is tiny", an appendix slide since 12 November.

Three messages:

1. **Shrink the AI's job.** Break it into bite-sized problems you can program and test.
2. **Iterate until it's reliable.** Break, reproduce, fix, keep the scenario.
3. **Integrate.** The best ideas were already out there; the work was making them one toolkit.

Since 16 November "The idea" (slide 17) opens on Ben's dial-back (16 November: "I dialled back and removed any
harness, direct API calls or harness engineering… and focused only on building an MCP server"): the six layers
again, small, with "Vercel AI SDK" (the six layers' Harness label) large under Model and Harness. Its first
click (k-idb-drop, 17 November; the cross-out was briefly the last click of "Playing Minecraft") strikes it
through in red and brings in "Claude Code, on a subscription" under it, also large: the failures were in the tools,
actions and client, so Ben stopped building the model and harness and paid for them. The next click splits them into "What I paid for" (Model, Harness: "Claude Code, on a
subscription"), "What I built" (Tools, Actions, Client: "an MCP server") and "What I didn't touch" (Game). The
first version had its own loop calling the model's API every 8 seconds (see "Verified facts"). The cost is said as
"a subscription instead of paying per API call", with no figure; the $93 on the run slide is API prices, and Ben's
word "subsidised" stays off the slides and out of the notes. The last notes line hands over to part 5, testing: "So
all my effort went into one piece. How do I know it works? I test it." Part 4 finishes at 14 (data-by on its four
slides). For time, slide 16's spoken notes for the packets and Mineflayer were cut to a line a click (16 November),
with what came out kept as "If asked" lines; no clicks were removed.

The idea shows the three messages as three cards, one a click, each with an icon from the pack in an inventory slot: shears
("Break the game"), a repeater ("Keep working") and a map ("Borrow"). Since Ben's copy pass (17 November) each card
is one sentence with its first words in the old head's style: "Break the game into small problems you can program
and test", "Keep working on each one until it's reliable", "Borrow the best ideas that already exist". The takeaways slide (34) has the same three
icons, so the end of the talk looks like the idea it started from; since Ben's copy pass each icon sits beside one
sentence with its first words bold: "If you can program and test something, do that instead of asking the AI.",
"Turn each failure into a test, fix it, and keep the test.", "Borrow from what's already out there, like Mineflayer
and Baritone."

Say "programmable and repeatably testable", not "deterministic".

## Playing Pokémon, playing Minecraft (slides 16–17)

Ben, 11 November: answer "why can't the model just play Minecraft like Pokémon?" before the layers, one game per
slide. Each slide shows a person's row, then an AI's row a click later, on the same six columns. The person's box
(a small pixel person) spans the model, harness and tools columns it stands in for.

- **Playing Pokémon (16):** a person (watches the screen, presses buttons), buttons (A, B, D-pad, Start), the game
  on a Game Boy. Then an AI: model, harness, tools (screenshots, game data), inputs (the same signals the buttons
  send), the game in an emulator. A click later, the time goes on the link (Ben, 12 November: "no timing on how long
  it takes ai to make decisions / turns on pokemon?", then "animating in arrows/times between boxes"): an amber
  bracket from Model to Inputs, "~28 s a turn" (Gemini 2.5 Pro's first run), and the game box gains "✓ Waits for
  every turn" on the same click. Amber because it's slow but fine, against slide 17's red. The person's row has no
  time: nobody has published how often people press buttons in Pokémon, and reaction time would compare a different
  thing, so the notes say so. The time to finish (a person about 26 h, Gemini 813 h, about 30 times) is in the
  notes only, since 12 November. The person's row carries an invisible empty link row so the AI rows sit at the
  same height on 16 and 17.
- **Playing Minecraft (17):** a person (decides in about a quarter of a second), keys and mouse (a steady stream of
  input), the Java client, the Java server at 20 ticks a second. Then the same AI setup. After the timings, a line on
  its own click from the cut timing slide: "A creeper blows up 1.5 seconds after it gets to you." A last click: 'Fast "System 1"
  models like Jev are quick enough, but they aren't smart enough yet.' Then the build below answers what goes
  between the model and the game, on this slide.
- **The build (17, Ben 12 November):** "take people from somewhere familiar (how a person plays a game) to somewhere
  unfamiliar (Mineflayer and MCP)". Since 13 November (Ben's call) the build and what was
  "From the model to the game" are one slide: the build ends on the six layers, heading included, and carries on
  with their verdicts and the two bug clips, so there's no dead click between two identical pictures. Since Ben's second note ("he can't see the boxes move"),
  it's one continuous picture: the same boxes travel from step to step, with no cross-fades between copies, and ←
  runs each move backwards. Then "don't feel physical": boxes arrive on a spring with a small overshoot (a few px),
  a chain moves 50 ms apart from the incoming box rightwards, a moving box lifts 6 px with a shadow, and the pushed
  client gets a small shove before it goes. Eleven more clicks after System 1 (2 and 3 below have been one click since 16 November):
  1. Strip it down: the AI row's Java client and Java server rise out of the row and grow, the client to the far
     left and the server to the far right, while everything else fades and sinks. The four columns between them are
     the wire, in two lanes (Ben, 12 November: "the packets must travel between the two boxes").
  2. A "W" keycap chip on the client: "you press W".
  3. Physics on the client: a panel, "physics applied", x 12.40 → 12.50 (the new number highlighted), y 64.0,
     z -37.25. The client works out the move itself.
  4. The packet (Ben, 12 November: the server isn't told "W is held"; the client runs the physics and sends the
     result): the Set Player Position card launches from the client, small, and grows as it travels the upper lane
     to the server, the lane's rail drawing behind it; "Minecraft's own binary protocol, over TCP" under the wire.
     "The server never sees the key press, only where you ended up." 0x1C, x 12.5, feet y 64.0, z -37.25 (doubles), flags 0x01
     on ground (a byte), its 27 bytes underneath. As it lands the server's check chip comes up, "? Possible?
     collisions, speed" (the check was its own click; merged, since it's the arrival). Ben had said "protobuf
     messages"; it isn't protobuf, so the slide never says protobuf or gRPC; the notes give Ben "think protobuf
     without tags". The values are made up; the bytes are what they encode to, before compression and encryption
     (said in the notes).
  5. The correction: the check turns to a red ✗, and a beat later the Synchronize Player Position card travels the
     lower, red lane back to the client: "No you're not: back here." 0x42, teleport id 7 (VarInt), flags 0 absolute
     (int), x, y, z 12.4, 64.0, -37.25 (doubles), and "client replies: Confirm Teleportation 0x00, id 7". As it
     lands, the client's x snaps back from 12.50 to 12.40, in red. The notes point ahead to the staircase clip later on the slide.
  6. The swap: the Java client flickers off and dims, its "Draws the world" line goes, and Mineflayer drops into its
     place and shoves it down and out: "Does the same job (physics, packets), but programmable. Built for bots.",
     "Andrew Kelley, 2013. Now PrismarineJS". The cards and the check sink away. The card stops there with no physics
     panel or code yet: Ben pauses on it for an on-the-spot question about Andrew Kelley (17 November; it had shared
     a click with 7 since 16 November).
  7. Mineflayer's side of the same beat (Ben, 13 November: "show real Mineflayer code"): a code card in the empty
     lower lane, "// hold W, in code" over `bot.setControlState('forward', true)`, and half a second later the same
     "physics applied" panel inside Mineflayer, x 12.40 → 12.50.
  8. The same Set Player Position card (the same element: same fields, same bytes) flies the same upper lane again,
     its caption swapped for "Mineflayer sends exactly the same packet.", and its edge turns green as it lands. No Player Input
     card: Mineflayer doesn't send one for walking (see "Verified facts"), so the notes say so instead.
  9. Actions slides in from the left and the client and server close up beside it (the wire and everything on it
     sinks away).
     10. Tools, 11. Harness, the same way. 12. Model: the six layers are complete; the heading becomes "From the model
     to the game", the boxes take their stack labels (Model / Claude · ChatGPT and Harness / Vercel AI SDK since
     17 November, Ben: the first version's own stack, "Vercel AI SDK" standing for the home-made harness; Client /
     Physics, talking to the server / Mineflayer; Game / What really happens / Minecraft), and the layer numbers and
     the two clip thumbnails appear. Under the stack a one-line marker fades in (Ben, 16 November: "I had an early
     version of the overall flow"): "I built the first version on 27 Jun, 11 weeks before the win". It says "built",
     not "ran end to end", because built is what the commits show (see "Verified facts"); for part of 17 November it
     had a second sentence on GPT and the Vercel AI SDK, which the boxes now say. It stays through the verdicts and
     the clips and gives its row to the trace on the rule's click.
  Then the six layers' own clicks (see "The layers" and "Clips"). No green since 17 November (Ben: focus on the
  failures; Model and Harness aren't "solved", they're not the bit to focus on), so no "✓ Solved" click: 13. ✗ Missing
  on Tools (and Game's "Left alone"). 14. Space plays bug-drown out of Actions, which turns red, "✗ Unreliable", as it
  lands. 15. bug-stair out of Client, "✗ Had bugs". 16. "A smarter model wouldn't have got up this step." with the "I had
  to get this end working first" trace. 20 clicks on the slide in all. The harness cross-out was a last click here for
  part of 17 November; at Ben's request it opens "The idea" instead, after the staircase bug. The staircase bug's cause
  and fix (its own click here from 16 November) are the next slide since 17 November.
- **Why it couldn't get up the step** (17 November): the slide after "Playing Minecraft", three clicks, told as a jump in
  slide 15's packet picture, with a side-on drawing (shown at 1.6x) of the clip's own course, the upper flight of
  "westbound_switchback_regression" climbed toward negative X, in the Mineflayer box. Its one point, in Ben's words: "A
  collision is defined by something solid being in front of you, which doesn't apply if you're inside it. And this
  floating point comparison error was a bug that put our bot inside the wall, inside the staircase, and the server
  correctly said, no, that is not a valid position to be in, and sends you back. And then it turns into an infinite
  loop." So a key line stays under the title for the whole slide, one line at 34px: "A collision is something solid in
  front of you. It doesn't apply once you're inside it." The comparison's question answers it: "step in front of the
  bot?" (it was "clear of the step?", then "step in the way?"). One caption at a time under the lanes, at 28px:
  - Opening: the working jump first, on a loop Ben can talk over (Ben: "show what the good case is before we go and talk
    about the bug", then "it happens as soon as I go onto the slide, and then I can't replay it"). While the slide is at
    step 0, however it was reached, the box starts at the foot of the step touching the face ("block face, x = 4", "<-
    west (-x)"), goes up the face until its feet clear the top, over onto the step along the faint dashed L into the
    faint box, rests a second, fades back to the foot and goes again (CSS only; 4.6 s a round). Print and thumbnails
    show it on the step. "The step is in front of the bot, so it holds the bot back until it's high enough to go over."
  - Click 1 (k-stb-check): on a single → the box blinks back to the foot; for half a second its edge sits a hair past the
    face (drawn larger, a red sliver under the "overlap drawn larger" label, with the sum that made the number: "bot's edge = 4 + 0.3005 - 0.3005 = 3.9999999999999996", tagged "face" and
    "half-width", the field note's two steps, through click 2); then
    it rises partway and cuts forward into the block (the red corner-cut; 0.75 of a block up, tick 154, feet below the
    top). Then `3.9999999999999996 >= 4`, "step in front of the bot?" false; Mineflayer's "✓ Possible?", and Set Player
    Position goes; the server's chip asks "?". "A floating point error put the bot's edge a hair inside the step.
    Nothing was in front of it any more, so Mineflayer moved it forward too early."
  - Click 2 (k-stb-loop): the server's chip ✗ (✓ on the left, ✗ on the right), Synchronize Player Position, "No you're
    not: back here.", comes back and the box drops to the foot of the step; "repeats every tick"; on a single → the loop
    goes round three times. "The server said that isn't a valid position and sent it back. That repeated every tick."
  - Click 3 (k-stb-fix): `3.9999999999999996 >= 4 - 1e-7`, "step in front of the bot?" true; the box rises along the
    face until its feet clear the top, then goes over onto the step; both chips ✓; the wire dims. "Fix: a tolerance of a
    ten-millionth of a block (our physics fork, 24 Jul), so touching still counts as in front."
  The notes carry Ben's spoken line for each beat ("So why couldn't he get up that step?" … "A smarter model wouldn't
  have fixed that.") and the "If asked" lines: the code, why only sideways, the getPlayerBB / setPositionToBB round trip,
  and the number. ←, jumps and the speaker window land on resting states; print shows the fixed state. Checked against
  prismarine-physics commit d627c18 (24 Jul, "Tolerate floating-point drift at AABB contacts": `blockBB.computeOffsetX(
  playerBB, dx)` clamps a negative move only when `other.minX >= this.maxX`, the player wholly outside; that and the Y
  and Z tests become `>= this.maxX - COLLISION_EPSILON`, 1e-7) and the field note (`mine_ai` docs/field-notes/
  mineflayer-pathfinder-westbound-switchback.md, ticks 152-155). The exact 3.9999999999999996 is from the trace that
  found the bug (23 Jul), a probe on that course with the half-width set to 0.3005 (4 + 0.3005 = 4.3004999999999995,
  minus 0.3005); at the stock 0.3 that sum is exactly 4, so the frame is never labelled as the clip's moment or the
  stock width.
  How: the boxes seen as the AI row's Java client and server are faces laid over the stack's Client and Game boxes
  and parked over the row (the row's own two boxes are invisible stand-ins), so they're the same elements all the
  way; one CSS variable sets how many columns left of their place in the six layers the boxes sit (during the client-server link, the client and server have their own, to open the wire between them). All CSS transitions,
  plus one small block in deck.js (approved by the coordinator): arriving on the slide or jumping more than a step
  (from the next slide with ←, the hash, Shift+arrows, the speaker window catching up) turns the transitions off for two
  frames, so it shows that state at once. The thumbnails in Actions and Client are the pop clips' own
  (`.pop-thumb`, built by deck.js in the stack boxes the figures' data-box names); the build keeps them hidden with
  the rest of those boxes' contents until the last build click. The parked
  position (298 px below the stack) is the AI row's measured top; if the rows' layout changes, re-measure it. Print
  shows the end of the slide: the six layers with their verdicts and the rule. The Model click's notes say what the
  first version was; the verdict notes carry Ben's beat (the whole flow early, whole-agent runs failing, the model out
  of the tests by 19 July: "the problems were all in a particular area"), with an "if asked" line for the July numbers;
  "The idea" then says what he did about it, and Mine Labs, which tells that history itself, follows in part 5.
- **The creeper (17, Ben 14 November: "show what that actually looks like"):** on the fuse click a pixel creeper
  (drawn from Pixel Perfection's `creeper.png`, already credited) walks in right of the fuse line, stops, flashes white
  and swells for exactly 1.5 s, and goes off: a pixel burst, smoke, a small crater. Under it a thin bar, "model's turn,
  ~3 s", starts as the creeper stops and has a red tick at 1.5 s: it crosses the tick at the bang and is still running
  ("too late" when it ends). Plays once per arrival by →; ← and → again replays it; any other arrival (hash, Shift,
  from later) shows the end. It goes on the System 1 click, whose line runs under it. No sound.
- **The timings (17), each on its own click, on the link it belongs to (Ben, 12 November):** after the person's row,
  a green bracket from Person to Keys, mouse: "~0.1 s to adjust a move" (online hand corrections, about 100 to
  125 ms: Pruszynski et al. 2010 and reviews). After the AI row, a red bracket from Model to Inputs: "~3 s a turn"
  (17.8 min of API time over 389 turns), and on the same click Inputs turns red with "✗ Can't keep up", so the gap
  reads as the result of the 3 s. The brackets aren't to scale. Ben's point (11 November): reaction time is the
  slow part for a person, and the controls themselves move faster than that.
- **The numbers:** the reaction time is Woods et al. 2015 (about 230 ms in the lab), and it's the deciding part:
  see, decide, start moving. Hands steer and click on a finer loop than that, so the slide says "decides" for the
  person and "a steady stream" for the input, with no actions-per-minute figure, since none is well sourced.

## The layers

Ben's framing (10 November): before building anything, work out which part needs solving. Once its build is done, slide 17
lays out everything between the model and the game, left to right, and marks what was fine and what wasn't.

| # | Layer | What it does | What it is here | Status on the slide |
|---|---|---|---|---|
| 1 | Model | Decides what to do next | Claude | Off the shelf |
| 2 | Harness | Turns, memory, compaction, sessions | Claude Code, run headless | Off the shelf |
| 3 | Tools | The bridge out of the harness | The MCP server | Gap: didn't exist |
| 4 | Actions | Walk here, chop a tree, craft, cook, fight | Our code | Gap: unreliable |
| 5 | Client | The bot's body: physics, talking to the server | Mineflayer and Prismarine (forked) | Gap: had bugs |
| 6 | Game | What really happens | The Minecraft server, 20 ticks a second | Left alone |

- **Ben's bet:** layers 1 and 2 are solved, or will be soon, so use a coding agent that already exists and don't
  build one. It already does sessions, compaction and memory.
- **What he saw:** nearly everything that slowed runs down, or made the model's choices look odd, was in layers 4
  and 5: bugs in the library, and basic actions like "walk here" not finishing. Layer 3 wasn't there at all.
- **The rule:** get each layer right starting from the game end, then diagnose the one before it. Don't blame the
  model for a physics bug.
- **Gaps are red, fine is green,** each with a tick or cross and a word, never colour alone. The boxes carry
  that themselves ("✓ Solved", "✗ Missing"), so the slide has no legend lines under it. The only sentence on it
  is "A smarter model wouldn't have got up this step." What the green and the red mean is in the notes, said on the two
  clicks that light them.
- **The timing problem** is the one gap that isn't a box. It had its own slide until 12 November; now it's the red
  ~3 s bracket and the creeper line earlier on the same slide, and this paragraph is said in its last notes, which point
  at part 6: "We died in the middle of a job". One lap through all six layers takes about 3 s; the game moves 20 times a second. So reacting has to happen in a short loop at the game end (layers 4 to 6)
  without the model. It has a second half, covered on "We died of boredom" (part 6): some actions run for
  minutes, longer than a tool call should block, which is what submit, wait and collect are for.
- **Part 6, What did I build?, answers the layers.** The MCP server is the tools layer, its actions and reflexes are the actions layer
  (the short loop is the reflexes: "We died in the middle of a job"), and the client fixes come in
  on "How it got reliable" (29). Until 12 November
  three area openers each lit their layers on a small strip.
- The repo's own five code layers (server, session runtime, action, world, physical; `docs/mcp/concepts.md`) all
  sit inside layers 3 to 5: server and session are the tools layer, action and world are the actions layer,
  physical is the client. Don't put the five on a slide; it's a different cut of the same thing.

## Part 6: What did I build? (the ladder rebuilt on 17 November after the timed run; the "We died…" ladder from 17 November; a ladder of failures from 16 November; part 5 until 16 November)

Ben's timed run on 17 November took 54 minutes against 45, and the ladder 17:21 against 12:30. His words: "they're
very text heavy... It doesn't flow. I start tripping over my words", and the first rung "doesn't motivate collect
block". He read each slide's dated paragraph aloud almost word for word. So each rung now shows only the headline, one
quote from the record, the fix line and the one picture or chart it already had; the dated paragraph moved into the
speaker notes, which open with a three-or-four-sentence script in Ben's voice whose first sentence is the handover from
the rung before. The story: each fix is what lets the bot get far enough to fail the next way. The handovers are logic,
never chronology (the fix dates are 21 Jul, 2 Sep, 4 Aug, 26 Aug, 13 Sep, 12 Sep), so the notes tell Ben not to say "and
then" or "next". The red label top right is the date of the failure; the fix's date is the small grey tag. Ben's standing
rule: one natural sentence on screen, no clipped punchline pairs, no "X, not Y", no slogans. Sources for every line are
in "Verified facts", "Part 6 ladder sources". 22.5 to 34 min, 11 clicks. Since 17 November (Ben: "Yes, appendix")
the Baritone race is the first appendix slide, and an A* explainer follows the navigation rung (Ben: "a nice quick
visualisation on what A* pathfinding looks like and does briefly and then call out the things baritone does really
nicely"). The deck is 37 slides.

- **Part 6: What did I build?** (card, 22.5). Lede "We died at least 312 times during development", small print "bot
  deaths in real play, 29 Jul to 15 Sep, counted from the server logs". The cause split and the count's scope are in
  its notes.
- **The model asks for one whole job at a time** (24, no clicks). Rung 1, the starting point, label "Since 21 Jul" (one
  job at a time is in the first version in git). No death on this slide: it picks up where Part 4 ended. "The first call
  of the winning run": collect_block logs × 16 with the model's rationale, "Wood is the base of all early tools; I have
  an empty inventory and need a crafting table and pickaxe.", and the steps to "16 of 16 in 1 min 17 s". The 1 August
  drowning, the ~3 s and the 60 ticks left this slide (Part 4 has the numbers; the drowning is a callback on rung 2).
- **We died in the middle of a job** (26, 1 click). Rung 2, 28 Aug. "I died during the diamond run and respawned
  empty". "So we added reflexes: the server interrupts the job, deals with the danger, then picks the job back up · 2
  Sep". The chart "The six reflexes in the code today, by how often each fired in the winning run" (293). Click: the
  creeper handoff at 2:31. The fighting-engine box and the 1 August drowning callback are in the notes.
- **We died repeatedly to a spider** (27.5, 2 clicks). Rung 3, 3 Aug. Since the evening of 17 November: the rung is called Reporting (Ben's word in the run-through), not Replies; the four "We died" headlines arrive as "We died…" and a first click brings in the rest (on the other three the slide under the headline waits for that click too); the fix line reads "So now its status says where it died and what it was carrying"; and the last click shows the reply the model got when the creeper killed it in the winning run (run database, request 191) beside its status call two seconds later (request 192), in place of the 2:33 navigate reply and the "Where replies grew to" list described below. On arrival by a single →
  (data-arrive), the seven death lines from the server log come up like Minecraft chat, each with its time, over about six
  seconds: "CodexBuilder was slain by Spider" at 14:49:24, 14:49:42, 14:50:03 and 14:50:14, "… by Zombie" at 14:50:37,
  14:50:53 and 14:51:02. The two the model got a PLAYER_DIED result for (14:49:24 and 14:50:37) carry a green "✓ told".
  The quote "…the builder’s position resets" lands larger, with "the model, 14:50:18", after the fourth death because
  that is when the model said it; then the last three deaths, then the fix line "So we added its status now says where
  it died and what it was carrying · 4 Aug" at about 7 s. Any other arrival and reduced motion show it finished. The
  3 Aug footage exists but is unusable (night, rain, an inventory window, 2 fps), so this is built from the log. Click:
  the death lines give way to the run's reply and "Where replies grew to".
- **We got stuck under the ocean and couldn't get out** (29, 1 click). Rung 4, 5 Aug, Stream 11: CodexWarrior trapped in
  an air pocket under the sea floor for over an hour while the other two bots failed to reach it. "Safe route to shaft
  failed again: noPath/timeout after 58k nodes". Under it, the clip `media/ladder-under-the-ocean.mp4` (loop, silent,
  13 s; open sea, so "ocean") with the caption "On stream on 5 August, one bot couldn’t find a way down and the other
  was stuck under the sea floor." Click: 24 km, 135 of 239, beside the clip. No fix line here: it lands on the
  next slide, after the explainer. The 24 Aug trip home and hang are in the notes. Not a death headline: the trapped bot
  didn't die.
- **How a pathfinder finds the way** (30.5, 4 clicks; slide 26). Navigation, continued. A real A* run (four-way moves,
  Manhattan heuristic in walk ticks) on a 22 × 11 map: A on the left, a stone wall with a raised ridge at its foot, a
  two-wide river, B on the right; Baritone's costs in ticks (walk 4.6, jump up 6.6, drop 9.3, swim 9.1). 121 squares
  tried, then the route: 27 moves (23 walks, a jump up, a drop, two swims), 141 ticks. It plays once, about 13 s, for a
  single → onto the slide (deck.js `astar-play`); any other arrival, reduced motion and print show the finished route.
  Clicks 1–3, one callout each: "Every move is priced in game ticks, so the cheapest route is also the quickest one to
  walk."; "Each kind of move has its own code to plan it and to walk it, so it only plans moves it knows how to make.";
  "A long trip is planned in pieces, and the next piece is searched while the bot walks this one." Click 4: "So we
  rebuilt navigation in TypeScript, following Baritone · 26 Aug" with the credit line (Baritone by leijurv and
  contributors · github.com/cabaletta/baritone · LGPL-3.0). Dropped as unbacked: "it searches many more nodes in the
  time allowed" (no recorded node-rate comparison with mineflayer-pathfinder; ours is about 3× slower than Baritone).
  The race result is one line in its notes.
- **We died of boredom** (32, 1 click). Rung 5, 7 Sep, Eyes run 14: an obsidian job ran over six minutes, the chat
  client dropped the call at five, the model polled six times and cancelled, and the bot was in lava 13 s later. "…the
  collect has stopped progressing, so the time is better spent on the portal." (the cancel's rationale). "So we added an
  now an action runs in the background, and the model can wait a set time, check progress or cancel · 13 Sep" (it read
  "So we added an action runs…" until 17 November). Click: the
  winning run's 16-obsidian call. The 2 Sep deadline removal is in the notes only (Ben: "the point of this is not to
  remove client deadlines"), and so is the 24 Aug ACTION_BUSY lockout.
- **We died because a reflex wouldn't let us leave** (34, 2 clicks). Rung 6, 6 Sep. "The agent had the right plan and
  no way to execute it." "So the model sets the policy with a reason and an expiry · 12 Sep". Click 1: "In the winning
  run, 3:09 in the ocean monument:" with the monument quote and the 3:09 call. Click 2: the 3:11 call. "It changed its
  own policy 9 times" and the dated paragraph moved to the notes. Its last note leads into the run breakdown.

Before the rebuild (17 November, first version) each rung also carried a dated sentence on screen, the first rung was
"We died while the model was still thinking" (the 1 August drowning), navigation was "We died on the way home" (24 Aug)
and waiting was the 2 Sep "timeout-safe batches" smelt with two fix lines. Before that (16 November) each headline was
the failure in its own words: Too slow to hold the controls, No legal move, Gear gone no explanation, A navigate call
never came back, Timeout-safe batches and Automatic evade keeps seizing the body.

Before the ladder (first pass, 16 November): four control slides plus three navigation slides, 26.5 to 39; before
that (14 November) nine slides with a small red failure line over each heading; on 12 November Ben went straight to
"I built an MCP server" and cut the three area openers and "Who does what".

- **Appendix: the MCP part is tiny.** The code-size chart, moved from the MCP part, just before the credits; the
  credits slide also credits Baritone since 16 November.

## Part 5: How did I build it? (added 14 November as part 6; moved up 16 November; cut to 8 minutes the same day)

Why it exists: a colleague of Ben's reviewed the deck and asked "Was there any iteration? When you
iterate how did you decide the next steps? … you use agents to write the code and you were guiding the code, not
that you were writing the code 'old school', right?" Ben agreed the talk should be about the process, and Mine
Labs is its spine: "developing out the mine labs, the test harness was like a big reason behind actually beating
the game."

**The cut (16 November, after a practice run).** The part ran 21 minutes against 8. The reviewer on the scenario
slide: "way too long... you are defining basically what is an integration test that software engineers would
understand quickly"; on the package timeline: remove it, keep the chart, because the chart tells a story. Ben said
the last two slides could be combined. Ben mirrors his laptop with no speaker view and most of the room is on a
video call, so whatever he must say is on the slide; the notes still carry it, plus "If asked".

Now a card and three slides, 14 to 22 minutes (`data-by` 14.5, 17.5, 20.5, 22), data-section "5 · How did I build
it?", card kicker "Part 5 of 7", CSS one block with prefix `bld-`:

- **The card.** "How did I build it?" with the repeater. Lede: "By watching it die a lot" (a tease since 17 November) Its note picks up part 4's "How do I know it works? I test it."
- **An integration test, in a 3D world** (data-title "An integration test in a 3D world"; kicker "Mine Labs · the
  test runner I had AI build"). Merges "Good tests make reliable software" and "A scenario: a world, a bot, a
  goal". Since 17 November it shows an obstacle course, run twice (Ben: "our old code was mineflayer-pathfinder at
  first, can we simply add a course that it would fail at that ours passes at?"; the bucket drop was "reflexive and
  very timing dependent", needing slow motion). It opens on the question, on screen: "A bot has to cross a lava lake
  on stepping stones, without digging or building. Can it reach the gold pad?", beside one frame showing the course
  with "▶ Space to play". Two held pop clips share that frame (`data-box="bld-clip"`, `data-hold`, the first two
  steps): Space grows the stock bot's run over the slide (caption "Stock mineflayer-pathfinder · Catches fire on
  the hops and dies · FAIL in 17 of 17 runs", red) and it holds on its last frame; Space cuts straight to ours (caption "Our
  navigation · 13 of 13 runs pass", green) and it holds; Space shrinks it back into the frame and brings up click 3.
  R replays the one on screen; → passes each without playing. Click 3: the YAML, trimmed to nine lines with "…" for
  what's cut, tagged the world (a lava lake, 6 soul-sand stones, a gold finish), the action (navigate, dig and
  scaffold false), the checks (reach, health 12 "# starts on 12", survive 1 s). Click 4: "No AI needed" (navigate is plain code, so
  the test runs without a model) and "A pass is checked in the game itself" (13 of 13 runs passed).
  The terminal still and the full YAML are gone (unreadable on a call); the "ask the room" note on the slide
  before went with that slide.
- **I turned every failure into a test** (data-title "The loop, and who wrote the code"). Merges "How I picked the next
  fix" and "Coding agents wrote the code". The loop as five boxes: watch a run, write down what broke, make a
  scenario that fails, fix it till it passes, repeat. Click 1, the dolphin in one line: run 12 on 5 Sep: "The bot
  drowned while its air meter said it was fine. Any nearby entity's air was overwriting the bot's, and a dolphin has
  6000."; one-line fix in the
  Mineflayer fork (`c15b3ef7`) 14 minutes later; the scenario is still in the suite. Click 2: the 829 commits
  (347 Claude Code, 482 Codex, 0 hand-written; "most likely" dropped on 17 November on Ben's word that Codex and Claude Code were the only tools he used) and "I steered: plans from my notes; every commit
  reviewed before push". Click 3: "A fix only went in once a scenario had failed without it." The standing rules, the
  human-reviewed core, the 13 September fan-out (5-line note, 761-line plan, 12 agents, merged 22:19) and why
  "most likely" Codex are "If asked" notes.
- **As the harness grew, the runs got further.** Unchanged chart (scenario files per evening, then on a click the
  furthest of the 31 attempts, then the caption "Both went up over the same four weeks. That doesn't prove one caused the other, but I think the
  harness is a big reason it got there."), with one line added under the title: "Earlier: the
  first bot, 27 Jun · the model out of the tests, 19 Jul". It stands on its own (no "as we just saw"), since the
  coordinator may move it after part 6 as the payoff. The dropped package timeline lives in its notes: whole-agent
  runs from 14 Jul (121, one seed), model-free arenas 19 Jul, the Scenario Lab 21 Jul, its own repo 13 Aug (the
  Unix-philosophy line), 497 at the win, 112 merged files and 103 in 81 minutes.
- Deleted: "From a script to its own package" (facts to the chart's notes). The staircase, the loop's five-box
  detail and the agents' fan-out were already notes or are now.
- The start date is settled (coordinator, 14 November): the bot started on 27 June 2026. Still held back until
  Ben answers: the agents are named as "coding agents (Codex and Claude Code)".

## Review round (10 November)

Ben asked for a pass over the whole deck for clarity and "bling", then said to make all of it. What changed, and
the calls that were made along the way (his to overrule). The slide numbers here are the ones of that day:

- **11, Bots have beaten it before.** Two cards like slide 9 instead of a list. Left: a command block, "AltoClef",
  "Code decides" (every step hand-written, no LLM), "✓ Beat the dragon". Right: a book and quill, "An LLM",
  "The model decides", "? Beat the dragon", "That's what I wanted to find out". Under AltoClef's tick is the date
  and the claim, "24 May 2021. The first bot to finish the game with no human input." (see "Verified facts").
  Space then plays AltoClef's own kill as a pop clip (Ben, 11 November): 26 s of TacoTechnica's stream, with the
  stream's sound since 12 November (Ben: "no sound on the altoclef clip?"), which is Taco commentating over the
  game; audience window only, M mutes it, `?silent` plays the silent cut. It
  shrinks into the AltoClef card when it ends; the card's edge turns green. → skips it. Green caption, not the
  red of the bug clips on slide 18. Credited on the slide, in its notes (the link) and on the credits slide (see "Clips").
- **13, One prompt.** The three numbers count up over 0.9 s when the slide opens (388, 3 h 56, $93). The 1 death
  doesn't. The 3 h 33 TODO sits under the tiles now, not inside one.
- **15, the help.** Marks, counts and the extra click, as described under "Why this problem".
- **16, the layers.** The two legend lines are gone (see "The layers").
- **18 and 35.** Icon cards and matching takeaways (see "Thesis").
- **22, The MCP part is tiny.** The MCP server bar is green and the other six are grey, so the eye goes to the
  short one. It was already the only bold label.
- **23, The tools have to tell the truth.** The struck-through line is gone. Two rows with badges: red "✗ Before"
  on "bread: 1 → 1", green "✓ After" on "bread: 1 → 0 confirmed". The After row comes in on the click that brings
  the fix. Still an illustration of the bug, not a copy of a real reply; the notes say so.
- **24, Some actions take minutes.** Under the four steps, one real call from the winning run as a progress bar
  that fills at a second a minute, with the "still running" replies as ticks along it (facts under "Verified
  facts"). With reduced motion, and in print, it is drawn full.
- **30, the override.** A switch badge on each quote: amber "Reflex off" on the first, green "Reflex on" on the
  second, with the knob sliding across as the second quote comes in. No clock times on the badges: only "3 h 09"
  and "two minutes later" are sourced.
- **33, A third of its calls went wrong.** One stacked bar across the top (217 worked, 106 went wrong, 5 cancel
  requests) with a legend, and the six bars under it in the same three colours. Green and amber are the chart
  palette's third and fourth colours, not the UI accent and warning, because that pair failed the validator's
  lightness check. Grey is `--series-mute`. Every colour has a sign and a word beside it.
- **36, Questions.** A QR code for the repo, top right, on a paper card like the headline cards. It is
  `site/art/qr-repo.png`, made by `tools/make-qr.mjs` (one pixel a module, scaled up with hard edges) and read back
  from a screenshot of the slide. The repo's README links to the dataset and the video, so one code covers all three.
- Left as they were: 2, 4, 5, 9, 10, 17, 21, 29, 32 and the chapter cards.

## Pokémon harnesses, checked 10 November

What each run got on top of the screenshot (slide 15 until 15 November, the stickers on the headlines since), so Ben can talk to it. "Harness" is everything between the
model and the emulator. All of these freeze the game between actions, so thinking time costs nothing.

- **Claude 3.7 Sonnet, Feb 2025, 3 badges.** Anthropic's own stream, built by David Hershey. Anthropic said only
  "basic memory, screen pixel input, and function calls to press buttons and navigate around the screen". The
  detail is from Julian Bradshaw's LessWrong comparison (19 April 2025) and the PokeAgent paper: location and party
  read from the game's memory (RAM); the screenshot overlaid with a grid and passable tiles in cyan, walls in red;
  a navigator that walks to any tile **on screen** (not across the map); a knowledge base it writes to; its context
  summarised when it fills up; a system prompt with "substantive advice"; and "Critic Claude", a second instance that
  checks in now and then to stop it getting stuck. The slide has five chips, critic included (11 November);
  it leaves out the summaries and the advice prompt.
- **Gemini 2.5 Pro, beat Blue 2 May 2025.** Independent developer Joel Zhang, not Google. From Google's Gemini 2.5
  report (section 4.1, appendix 8.2): a subset of RAM, with the screen turned into text; a fog-of-war map in XML
  with every explored tile's type (water, grass, ledge…) and warps; a **pathfinder** and a **boulder-puzzle
  solver**, both separate Gemini 2.5 Pro instances (the puzzle one added after it had solved two of the four Victory
  Road puzzles itself); primary/secondary/tertiary goals; summaries every 100 turns, compressed again every 1,000;
  "Guidance Gemini", a critic every 25 turns. Run 1 changed the harness as problems came up ("dev interventions"),
  and Joel gave one direct hint (talk to the Rocket Grunt twice for the Lift Key, a known game bug). 813 hours. Run 2,
  with the harness fixed and no changes, 406.5 hours. With the screenshots taken away for part of the game it did
  about as well, so it was mostly playing from text. Gemini did **not** write its own tools in this run; the report
  says that was planned. (Gemini 3.1 Pro's 2026 run did write Python for its own pathfinding, with the minimap,
  pathfinder and puzzle agents taken away.) The slide said "Its own code" until 10 November; the pathfinder and puzzle solver are now one "Helper agents" chip, beside "Critic".
  It also said "Notes" until 11 November, but Joel's own write-up ("The Making of Gemini Plays Pokémon", blog.jcz.dev,
  13 August 2025) says the notepad came in with the next run (Yellow Legacy, late May 2025), so the chip is "Goals".
  His write-up dates each piece he added during run 1: goals 28 March, critic 1 April, summaries that week, map and
  pathfinder 14 April, boulder solver 1 May. The harness code isn't public; ARISE Foundation says it will open-source
  it, and its emulator layer (node-mgba) is already out.
- **GPT-5, beat Red Aug 2025, 6,470 steps** (o3's was 18,184; TechRadar, 15 August 2025). Independent developer
  Clad3815's GPT Plays Pokémon, not OpenAI. Only source for the harness is the PokeAgent paper's table, describing
  the mid-2025 version: location, party, money and tile colours from the game; button inputs; a minimap the model
  builds itself; a goal tracker and a notepad. Not confirmed for GPT-5's run specifically, and step counts aren't
  comparable across harnesses (what counts as a step differs).
- **Claude Opus 4.7, beat Red May 2026.** LessWrong (Julian Bradshaw, 16 May 2026): walkable tiles highlighted,
  short text labels on NPCs and items, notes/memory, and two new tools: zoom into part of the screen, and save
  screenshots or parts of them as a visual reference. It could also press several buttons in one turn. Taken out
  over time: Critic Claude, hints about the visuals, the general advice in the prompt, and limits on memory and
  button presses. No hours or total steps given. A pathfinder isn't mentioned. The slide has five chips since 11 November, "Labels" and
  "Saved screenshots" included.
- **Claude Fable 5, beat FireRed Jun 2026.** Anthropic's launch post: "a minimal, vision-only harness", "using only
  raw game screenshots—with no maps, navigation aids, or extra game-state information". It doesn't say how memory
  or context were handled, and gives no hours, steps or stream. Say "screenshots only" or "minimal", never "no harness".

Sources: Anthropic, "Visible extended thinking" (24 February 2025, anthropic.com/news/visible-extended-thinking); LessWrong, "Is Gemini now better than Claude at
Pokémon?" (lesswrong.com/posts/7mqp8uRnnPdbBzJZE) and "A Year Late, Claude Finally Beats Pokémon"
(lesswrong.com/posts/sehJYg5Yny9fvpbpt); Gemini 2.5 report (arXiv 2507.06261); TechCrunch, 3 May 2025; "The
PokeAgent Challenge" (arXiv 2603.15563, table 2, appendix F.1; its footnote: "Community-built harnesses, not official
products of the respective model providers"); TechRadar, 15 August 2025; Anthropic's Claude Fable 5 launch post.

## Time budget

| Finish by | Section | Slides |
|---|---|---|
| 1.5 min | Opening: the title while Ben is introduced, then who I am (coding agents wrote the code) | 1–2 |
| 3.5 min | Part 1, What is Minecraft? The card, show of hands, the route in one line (its clip only if few hands stay up) | 3–5 |
| 6.5 min | Part 2, Why try it with AI? The card, the Pokémon headlines in one beat, why Minecraft is harder (the example clip an optional pop there) | 6–8 |
| 10.5 min | Part 3, Can an LLM do it? The card, AltoClef in one line, the dragon clip with sound, then the prompt and the stats | 9–12 |
| 16.5 min | Part 4, How do you approach it? The question, playing Pokémon, then playing Minecraft, which builds into the six layers and their two bug clips (one slide, 20 clicks since 17 November: the Mineflayer card on its own click for the Andrew Kelley question, no green), then the staircase bug on its own slide in three quick clicks, the thesis, which opens by crossing out the home-made harness; the idea opens on the dial-back before its three cards | 13–17 |
| 22 min | Part 5, How did I build it? Cut to the card and two slides after the 16 November practice run: an integration test in a 3D world (a lava stepping-stones course: the stock mineflayer-pathfinder bot dies, ours passes), then the loop and who wrote the code (the dolphin drowning, the commit split, review before push) | 18–20 |
| 34 min | Part 6, What did I build? The "We died…" ladder: the card (312 deaths), the model asks for one whole job at a time, we died in the middle of a job, repeatedly to a spider, we got stuck under the ocean, how a pathfinder finds the way (A*), we died of boredom, because a reflex wouldn't let us leave | 21–28 |
| 38.5 min | Still part 6, the payoff (both moved here on 16 November): the harness grew and the runs got further (31 attempts), then what happened in the winning run | 29–30 |
| 40.5 min | Part 7, What I'd take from this: the fine print (it carries the part, no card) | 31 |
| 45 min | Takeaways, links | 32–33 |

(Evening of 17 November, dictated by Ben. The fine print is four lines with no TODO chips: 34 different tools called and 4 only for the dragon fight; the prompt came with a lot of strategy; one win by one model, reliability and other models not measured; plenty of the game still missing, and it still can't carve a pumpkin. Takeaways keeps its three icons with new wording: strong code-first primitives the AI can use; AI keeps getting better at building and testing them given a scenario that accurately reflects reality; hard-won ingenuity is already out there in papers and open-source projects and AI is good at finding and reusing it. The closing click: the next challenge is fewer tools, which takes fast, low-latency decisions and starts to carry over into robotics and the real world.)

| Questions | Appendix: racing Baritone (moved out of part 6 on 17 November), the run database explorer, the MCP part is tiny, credits | 34–37 |

Each `<section class="slide">` carries its finish-by minute in `data-by`; the speaker view uses it to show pace.

**The flow change (15 November).** Part 3 got the run slide's 2 minutes (it ends at 9.5) and part 4 gave up the help
slide's 1.5 (13.5, was 13), so part 5 moved half a minute later (18.5, 23, 26.5). Part 7 lost the run slide, so part 6
can end at 39.5 and still leave the fine print, takeaways and links their minutes (41, 43.5, 45). So part 6 gets the
help slide's 1.5 minutes: 13 minutes, 26.5 to 39.5. On 14 November its slides had been set to 32.5–41.5, which ran
past the run slide's 39.5. The split now: the card and 31 attempts to 28.5, Mine Labs 32, the harness grew 34, how I
picked the next fix 37, coding agents 39.5. Whoever owns part 6 may want to move time between those.

**The Pokémon slides (8–10 and 15) took three minutes on 10 November.** They came from the winning run (7 minutes
down to 6), and half a minute each from the Minecraft section, the layers section, limits and takeaways. The three
areas weren't touched: they'd already given up time once. The example clip (slide 7) got no minutes of its own:
the two "why a game" lines that opened the headlines slide are said over it instead. The slot is booked for 85 minutes, so if the host is
happy for the talk to run to 48, all of that can go back.

**The Minecraft section flexes with the room.** Slide 4 is a show of hands: heard of it, played it, beaten it or
know how it's beaten. Since 14 November the plan is one line on the route with its clips skipped (→ goes straight
to the next slide). Only if just a few hands are still up at the end does Space play the route.

**The route (slide 5)** was a slide and then a separate clip until 10 November. Ben's idea: show the chain, then
drop it to the bottom of the screen and play each step's clip above it while that step lights up. So it opens on
the heading and the eight-step chain. Space fades the heading, slides the chain down and plays `how-to-win.mp4`
above it, straight through: a few quick shots per step, about 48 s in all. Each step is outlined on the chain while
its clip plays, and the ones still to come are dimmed. Space pauses; once it stops on the dragon, Space moves on.
→ always goes to the next slide (Ben's call, 10 November). See "Clips" for the parts.

Part 4 (slides 14–18: the question, the Pokémon help slide and the layers) got a minute and a half more on 10 November, taken from areas 1 and 2. Area 1 can
afford it: the layers slide already explains what the tools layer is for. It then gave half a minute back to the
Pokémon section, which does some of its setting up.

**Skipped by default since 14 November:** the route's clip, the Pokémon example clip and AltoClef's clip (each one → past it).
**If it runs long, cut in this order:** the pearl-hunt detail, the scenario slide down to one line, the
attempts story. **Never cut:** the dragon clip, the six layers, the model asks for one whole job at a time, the monument override, the limits slide.
**Questions only:** pathfinding internals, the repo's five code layers, the MCP protocol, the code-size chart (appendix).

## Verified facts

From the published winning run (Hugging Face dataset `aibengineering/beat-the-game-minecraft`), unless noted.

- Gemini's seconds per turn (slide 16): Julian Bradshaw's LessWrong shortform comment (9 June 2025,
  lesswrong.com/posts/ekF2EDwKyZJNuxBTb, comment fB8atDtisJLWdHDSh), from the stream's own counters: run 1 "took
  ~106,500 actions/816 hours", run 2 (Gemini 2.5 Pro 05-06, fixed harness) "36,801 actions/406 hours". 816 h ×
  3,600 ÷ 106,500 ≈ 27.6 s; with Google's 813 h, 27.5 s; so "~28 s a turn". Run 2 works out at about 39.7 s a turn.
  The stream's clock reads 816 h where Google's report and Joel's write-up say 813; the timer and step counter
  missed the first ~48 h and were patched afterwards (Bradshaw, "Is Gemini now better than Claude at Pokémon?"),
  so the counts are approximate. Google's report gives hours only ("We report # hours to each milestone in order to
  normalize for the amount of time models take per action"); its appendix defines an action as each time the agent
  outputs a sequence of button presses. So a "turn" is one model reply, possibly several presses, and the time is
  wall clock including the harness's helper calls, not pure thinking. The PokeAgent paper (appendix F.1) notes all
  the "Plays Pokémon" harnesses freeze the emulator between actions.
- Seconds per turn across other public runs (slide 16 notes, "if asked": roughly 10 to 60 s a turn; checked 12
  November by the coordinator's research agent). No run publishes a measured per-turn latency: each is a count
  divided by a duration, and each "action", "step" or "turn" is one model reply that may press several buttons.
  - Gemini 2.5 Pro, run 2: 406.5 h (Gemini 2.5 report, §4.1, arxiv.org/html/2507.06261v1) ÷ 36,801 actions
    (Bradshaw, above) = 39.8 s.
  - Claude 3.7 Sonnet, Red, run 3: ~48 h ÷ ~12,000 actions ≈ 14 s; the author calls the counts rough
    (LessWrong, "So how well is Claude playing Pokémon?", lesswrong.com/posts/HyD3khBjnBhvsp8Gb, 7 March 2025).
  - Claude Opus 4.5, Red: "over 500 hours" at step 170,000, so at least 10.6 s (TIME, 13 January 2026,
    time.com/7345903/ai-chatgpt-claude-gemini-pokemon).
  - Gemini 3 Pro, Crystal: 17 days ÷ 24,178 turns ≈ 61 s, including more than 10 h of API downtime
    (blog.jcz.dev/gemini-3-pro-vs-25-pro-in-pokemon-crystal).
  - Left out: GPT-5's and o3's day counts, which are an outlet's own unsourced conversions of step counts.
- No sourced figure exists for how often a person presses buttons or decides in Pokémon (searched 12 November:
  PokeAgent gives human completion times only; nothing on presses), so slide 16's person row has no time.
- Creeper fuse (slide 17): a creeper explodes 30 game ticks, 1.5 seconds, after it starts to hiss (Minecraft Wiki,
  "Creeper"). Under the model's ~3 s a turn, so it can't react in time.
- Set Player Position (slide 17): serverbound play packet 0x1C (`move_player_pos`) in Minecraft 1.21.4, protocol
  769: X Double, Feet Y Double, Z Double, Flags Byte ("0x01: on ground, 0x02: pushing against wall"). Packets
  without compression are Length VarInt, Packet ID VarInt, Data (Minecraft Wiki, "Java Edition protocol", the
  1.21.4 revision, minecraft.wiki/w/Java_Edition_protocol?oldid=2938097, checked 12 November). 1.21.4 is the
  version Mine AI MCP runs (README quick start and Dockerfile `MINECRAFT_VERSION=1.21.4`). The slide's 27 bytes:
  1A 1C 40 29 00 00 00 00 00 00 40 50 00 00 00 00 00 00 C0 42 A0 00 00 00 00 00 01 (x 12.5, y 64.0, z -37.25,
  flags 01). Real servers usually compress and encrypt packets, which the notes say if asked.
- The correction (slide 17), all from the Minecraft Wiki's Java Edition protocol page, 1.21.4 revision (above):
  Synchronize Player Position is clientbound 0x42 (`player_position`): Teleport ID VarInt ("Client should confirm
  this packet with Confirm Teleportation containing the same Teleport ID"), X, Y, Z Double, Velocity X, Y, Z Double,
  Yaw, Pitch Float, Flags (Teleport Flags, an Int; set bits are relative, so 0 is absolute). The page's own
  description: "Teleports the client, e.g. during login, when using an ender pearl, in response to invalid move
  packets, etc." Confirm Teleportation is serverbound 0x00 (`accept_teleportation`), one field, Teleport ID VarInt.
  The slide's values are made up.
- Keys (slide 17 notes): Player Input, serverbound 0x29 (`player_input`), flags forward, backward, left, right,
  jump, sneak, sprint, exists in 1.21.4 (same page). In the 1.21.4 server it's only stored
  (`handlePlayerInput` → `setLastClientInput`) and read by advancement/predicate `input` conditions and a 0.001
  minecart nudge (`getLastClientMoveIntent`); sneak and sprint still come by Player Command. So the slide says the
  server hears the result, not the key, and the notes carry the nuance. (1.21.8 also sets sneak from it.)
- The server's movement checks (slide 17 notes), from the decompiled 1.21.4 `ServerGamePacketListenerImpl`
  (`handleMovePlayer`; public copy at github.com/extremeheat/extracted_minecraft_data, branch client1.21.4):
  "moved too quickly": (distance from the tick's first good position)² − velocity² > 100, or 300 when fall-flying
  with an elytra, times the move packets received that tick (reset to 1 above 5); logs and teleports back to the
  current server position. Skipped for the singleplayer owner, while changing dimension, or with the
  disablePlayerMovementCheck / disableElytraMovementCheck gamerules. "Moved wrongly": after the server applies the
  move itself with collisions, horizontal difference² > 0.0625 (a quarter block; the Y part is always zeroed),
  outside creative, spectator, sleeping and dimension change; it rejects the move (teleport back to before it) when
  the old position was clear, and a move into a block the player wasn't already in is rejected even without the
  log line. While a teleport awaits confirmation the server ignores move packets (re-sending after 20 ticks).
  Constants unchanged in 1.21.8 and 1.21.10. Checked 12 November.
- Mineflayer (slide 17): the JavaScript library's first commits are Andrew Kelley's (GitHub andrewrk) on 2 January
  2013 ("echo bot example working", in the repo's history). The repo itself starts on 23 January 2011 with his
  earlier C++/Qt client of the same name ("first version - has a window"; branch `cpp-qt-end`, whose README says it
  is no longer maintained and would be redone as a node.js module). The repo is github.com/PrismarineJS/mineflayer
  now; no source found dates the move from andrewrk. Its package.json depends on `minecraft-protocol`
  (node-minecraft-protocol, also PrismarineJS), which reads and writes the packets. So the slide says "Andrew
  Kelley, 2013. Now PrismarineJS". node-minecraft-protocol depends on `protodef` and `minecraft-data` and builds its
  serializer from minecraft-data's protocol description (its package.json and src/transforms/serializer.js), which
  is what Ben's "think protobuf without tags" line in the notes says.
- Mineflayer moving (slide 17, the code card and notes), read 13 November in the Mineflayer Mine AI MCP runs: its own
  fork, `github:aibengineering/mineflayer#85136409…` in package.json (version 4.39.0), with
  `aibengineering/prismarine-physics#4e972f60…` and minecraft-data 3.116.0 (its 1.21.4 protocol). API from the
  fork's `docs/api.md`: `bot.setControlState(control, state)`, control one of forward, back, left, right, jump,
  sprint, sneak; `bot.activateItem(offHand=false)`; `bot.lookAt(point, [force])`. In `lib/plugins/physics.js`:
  `setControlState` only sets a flag, except sneak, which writes `player_input` (feature `newPlayerInputPacket`,
  1.21.3 and later). A 50 ms timer runs `tickPhysics`, which calls `physics.simulatePlayer(...).apply(bot)` and
  then `updatePosition`, which writes `position` if the position changed (or a second has passed), `position_look`
  if the rotation changed too, `look` if only that did. In minecraft-data's 1.21.4 protocol, `position` is
  serverbound 0x1C (x, y, z f64, then MovementFlags), `position_look` 0x1D, `look` 0x1E, `player_input` 0x29.
  The fork sets the flags' horizontal-collision bit to nothing, so walking in the open sends the same 0x01 the
  Java client does. Player Input, answered: on 1.21.4 Mineflayer writes it only for sneak and, in
  `lib/plugins/entities.js`, for steering and leaving a vehicle; never for forward, back, left, right or sprint.
  `activateItem` (in `lib/plugins/inventory.js`) writes `use_item`, 0x3D on 1.21.4: hand (VarInt, 0 main, 1 off),
  sequence (VarInt), rotation (yaw, pitch f32).
- Human reaction time (slide 17): mean simple visual reaction 231 ms, 213 ms corrected for hardware delay, in
  Woods et al., "Factors influencing the latency of simple reaction time", Frontiers in Human Neuroscience, 2015
  (doi 10.3389/fnhum.2015.00131). Other studies range from about 230 to nearly 400 ms. "About a quarter of a
  second" covers it. Pro StarCraft's "300 actions a minute" is widely repeated but rests on wiki and press
  sources, so it stays off the slide.
- Jev (slide 17): Typesafe AI's "System 1" model, launched September 2026, which skips token-by-token generation
  to answer almost instantly. Its launch demos include a Minecraft bot. Described so far in the company's post and
  press coverage (e.g. MindStudio's explainer), not a paper.

- Run: 15 September 2026, seed 97996358, 3 h 56 min 15 s from the bot joining to "Free the End" in the server log.
  The transcript's timestamps agree (first event 00:43:38, last 04:40:13 UTC). result.json's `duration_ms` says
  12,791,868 ms (3 h 33 min), which is 0.90 of the wall time. That number comes from a timer inside the container,
  and the timers in there ran slow against the wall clock for the whole run: every `wait_for_action` with a 120 s
  timeout took 134.4 s by the timestamps (25 of them, from 15 minutes in to 3 h 28, all within a few tenths of a
  second, plus a second group at 130.8 s), and the bot's own "Duration" for actions came in at about 0.92 of the
  wall gap. `duration_api_ms` scaled back up (1,066 s ÷ 0.90 ≈ 1,183 s) matches the time between tool results and
  the next tool call worked out from the timestamps (1,185 s). So 3 h 56 is the real length. The likely cause is
  a VM clock that falls behind and gets stepped forward (Docker Desktop and WSL2 are known for it); the run wasn't
  on the homelab, and which machine it was on hasn't been checked.
- 388 tool calls in the transcript (387 action requests in the database), 37 different tools, 389 turns.
- Model thinking (API time): 17.8 minutes, 7.5% of the run, about 3 s per turn.
- Seconds per turn, turn by turn (slide 17 notes, "if asked"; the slide keeps "~3 s a turn", Ben's call): from
  each tool result's timestamp to the last entry of the next model request in `transcript.jsonl`
  (mine-ai-data/publish/beat-the-game-20260915), one measurement per request, 384 turns: mean 3.09 s, median
  2.33 s, fastest 1.40 s (three turns under 1.5 s), slowest 16.5 s, 10th to 90th percentile about 1.8 to 5.7 s.
  Recomputed 12 November, independently of the coordinator's run, which got the same count, mean and slowest and
  a median of about 2.5 s. So the fastest turns take about as long as the whole 1.5 s creeper fuse, not longer. Each
  turn is the full round trip (request, time to first token, generation), not pure thinking. The coordinator's
  figure of about 1.3 s of time to first token per turn isn't reproduced here: the transcript only shows when each
  content block finished (median 2.0 s to the first one), and the result line's `ttft_ms` (1,675) is a single
  value. These are wall-clock timestamps, so they sum to about 19.8 min, the open item below, not the 17.8.
- 1 death (creeper, 2:11:31). It respawned about 200 blocks away, walked back and recovered its gear: diamond armour,
  sword and pickaxe, 7 ender pearls, 10 blaze rods. The pick-up (`pick_up_items` with recoverDeathItems, request 193,
  result in wait 194) saw 47 items at first and 49 in the end, and confirmed 39 before the inventory filled; it dropped
  junk (196) and had its diamond boots back by 198. "All 47 recovered" was wrong (corrected 16 November).
- 293 automatic survival reactions logged. 9 survival-policy changes by the model.
- Reactions by reflex: hostile 250 (fight 232, evade 15, hide 2, shield 1), hunger 28, dragon 7, breath 3, footing 3, fire 2.
- Of 328 settled calls, 217 succeeded and 106 did not cleanly succeed (failed 49, partial 25, refused 19, cancelled 13); the other 5 were cancel requests. 59 further responses were "still running".
- 47 calls to the four dragon-only tools.
- The long call on slides 22 and 23 (run database, requests 49 to 52): `collect_block` obsidian × 16, submitted 28 minutes
  into the run, for the Nether portal frame with a few spare. The model set a two-minute wait each time. "Still
  running" came back at 2:11, at 4:28 (2 of 16 collected) and at 6:47 (14 of 16), and it finished at 7:07 with all 16.
  Slide 23's call list, checked 13 November in the published database: request 49 `collect_block` {block_name
  "obsidian", count 16, wait_timeout_ms 120000} at 0:00, pending at 2:11; requests 50, 51 and 52 `wait_for_action`
  {action_id, timeout_ms 120000} sent at 2:13, 4:33 and 6:49, replying pending (Broken 2), pending (Broken 14) and
  succeeded at 4:28, 6:47 and 7:07. The slide leaves out the defaults (`scaffold`, `allow_full_inventory`,
  `on_tool_loss`, `submission_id` "obsidian-1"). The two-minute waits read 2:11–2:15 on the wall clock: the
  container's timers ran slow (see the 3 h 56 bullet). "59 times in the run" is the 59 "still running" replies.
  The JavaScript on slide 23 is an analogy, not the server's API.
- $93.17 of usage at API prices (run on a subscription, so not billed).
- Phases, in minutes: gear up 55, Nether 22, ender pearl hunt 99, stronghold 35, the End 25.
- Milestones: full diamond armour 0:22:33, Nether 0:55:10, stronghold search 2:56:08, monument 3:09:07–3:11:17,
  End 3:31:34, perch attacks 3:40:52–3:55:35, 1.95 health at 3:50:58, win 3:56:15.
- Code (repo head, tests excluded): 58,294 lines. Actions 15,988, survival 15,538, navigation 15,380,
  world and bot data 4,126, runtime and session 2,654, MCP server 1,791, other 2,817. Tests: 39,636 lines.
- Ben built it between July and September 2026, while on long service leave, as a project to test the limits of AI.
- Ben built most of it offline, in his own time, and streamed the bot playing while it was in development: 3 full
  attempts on stream and more off it. Never say "built live on stream".
- AltoClef (not from the run; checked 10 November 2026). Its README: "Became the first bot to beat Minecraft fully
  autonomously on May 24, 2021", linking the video "Bot Beats Minecraft for the First Time (Baritone Random Seed
  Any%)" on TacoTechnica's channel, uploaded 31 May 2021 and 3 h 35 min long. The video's description: "World's
  first robot to beat Minecraft autonomously. Random Seed.", the ninth attempt streamed live, under rules of zero
  human input after one starting command. The README also says "Powered by Baritone". The claim is the project's
  own. No earlier bot turned up in a search and nobody was found disputing it; a 36Kr piece on DeepMind's Argon run
  repeats the date and adds that it relied on task logic written by its developers. The Argon paper doesn't mention it.
- Part 5's "what went wrong" lines (14 November), from `research/process-timeline.md` (a read-only pass over Ben's
  repos, 14 November): the 3 Aug lockup is milestone 9 ("Three bots reached that state on 2026-08-03", two at
  health 1–7; the idle hostile guard blocked every foreground action with `SESSION_BUSY` and had no time budget;
  fix `aaa912bc`); the unexplained respawn is the death notice in milestone 14 (`1d829c39`, 4 Aug: "36 blocks away
  at full health with its gear gone and no explanation", "All three bots filed that as critical engine failure").
  The five-minute idle timeout is in the repo README ("a smelting call hit the HTTP client's five-minute idle
  timeout while the server continued working"). The research found no triggering incident for async actions.
  Agents: the research's section D (Codex threads and Claude co-author trailers; no commit shown to be hand-written).
  Slide 25's "If asked" examples are milestone 14 (`9d4d80f3` gatherer drowning fix, `cdaa1d29` eat between fights,
  `cb65c281` escape fire). The June one-action-every-8-seconds loop and the August "Simple Actions" rewrite are
  milestones 2 and 12.
- 493 scenario files. 32 source files cite Baritone. Forks: mineflayer, prismarine-physics, prismarine-recipe, minecraft-data.
- Part 6 (14 November), from `research/process-timeline.md` (read-only pass over Ben's repos, run folders and agent
  records), spot-checked in the repos by the part 6 session. Dates are AEST unless marked UTC.
  - Attempts: 20 "12 Eyes of Ender" runs on 3–10 Sep and 11 dragon-goal runs on 11–14 Sep (research section B; a
    lower bound, from the run folders and notes still on disk). Run 9 spawned 4 Sep 02:07 (`mine_ai`
    `tools/playthrough/summaries/eyes-run-9-summary.md`); the first Nether entry and lava death is 4 Sep
    (`docs/plans/survive-the-night.md`, "The Nether death"); run 18 started 9 Sep and reached the End with
    assistance (`eyes-run-18-summary.md`); dragon run 3 entered the End 11 Sep 05:59 UTC. Dragon run 8 (folder
    `seed-64510673-20260913-113213`): the model's rationale reads "dragon is at 118 of 200". Dragon run 11 (folder
    `seed-64510673-20260914-203152`, 469 min = 7 h 49): "Dragon … stuck at 190/200 HP in phase 1 strafing_player
    for 90+ minutes: it never lan[ded]". The win: 15 Sep 00:43 UTC, 3 h 56.
  - Mine Labs: the in-repo Scenario Lab is in `mine_ai`'s first snapshot (`86503aa9`, 21 Jul) and `30be0fca`
    (21 Jul, "Simplify CLI workflows and Scenario Lab"); Mine Labs' first commit is `11053eb`, 13 Aug 22:18
    ("scenario-driven test runner for mineflayer bots (1.21.4)"), in its pre-publication history; it is public as
    github.com/aibengineering/mine-labs. Its README: it "starts a Minecraft Java server, prepares the scenario, runs
    your bot", Java Edition 1.21.4, and the bot "runs as a separate process and communicates … over a small JSON
    protocol".
  - Scenario files (scenario YAML in the tree at the day's last commit, counted 14 November): `mine_ai` 0 on 13 Aug,
    12 on 17 Aug, 19 on 20 Aug, 28 on 24 Aug, 46 on 27 Aug, 53 on 31 Aug, 82 on 3 Sep, 161 on 5 Sep, 315 on 8 Sep,
    347 on 9 Sep, 387 on 10 Sep, 398 on 11 Sep; then the old repo `mine-ai-mcp` along the winning code's history,
    435 on 12 Sep, 490 on 13 Sep, 497 at `b0b0178` (15 Sep 10:11, before the run; 3 of the 497 are templates).
    Part 5's older "493" was an earlier count of the same thing.
  - The scenario on "Mine Labs: every failure becomes a test": `tests/minecraft/scenarios/survival/breath-reflex.yaml`
    in the published repo, the SealedDiver pen. Today's suite (`docs/plans/2026-10-scenario-migration.md`, outcome
    section): 112 fixtures, 103 in the fast tier, 24 known-failing; the fast tier took 81 min one trial at a time;
    "Each fast-tier run fails a few percent of its trials"; each fixture "is either shown to fail when a pen is made
    impossible or a goal tightened, or carries a stated reason why its goals catch a regression".
  - Dolphin drowning: field note `mine_ai/docs/field-notes/drowning-air-metadata.md` (5 Sep 13:26:53 UTC = 23:26
    AEST, run 12's eighth death; reported air 186–200 against a full bar of 20; a dolphin reports 6000); fork fix
    `mineflayer` `c15b3ef7` 23:40 ("fix: update oxygen only from the bot entity metadata"); scenario `mine_ai`
    `46331a8a` 23:47 ("Record and reproduce the Mineflayer air ownership regression"); merged into
    `survival/breath-reflex` (ledger row for `flat/survival/drowning-beside-dolphin.yaml`).
  - The loop: the 13 Sep plan's "Order of attack, by how often the failure bites during a run" and its observe /
    change / prove shape (`mine-ai-mcp` `docs/plans/2026-09-13-reliability-and-parity-plan.md`, 761 lines by
    `wc -l`; the research says 765). Ben's note `private/plan_for_next_session_13092026.md` is 5 lines and says
    "these should be observed before being fixed". The 12 `codex/reliability-01…12` branches have last commits from
    19:57 to 22:13 and `codex/reliability-integration` 22:19 (git); the 12 subagents started 19:38–19:40 (Codex
    thread index, research milestone 17).
  - Authorship (research section D): 829 unique non-merge commits Jul–Oct across `mine_ai`, `mine-ai-mcp`,
    `clean-mine-ai-mcp`, `mine-labs` and the highlighter; 347 (42%) carry `Co-Authored-By: Claude`; the rest are
    Codex on Ben's own account (the only other tool he used), consistent with Codex's thread records and `codex/*` branches (it leaves no trailer); no commit
    found that is demonstrably hand-written. AGENTS.md (`mine_ai`): "A successful result must mean the requested
    outcome was actually observed"; "The maintainers intend to understand every authored line in the human-reviewed
    surface". Review before push: `clean-mine-ai-mcp/reports/commit-review/server.ts`.
  - Baritone, for the notes: `a6183b09` (26 Aug) measured every scenario against both pathfinders and `8c7826bc`
    made the new one the default the same day.
  - The early harness (an early project folder, read-only, 14 November): `bot.log` starts with "spawned as
    CodexBot" and gpt-5.4-mini on an 8-second cadence; the folder's earliest file is `proxy.log`, 27 Jun 13:51.
    `benchmarks/history.jsonl`: 121 whole-agent runs, 14 Jul 13:14 UTC to 19 Jul 09:25 UTC, all gpt-5.6-luna on seed
    8675309 with turn and time limits (obtain_diamond: maxTurns 120, maxMinutes 45). Outcomes: obtain_diamond 18
    succeeded, 48 failed, 23 incomplete; stone_tools_furnace 5 and 10; shelter_bed_sleep 8, 2 and 7 incomplete. The
    first run (obtain_diamond, 14 Jul) used all 120 turns in 2,381 s with about 1.02 million tokens (estimated) and
    failed on max_turns. `benchmarks/micro-history.jsonl`: 36 model-free runs, 19 Jul 11:34 UTC to 20 Jul 14:04 UTC
    (course 16, path 11, combat 7, all 2). `docs/current-state.md`: "Model-free pathfinding, movement-regression,
    navigation-course, and combat micro-benchmarks that reset scripted arenas, invoke production actions directly,
    retain per-trial metrics and manifests, and enforce zero model calls"; path run `2026-07-19T11-34-33-620Z`
    "satisfied all 12 contracts".
  - The scenario example (16 November, the bot's repo, read-only): `tests/minecraft/scenarios/pathfinder/bucket-drop-route.yaml`
    (last changed 20 Oct, `5c792f6`), tagged acceptance. A bedrock floor (-8..8 at y -60) and a bedrock pillar at
    0,0 from y -59 to -45 (15 blocks); Actor at [0.5, -44, 0.5] with one water bucket; params `action: navigate`,
    input `{ x: 1, y: -59, z: 0, range: 0, dig: false, scaffold: false }`; goal `kind: all, timeout: 45` with reach
    [1.5, -59, 0.5] radius 0.75, health 20, hasItem water_bucket 1, completion, survive 1 s. Its comment: "A 15-block
    fall costs about 12 health without the water, and this world does not regenerate, so the health goal catches a
    missed or late pour. The bucket goal catches a pour whose water was left behind." Template
    `templates/flat-single-action-no-regen.yaml` sets `naturalRegeneration: false` and extends
    `flat-single-action.yaml`, whose client is `bun client-host.ts drivers/single-action.ts`; that driver calls the
    named action once (`context.call(action, input)`), and Mine Labs checks the world goals separately.
    The clip and still (the recorder session, 16 November): `minelabs-bucket-drop.mp4` 7.3 s, 1280x720, muted,
    about 2 s real speed then the drop at 0.4x and a close view at 0.3x, labelled "slow motion"; the yellow line
    is the planned path, drawn by the block-highlighter mod. The run passed 8 of 8 times: 1 headless with the file
    unchanged and 7 recorded, the recorded ones from copies with one added line pinning the spectator camera (the
    default spectator loses the 15-block fall); arena, inventory, action and goals identical. The still shows
    "navigate succeeded in 1468 ms", "goal satisfied: all(5) passed", "PASS bucket-drop-route 20.4s" (the
    20.4 s includes server setup; pour to scoop is about 0.2 s).
    Off the slide since 17 November (replaced by the lava course below); the files stay in `site/media/`.
  - The lava course and the stock bot (17 November, written for the recording; scratch only, not in the bot's repo or
    the suite, Ben's call later). Course `lava-steps.yaml`: a bedrock basin two blocks deep full of lava, a stone start
    (x -7..0), six soul-sand stones two blocks long with one lava cell between each (x 2..18), a gold finish pad
    (x 20..22); Runner at [-4.5, -60, 0.5]; ours is `navigate { x: 21, y: -60, z: 0, range: 0, dig: false, scaffold:
    false }`; goals reach [21.5, -60, 0.5] radius 1, health 20, completion, survive 1 s; regeneration off. Built
    after trying the stock bot on the gauntlet-lava-parkour fixture, where it cleared the maximum gaps but clipped the
    lava at the soul-sand hop (the fixture rebuilt from a real death on 8 September) and burned. Stock bot: about 60
    lines of JavaScript speaking Mine Labs' client protocol, npm `mineflayer` 4.39.0, `mineflayer-pathfinder` 2.4.5,
    `prismarine-physics` 1.11.0 (pinned with an npm override; the field note's baseline pair), default `Movements`,
    one `GoalBlock` on the pad, no reflexes; it reports success 4 s after arriving. It failed 7 of 7 on this course:
    4 died in the lava (server: "Runner tried to swim in lava"; Mine Labs: "all failed: Runner failed: died"), 3
    reached the pad on 1 or 2 health, still burning (health check failed). Each hop off soul sand overlaps the lava
    cell: 4 damage and set alight. Ours passed 12 of 12 (8 headless, 4 recorded), full health, navigate about 6.8 s.
    Mineflayer-pathfinder is what the first versions used. Clips: one fixed spectator camera, real time,
    `minelabs-lava-steps-stock.mp4` 6.9 s and `minelabs-lava-steps-ours.mp4` 6.8 s, cut from one capture of the
    17 November runs.
    Re-recorded the same day with Ben (17 November, later): both bots now start on 12 health of 20 (`players[].health:
    12`, health goal 12), Ben's choice, because at full health the stock bot died in only 4 of 7. Eight stones at full
    health made the stock bot die every time but our navigation then failed on the eighth hop in a row (4 of 4,
    "[FIRE] contact … fire escape did not establish safe footing"; seven hops pass): a real bug, kept for a scenario
    later. On the 12-health course the stock bot died 17 of 17 (4 headless, 13 recorded) and ours passed 13 of 13
    (4 headless, 9 recorded). The stock bot now runs with mineflayer's `respawn: false`, so a death stays on screen
    instead of popping it back to the start. Camera behind the start looking down the course (`tp -14 -54 6 -111 23`),
    window captured at 3840x2054 and cropped 2400x1350 at 400,704 to 1280x720, no letterbox. Stock clip 5.0 s from
    `take-course-5.mkv` 17.75 s; ours 6.0 s from `take-course-4.mkv` 23.4 s.
  - The first version, end to end (checked 16 November, for the marker on "Playing Minecraft"): `bot.log` runs 27 Jun
    04:48:32 to 04:50:36 UTC (14:48 AEST): the bot spawns, calls gpt-5.4-mini on its 8-second cadence, and every turn
    returns one JSON action with a reason (`follow_player` each time); the log's crash trace runs through
    `src/actions.js` `clearMovement` → `bot.setControlState`, so the action code drove Mineflayer's controls. Model,
    turn loop, action menu, action code, Mineflayer, server: every layer, home-made in one program (no Claude Code, no
    MCP server). The win: 15 Sep 2026, 00:43 UTC (`research/process-timeline.md`, milestone 18, from the published
    `run.json`). 27 Jun to 15 Sep is 80 days, 11.4 weeks: "11 weeks" on the slide. The last whole-agent run started
    19 Jul 09:25 UTC and the first model-free one 11:34 UTC the same day (21:34 AEST), 22 days after the first bot.
    Since 17 November the marker says "built" and what it ran on (coordinator, from the repo): first commit 27 Jun 16:00
    on the plain OpenAI SDK with gpt-5.4-mini through a ChatGPT login; the Vercel AI SDK agent loop (generateText,
    11 tools) added 17:54 the same day and used until 9 Jul; the home-made loop retired 3 Aug, when Codex CLI became
    the first off-the-shelf harness to play; Claude Code's first tool calls 4 Aug. All of that is in the slide's notes.
- Part 6, What did I build? (part 5 until 16 November; slide numbers below are those of 12–14 November), checked 12 November against the run database (`action_requests`, `action_responses`,
  `notes`, `events`, `frontier_chunks`). Run times are from the first event, 00:43:38 UTC.
  - The four calls on slide 21, with their rationales word for word: request 3, `collect_block` logs × 16 at 0:00:04,
    succeeded, 16 gained, 76.7 s; request 23, `smelt_item` raw_iron × 24 with coal at 0:12:26, settled through
    `wait_for_action` (request 24) with 24/24 ingots after 4 min 00 s; request 25, `craft_item` iron_pickaxe, shield,
    bucket, iron_chestplate, iron_leggings at 0:16:56, all 5 in 303 ms; request 92, `navigate` -30, 65, 89 in the
    Nether at 0:55:21, 212.5 blocks of travel in 1 min 10.6 s. Arguments on the slide leave out the defaults
    (`scaffold`, `allow_full_inventory`, `on_tool_loss`, `submission_id`, `wait_timeout_ms`).
  - `collect_block` was called 25 times for 10 kinds of block (logs, stone, coal_ore, iron_ore, diamond_ore,
    obsidian, nether_gold_ore, pumpkin, dirt, end_stone); `navigate` 39 times.
  - `raw_action`, the escape hatch (slide 21, "almost never"; checked 14 November in the published database). Each
    call is one low-level operation: look, dig one block, place one block, one swing or attack, use the held item for
    one tick, or hold one control for 1 to 40 ticks (2 s at most); the docs say to use it only when normal actions
    refuse and the bot is wedged (`docs/mcp/tools.md`). The winning run used it twice in 387 action requests:
    request 246 at 2:57:18, `look` at a placed pumpkin ("Aiming at the placed pumpkin so a shears use targets that
    block."), succeeded; request 247, `use_item` with the shears to carve it, reported "effect observed: no".
    Request 248 (`view_blocks`) still showed a plain pumpkin. Request 250's rationale: "a carved pumpkin is not
    craftable with these actions and 27 arrows will have to suffice". Request 275 dropped the shears and pumpkin
    ("the pumpkin/shears plan failed so they are dead weight").
  - The reply on slide 27 is request 214, the `wait_for_action` that settled request 213's `navigate` (submitted
    2:30:56, "Return to the surface near sheep…", reply at 2:33:14). Full text 2,610 characters; the slide keeps
    11 lines word for word and marks the cuts with "…". It shows `[HOSTILE_CONTACT] fight response for
    creeper#28397`, 411.97 blocks of travel with 5.58 during reflexes, 3.5 s suspended, 2 min 04.3 s elapsed,
    178 unread notifications. Slide 24's handoff is the same call.
  - 373 of the 387 replies carried a Notifications section.
  - Slide 28: `view_status` 24 calls, `query_bot_data` 14, `note_read` 1 (request 2, the run's first call, which
    found no notes), `note_save` 5 (the `notes` table has those 5). 6,836 rows in `frontier_chunks`. 320 rows in
    `events`: 293 survival outcomes, 17 low-durability and 5 broken-equipment warnings, 3 dimension changes,
    1 death, 1 stronghold located. No chat. The query is request 293 at 3:20:09, trimmed in the middle on the
    slide; request 295, `navigate` -304, 63, -1728, came 7 s later and succeeded (request 294, the same spot
    without a y, failed 2 s before it).
  - Slide 24: of the settled results whose reply lists **Interruptions**, 12 were `navigate` (9 succeeded,
    3 cancelled) and 5 `collect_block` (5 succeeded): 17 trips and mining jobs, 14 finished. Over all actions it
    is 49 settled results, 20 succeeded; most of the rest are hunts (`collect_mob_drop`, 24), where fighting is the
    job. The interruption codes: HOSTILE_CONTACT 202, HUNGER 20, HOSTILE_SETTLED 10, BREATH 1.
  - Action kinds (`src/actions/action.ts`, `docs/mcp/concepts.md`): `information`, `task`, `resumable_task`,
    `control`. Markdown is the default reply and JSON is on request (`response_format`); every reply carries a
    notification summary of unread events without moving the read cursor (`docs/mcp/events-and-responses.md`).
    The README says compatibility with hosts other than Claude Code is unverified.
- Harnesses (slide 20): Ben, 13 November: "I built and used it as an MCP server with Codex and Claude Code, not
  with anything else for now." The winning run was Claude Code. Say "used with Claude Code and Codex"; the design
  intent (a standard MCP server any MCP client can connect to) can be said, but never "qualified", "verified" or
  "works with any harness".
- Part 6 navigation (16 November).
  - Run numbers, from the published database's `action_executions` (each `terminal` record's `durationMs` and the
    largest `distanceTravelledBlocks` in it): 239 executed actions, 135 of them moved the bot more than one block,
    24,490 blocks in all ("24 km", one block is a metre); those 135 took 3.05 h of the 3.30 h summed over all 239
    (92%). The clip `navigation-loop.mp4` is request 92 (bot AI_M1KE, `navigate` x -30 y 65 z 89, range 1, dig and
    scaffold on, 0:55:21), whose overlay matches; rationale word for word.
  - Baritone, from github.com/cabaletta/baritone and its API (read 16 November): LGPL-3.0; created 1 Aug 2018;
    9,357 stars; README "an updated version of MineBot" (leijurv's repo) and "it's over 30x faster than MineBot";
    "Baritone is the pathfinding system used in Impact since 4.4"; top contributor leijurv (2,509 commits), then
    ZeroMemes (747) and ZacSharp (326). The README names no creator in so many words; leijurv's MineBot and commit
    count are the basis for "by leijurv and contributors". v1.13.1, the version raced, is a release for Minecraft 1.21.4.
  - Not a port of the source: `dd5b37a6` (26 Aug, "add the Mineflayer-native navigation candidate": "shape follows
    Baritone where Baritone has already answered the question"), `8ff2e416` (ticks), `cff4dd21` (mining);
    `minecraft-simple-actions/docs/pathfinder-rewrite/reference-implementations.md` says to port "useful fixtures and
    invariants, not source code". It became the only pathfinder in `9f57abb1` (3 Sep), replacing mineflayer-pathfinder.
    Neither repo credits Baritone's authors by name; both are MIT, AI Bengineering.
  - The race (`mine_ai`). First race, 3 Sep, timed by hand in a Claude Code session (transcript `3da275eb…`,
    03:20Z and 03:27Z): flat stream world, ours 9.4 nodes/ms against Baritone's ~300 ("roughly 30 times"); hilly
    test-survival world, ours 5.3–5.9 against 340–390 ("about 60 times more" per node). `9f57abb1`'s message: "from
    about 5 to about 30 to 50 visited nodes per millisecond over the day, measured in-game beside Baritone 1.13.1".
    Scripted runs, `mine-ai bench navigation`, seed 8675309, routes A 53, B 107, C 159 blocks, ours on Bun 1.4.0,
    files in `docs/benchmarks/navigation/runs/` (our `visited` against Baritone's `nodes`, per ms of search
    compute; median of the three routes because A is each engine's JIT-cold first search):
    `2026-09-03T05-09-06-079Z` 52.4 vs 216, 4.1× (A 1.9, B 4.9, C 4.1); `2026-09-08T06-54-04-542Z` 15.9 vs 190,
    11.9× (no cause is recorded: `fdf8fbed` says only "about 3x, from 12x" and `semantics-vs-baritone.md` "down
    from twelve that morning"; a profile-based explanation exists only in a Claude Code memory note, so the slide says
    "slower again");
    `2026-09-08T23-09-24-645Z` A 61.3 vs 78.4 (1.28×), B 104.4 vs 339.5 (3.25×), C 93.9 vs 255.6 (2.72×), median
    2.7×; route C there: search 248.8 ms vs 156 ms, wall time 39.56 s vs 37.25 s. Dates on the slide are AEST (the
    run files are UTC: 03:27Z and 05:09Z on 3 Sep, 06:54Z on 8 Sep, 23:09Z on 8 Sep = 9 Sep 09:09 AEST).
    Per node (`docs/benchmarks/navigation/baritone-profile.md`, `838b2c2f`, 9 Sep): Baritone 3–4 µs warm, ours about
    10; about 60% of Baritone's time is block reads. `where-the-search-stands.md` (`f4becc31`): within 1.3× on flat
    open ground; a native C core was measured and rejected (the loop is about 1% of a node).
- Part 6 ladder sources ("We died…", 17 November; every line checked at its source; times AEST unless marked UTC).
  - The count. 312 bot deaths in real play, 29 Jul to 15 Sep: Minecraft's own death lines (`<name> <death message>`,
    matched against the full list of death messages) in the live dev server's logs (`mine_ai/.local-server/logs/
    *.log.gz`, dated by file name, plus the undated `mine_ai/logs/processes/server.out.log`, its restart segments
    matched to the dated files) and the eleven dragon-goal Docker runs including the win (`mine-ai-data/runs/*`, WSL
    `~/mine-ai-data/runs/*`). Every `player_death` event in the run databases matches a log line to the second, so the
    databases add none; duplicates removed by bot, second and message. Causes: mobs 220 (zombie 80, skeleton 54, spider
    21), drowning 25, falls 22, creepers 21, lava and fire 19, other 5 (4 suffocated in a wall, 1 lightning), starvation
    0. By campaign: Codex role loops in August 104, Eyes of Ender playthroughs 64, dragon-goal runs and the win 63,
    Nether runs 40, TestBot and AIVolunteer sessions 21, hands-free survival 17, survival-20260911a 3. Not counted:
    27 Jun to 14 Jul (no logs survive), the July benchmark ladder (20), test-fixture bots in scenarios (563 or more),
    human players. All 31 attempts have a surviving log. The per-death table and the method are in the side-session
    notes folder (`deaths-real-play.csv`, `deaths-SOURCES.md`).
  - Controls (rung 1 since the rebuild): the published run database, request 3, `collect_block` logs × 16 at 0:00:04,
    rationale "Wood is the base of all early tools; I have an empty inventory and need a crafting table and pickaxe.",
    succeeded in 76.7 s. One job at a time is in `86503aa9` (21 Jul 09:43), hence "Since 21 Jul".
  - The 1 Aug drowning (now a callback in rung 2's notes): Codex session log `~/.codex/sessions/2026/08/01/rollout-2026-08-01T20-01-21-019fbcc5….jsonl.zst`
    (zstd; Node 24's `zlib.zstdDecompressSync` opens it): navigate returned `suspended` with `EMERGENCY_AIR` at 10:10:13Z;
    at 10:10:19Z the model: "Because the action has returned and survival takes priority, I'm inspecting immediately
    before deciding whether a separate recovery action is necessary."; a recovery navigate started 10:10:26Z and
    returned at 10:10:34Z. Server log `[20:10:34] CodexMCP drowned` (`server.out.log:454`), 21 s after the handback.
    Turns then took 5 to 25 s. In the code that won, breathing and the hostile reflex also run between jobs
    (`reflexes/breath.ts`: "while another action or idle buoyancy owns movement"; `hostile.test.ts`: "claims an idle
    body").
  - Reflexes, 28 Aug: `.local-server/logs/2026-08-28-6.log.gz`: `[21:49:27] TestBot was shot by Skeleton`; `[21:52:24]
    <TestBot> I died during the diamond run and respawned empty; I need to recover a pickaxe from the chest before mining
    again.` The job, `simple_collect_block` for 21 diamond_ore, started 21:45:43 and returned partial at 21:51:39 (Codex
    session `rollout-2026-08-24T12-34-48-01a0319e….zst`). Ben on Stream 14, 29 Aug (`AIBengineering/2026-08-29 - Stream
    14/Post Stream/transcripts/2026-08-29_12-46-15.md`), at 2:09:25: "I'm gonna go and add combat into our MCP so it stops
    dying to skeletons". Fix `f9d7a13d` (2 Sep 09:12): "navigate, collect-block and explore-frontier declare their
    requests safe to repeat and are resumed after a kill". The July code had a hostile reflex that interrupted actions
    (`86503aa9`, `src/safety.ts`); the Simple Actions rewrite (`33733037`, 12 Aug) started without one. Lava: field note
    `eyes-of-ender-nether-death-2026-09-04.md` ("EnderSeeker tried to swim in lava"); drowning: `docs/plans/
    survive-the-night.md` (`8e85cee2`, 5 Sep), a different death from slide 20's dolphin (run 12, 5 Sep 23:26).
  - Reflexes in the code that won (`mine-ai-mcp` tag `beat-the-game`, de4fef3): six attached in `runtime/
    minecraft-runtime.ts`, all six fired in the run (hostile 250, hunger 28, dragon 7, breath 3, footing 3, fire 2, from
    `events` rows `survival_outcome` by source). Hunts: `actions/hunt-mob/hunt-mob.ts:197` calls `combat.engage(...)`
    itself, the same controller the hostile reflex's fight uses; the reflex only considers hostile mobs, so it never
    fights cows, sheep or pigs; the run's hunts made 65 kills with 296 swings. Dragon: `reflexes/dragon.ts` only evades
    (breath, fireballs, the body's path or a perch); all 7 firings were evades. The dragon and crystals are fought with
    model-called actions (`attack_dragon_perch`, `shoot_dragon`, `destroy_end_crystal`, `prepare_dragon_perch`), and the
    hostile reflex filters the dragon out (`control/combat/observation.ts:64`).
  - Replies, 3 Aug: `server.out.log:4129–4135`, CodexBuilder slain by Spider ×4 and Zombie ×3 from 14:49:24 to 14:51:02.
    Codex session `rollout-2026-08-03T13-07-34-019fc597….zst`: two `[PLAYER_DIED]` results (04:49:25Z, 04:50:37Z; their `completedAt` 04:49:25.067Z and 04:50:37.721Z, so the deaths
    at 14:49:24 and 14:50:37 AEST, marked "✓ told" on the slide); at
    04:50:18Z the model: "The drop cluster is unstable: exact entity IDs vanish between fresh inspections and the
    builder's position resets, so repeated pickup attempts are no longer safe or reliable." A death during a running
    action was already reported; deaths between calls were not. Fix `1d829c39` (4 Aug 02:01): "The next check-in showed a
    bot standing 36 blocks away at full health with its gear gone and no explanation anywhere." … "surface it as
    lastDeath on the check-in, the environment snapshot and session status". Later steps without an incident: `fa47e1c8`
    and `3c479f67` (20–21 Aug), `ab52bc0e` and `5348ddbe` (23 Aug).
  - Navigation, 5 Aug (rung 4 since the rebuild): Stream 11 (`AIBengineering/2026-08-05 - Stream 11/Source Recordings/
    2026-08-05_14-48-03.mp4`, 3 h 21 min from 14:48; no transcript). World "world", bots CodexWarrior, CodexBuilder and
    CodexGatherer. `mine_ai/.local-server/logs/2026-08-05-6.log.gz`: `[16:46:12] <CodexWarrior> I am stranded underground
    at -314,35,-261`; `[17:07:18] <CodexWarrior> Under water shaft: air y49, water y52-62`; `[17:04:01] <CodexGatherer>
    Water blocked descent; emergency-air failed`; `[17:09:33] <CodexWarrior> Safe route to shaft failed again:
    noPath/timeout after 58k nodes`; `[17:24:33] <CodexGatherer> Handoff waypoint is water over no support; I logged the
    navigation defect`; the rescue column was still being built at 18:20. No death of the trapped bot; the rescuers died
    three times (CodexBuilder by zombies 17:31:02 and 17:53:36, CodexGatherer by a fall 17:52:36). This was three weeks
    before the rebuild, and the new navigation didn't swim at first (Stream 14, 29 Aug). Ben's reason, Stream 14
    (`Post Stream/transcripts/stream_combined.srt` 00:10:26–00:11:08): "none of them have I've seen have been that
    reliable. They all like fail at some point." … "it made more sense to rebuild the best state of the art in
    JavaScript". Against mineflayer-pathfinder there is no speed multiplier: `docs/pathfinder-rewrite/baseline-
    comparison-2026-08-26.md` (`4cf5afea`): "The timing gap is gone" (within about 6%); the door course 0/2 for the old
    one (it breaks the oak door), 2/2 ours; the 12-block lava-pillar descent 1 search against 12, 13 nodes against 275.
  - How a pathfinder finds the way (17 November). Baritone, github.com/cabaletta/baritone, master, read 17 November:
    `ActionCosts.java` ("These costs are measured roughly in ticks"; WALK_ONE_BLOCK_COST 20/4.317 = 4.633, WALK_ONE_IN_WATER
    20/2.2 = 9.091, JUMP_ONE_BLOCK_COST and FALL_N_BLOCKS_COST from its gravity formula); `MovementAscend.java` (max(jump,
    walk) + `jumpPenalty`, 2 in `Settings.java`: 6.63); `MovementDescend.java` (WALK_OFF_BLOCK_COST + max(FALL_N_BLOCKS_COST[1],
    CENTER_AFTER_FALL_COST): 9.32). Every movement class has its own `calculateCost` and `updateState` (`Movement.java`).
    `PathingBehavior.java` plans the next path in a new thread while the current one is walked ("Continuing on to planned
    next path"), starting when fewer than `planningTickLookahead` (150) ticks remain; `AStarPathFinder.java` stops at
    `primaryTimeoutMS` (500 ms) and returns the best partial path (`bestSoFar`). Ours (tag beat-the-game):
    `src/navigation/movements/catalogue.ts` ("The movement's total cost in ticks"), `execution/movement-controller.ts`,
    `execution/water-movement-controller.ts`, `orchestration/navigation-run.ts` ("Baritone plans its next segment while
    walking the current one"; "The plan-ahead search: started from the end of a partial segment while that segment is
    walked"). mineflayer-pathfinder 2.4.5 (`lib/movements.js`): walk 1, jump up 2, diagonal √2, `liquidCost` 1, so its
    costs aren't ticks; it executes every move through one `monitorMovement` (`index.js`); it does keep computing a
    partial path while walking, so the third callout claims no difference.
  - The 24 Aug trip home and hang (notes only since the rebuild): `docs/field-notes/investigation-simple-navigate-host-
    stall-2026-08-24.md`: request 192, `simple_navigate` home, started 15:29:34, "Cancelled after 120,009 ms", by then
    "farther from home"; `.local-server/logs/2026-08-24-4.log.gz`: `[15:31:58] AIVolunteer was slain by Zombie`. The same
    note: request 451 "Took to long to decide path to goal!", request 452 accepted at 06:45:59Z and never answered, then
    "[ACTION_BUSY] simple_navigate has been running since 2026-08-24T06:45:59.235Z; no new action started." The rebuild
    spec (`pathfinder-rewrite/README.md`, 25 Aug) cites the stall. New navigation `dd5b37a6` (26 Aug 12:21), default
    `8c7826bc` (22:55).
  - Waiting, 7 Sep (rung 5 since the rebuild): the bot database for world `eyes-of-ender-20260907n` (EnderSeeker):
    request 67, `simple_collect_block` obsidian at 16:44:11 ("A nether portal frame needs fourteen obsidian…"); request
    68 at 16:49:22: "The obsidian collect exceeded the client idle timeout but keeps running server-side; status shows
    whether it has settled."; six `simple_view_status` calls, 68 to 73; request 74, `simple_cancel_foreground_action` at
    16:50:54: "The requested frame material is already carried and the collect has stopped progressing, so the time is
    better spent on the portal." Server log `2026-09-07-1.log.gz`: `[16:51:08] EnderSeeker tried to swim in lava`, 13 s
    later. Write-up `tools/playthrough/summaries/eyes-run-14-summary.md`, "Death 1": "Cancelling returns the body in
    place, with no owner and no safe settlement" and "Patience worked; the cancel killed the bot."; the 300 s idle timeout
    is the chat client's. Earlier, `b2510ed6` (2 Sep 12:36) removed our 60 s deadline after the bot "began splitting work
    into \"timeout-safe batches\"". Async actions `2685082` (old `mine-ai-mcp`, 13 Sep 00:08); the design is
    `docs/mcp/async-actions-design.md` (12 Sep) in the async-actions branch.
  - Policy, 6 Sep: `mine_ai/tools/playthrough/summaries/eyes-run-13-summary.md`, bug 19 "reflex lockout (killed the
    run)": "every retry for three minutes returned `[ACTION_BUSY] hostile_reflex has been running since …; no new action
    started` while the reflex re-engaged the same cubes. The bot died inside that loop. The agent had the right plan and
    no way to execute it." Server log `2026-09-06-6.log.gz`: `[22:49:30] EnderSeeker was slain by Magma Cube` (world
    eyes-of-ender-20260906m). `75d820b` (12 Sep 23:53): "Unify survival policy…"; the record doesn't tie bug 19 to it,
    and `bf451ed3` (27 Jul) already had `set_hostile_policy`. Earlier case, `aaa912bc` (3 Aug 20:44): "Three bots reached
    that state on 2026-08-03; two of them sat at health 1-7 with no legal move until their agent loops gave up".
  - The monument calls in the published database: request 261 at 3:09:17 (`engagement: defend_only`, 10 min), 267
    at 3:09:35 (`hide: never`, `retreat: false`, 3 min; reason "Automatic evade keeps seizing the body and swimming me
    deeper into the ocean monument; I need manual control to route north to land."), 273 at 3:11:15 (`engagement:
    respond_to_threats`, `hide: when_recovery_possible`, `retreat: true`, session; reason "Escaped the ocean monument
    onto land at full health; normal defensive behaviour should resume for the stronghold dig and End trip.").
    `set_survival_policy` was called 9 times (requests 96, 121, 141, 199, 207, 261, 267, 273, 323), all succeeded.
  - "60 game ticks" on the controls slide is 20 ticks a second (as on "Minecraft is a harder problem" and "Playing
    Minecraft") times the ~3 s turn.

## Open items

Shown on the slides as dashed yellow TODO chips (press T to hide them).

- [x] Part 5, How did I build it? (Ben's call; done 16 November: navigation and Baritone have three slides in part 6): the Baritone tiles (32 files credit Baritone, 15.4k lines of navigation, 4 forks) and
      the navigation loop clip left the slides when "How it got reliable" became part 6; Baritone is in the notes
      of "The harness grew, the runs got further". Bring them back as a slide or a click if the Integrate takeaway
      needs them on screen.
- [x] Start date (14 November): 27 June 2026, from the bot's earliest files (`bot.log` "spawned as CodexBot", first
      file 13:51). "Who I am" says Jun–Sep 2026; its notes have "Started 27 June, a few days before the leave" if asked.
- [x] First version's date on "Playing Minecraft" (16 November; "built", plus GPT and the Vercel AI SDK, 17 November): 27 Jun, 11 weeks before the win, from `bot.log`
      (see "Verified facts"); the TODO chip in its notes ("first couple of days") is gone.
- [x] Part 5, How did I build it? (16 November): the bucket-drop clip and pass still are on "A scenario: a world,
      a bot, a goal"; the TODO chip is gone. Replaced on 17 November by the lava course before/after.
- [ ] Part 5: whether the lava course (and the one-off stock bot) joins the bot's scenario suite is Ben's call.
- [ ] Part 5, How did I build it?: the agents named only as "coding agents (Codex and Claude Code)" until Ben says how to name them.
- [ ] Slide 17: look at what Jev's Minecraft demo actually does before saying more than the one line about it.
- [x] Intro (10 November): Ben names his employer out loud on the day. In writing it is only ever "Australia's
      largest bank" (slide 2). The name is not written anywhere in this project, because the site, its speaker
      notes and this brief may all be published under aibengineering.
- [ ] Name as shown on the title slide.
- [ ] Ask the host: is anyone joining by video call (clips stutter over a call, and the show of hands needs a
      way to count them), and what the extra 25 minutes in the booking are for.
- [ ] Ask the host: room speakers for the dragon clip, and whether the call can share the tab's audio.
- [x] Resource gathering (12 November): slide 21 is four real calls, three of them gathering (collect, smelt, craft).
- [x] 3 h 56 vs 3 h 33 (10 November): 3 h 56 is right. See "Verified facts". The TODO chip on slide 13 is gone;
      the notes have a line in case someone asks.
- [ ] Model time on slides 17, 20 and 31 (17.8 min, 7.5%) is `duration_api_ms`, read off the same slow clock. By the
      wall clock it is about 19.7 min, 8.3%. The dataset README also says 17.8, so Ben to decide whether to change
      the slides, the README, both, or neither.
- [x] AltoClef wording and the date (10 November): on slide 11 as "24 May 2021. The first bot to finish the
  game with no human input." Ben remembered it as the world's first computer-driven completion. "First bot" is
  what the sources support; "computer-driven" would also take in scripted input replays (TAS), which weren't checked.
- [x] Area 1: what was tried before the MCP server. Dropped with the area cards on 12 November.
- [ ] "We died again and again, and nobody told the model" notes: did Claude Code compact its context during the winning run? The notes say compaction loses
      nothing; say it happened only if it did.
- [ ] Slide 29: were the physics fixes sent upstream, or do they live in the forks?
- [ ] Slide 29: the Baritone rewrite is the worked example; pick the one break → scenario → fix to tell from it.
- [ ] "We died in the middle of a job" notes: confirm the name of the combat package collection.
- [ ] Part 6, Baritone (Ben): he remembered "10 or 30× slower, about 4× after optimising" and called it a port. Measured:
      30–60× (3 Sep, by hand), 4.1× that afternoon, 11.9× on 8 Sep, 2.7× on 9 Sep; and the code follows Baritone's
      design without translating its source. The slides use the measurements and say "follow" and "rebuild".
      Ben to confirm both, and whether to credit anyone besides leijurv by name. The 30–60× is from the 3 Sep
      Claude Code session (hand-timed: "roughly 30 times faster per node" on the flat world, "about 60 times more"
      per node on the hilly one), not from a commit; `9f57abb1` supports only "from about 5" nodes per ms.
- [ ] Limits: reruns of the winning commit, and a Gemini attempt, if either happens.
- [x] Pokémon section: the example clip for slide 7 is in (10 November), cut from a Claude Plays Pokémon clip on
      Twitch. See "Clips". Still Ben's call: whether it goes in the published copy, and whether he'd rather one of
      the other clips.
- [ ] Pokémon section: Ben to watch the clip on slide 7 and say if it's the right one.
- [ ] Pokémon section: slide 8 swapped the TIME headline for Google's Gemini 2.5 report so all three labs are up
      there. Ben hasn't seen that yet; the TIME capture is easy to put back.
- [ ] Pokémon section: check the Pichai I/O line against the keynote video if it's going to be quoted.
- [ ] Pokémon section: Anthropic published no hours, steps or code for the Fable 5 run. If asked, say so.
- [ ] Clips (below).

## Clips

H.264 MP4, no audio, 1280×720, a few MB each, in `site/media/`, except the dragon clip, which is 1080p with
sound. A missing file shows a labelled placeholder.

| File | Slide | Mode | What |
|---|---|---|---|
| `altoclef-dragon.mp4` | 11 | pop (Space), with sound | AltoClef beating the game: 26 s of TacoTechnica's "Bot Beats Minecraft for the First Time (Baritone Random Seed Any%)" (youtu.be/baAa6s8tahA, uploaded 31 May 2021, run streamed 24 May). The stream's own layout: the bot's view with AltoClef's status lines, a spectator camera, LiveSplit. From the dragon coming down to perch (split timer 3:07:36) through the kill (3:07:53, "Free the End") to the death beams (3:08:01). 720p60 is the video's top format; downloaded with yt-dlp, only 3:07:00–3:09:00, kept beside the cut as `altoclef-3h07-3h09-720p.webm`. The sound (added 12 November) is the stream's own: TacoTechnica commentating live over the game sound, "about to witness Minecraft history … first non-human to beat the game … oh no, we hit an enderman … yes baby, let's go … world record", no music; the swearing on the stream comes about 8 s after the clip ends. It comes from a second download with video and audio together (`altoclef-3h07-3h09-720p-av.mkv`, in sync), lined up on the frames; the picture is the same frames as before. `loudnorm` to −16 LUFS, 0.3 s fade in, 0.7 s fade out, AAC 160k at 48 kHz, like `dragon-reaction.mp4`. Cut by the last two commands in `cut.sh`. Standard YouTube licence, not CC: used with credit (Ben's call, 11 November). If the deck is published, it's his call whether this clip goes in the published copy. |
| `dragon-reaction.mp4` | 12 | play (Space), with sound | 30 s of the stream: game, Ben's webcam and his mic. From "First time an LLM would have ever beaten Minecraft" through the kill to "We did it!". Run time 3:56:04–3:56:34. |
| `altoclef-dragon-silent.mp4` | 11 with `?silent` | pop (Space) | The same 26 s, the same frames, no sound: the first cut, kept for a room with no speakers. |
| `dragon-kill.mp4` | 12 with `?silent` | play (Space) | The silent fallback: 28 s of the screen recording, ending on the dragon's death. Run time 3:55:35–3:56:15. |
| `pokemon-example.mp4` | Minecraft is a harder problem | pop (Space), optional | 18 s of the Claude Plays Pokémon stream (Anthropic's, on Twitch, the one the first headline is about), the early 2025 layout: the model's thinking and tool calls on the left, Pokémon Red on the right, the buttons pressed along the top, step count 27,973. It tries three times to walk up to someone outside the Cerulean gym and talk to them. Cut from 0.5 s to 18.5 s of the Twitch clip "Claude jumps back to Cerulean city" (twitch.tv/claudeplayspokemon/clip/DiligentWildVampireWoofer-7QnY4Da4FuDgFKiM, 25 s, listed as two years old on 10 November 2026), scaled from 1080p to 720p with the sound dropped. Viewers' emotes drift across it; they're part of the stream. The model is Claude 3.7 Sonnet, the one the stream launched with in late February 2025, and the moment is the one GamesRadar wrote up on 10 March 2025 (gamesradar.com, "after escaping Cerulean City after tens of hours, it went right on back"): after dozens of hours trying to leave the city it got through the house, then jumped down a ledge back into the city to talk to someone outside the gym. The clip shows it walking up to that person, not the jump. It's the channel's most watched clip (29,242 views on 10 November 2026). The date and model are from the article and the stream's history, not from the clip page, which only says "2 years ago". How it was got: the clip page opened in the installed Chromium and the MP4 the player asks for fetched with curl; no downloader was run. The raw clip and two others ("Claude Plays Pokemon", 30 s, stuck against a fence in a forest; "ESCAPE", 40 s, the later Opus 4.7 layout leaving a cave) were in `/tmp/mine_talk/clip/raw/`, which won't outlast a reboot. Someone else's footage: see the rules under "Why this problem". |
| `how-to-win.mp4` | 5 | route (Space plays it through) | 48 s, 24 hard-cut shots across the eight steps, for people who have never played. All first-person shots from two YouTube guides (CC BY), because the bot crafts without opening a screen and its run can't show most steps clearly. Ben talks over it. |
| `ladder-under-the-ocean.mp4` | 25 | loop, silent | The navigation rung. 13 s, 1280×720, game window only, cut from Stream 11 (5 August) by the coordinating session: CodexGatherer bobbing on the surface, then the camera dives to the sea floor and ends on the "CodexWarrior" nametag showing through the stone. Open sea with tropical fish and seagrass. Chat on screen in that stretch includes "<CodexWarrior> I am stranded underground at -314,35,-261" and "The reachable shaft is water … above my cavity". |
| `bug-drown.mp4` | 17 | pop (Space) | The actions example. 13.5 s, Stream 10 (1 August), about 0:38:38 on stream: Ben asks the bot to keep navigating to new areas to find animals; the navigate action walks it out into the sea, it sinks to the seabed and stands there until chat reads "HandsFreeBot drowned" (the observer, off-frame, shows NAVIGATION_FAILED and the hearts falling). Ben, live: "And drowning... you're drowning, so quickly just navigate somewhere so it swims. Ah, you're dead." Three shots from the 4K display recording, game window only, below the voice HUD: 2341.5–2346.5 s (walking out to sea), 2368–2374 s (on the seabed), 2386.5–2390 s (the death line in chat; seagrass hides the bot by then). The water-safety reflex was added later that stream. Runner-up: the bot tunnelling out of its sand shelter into water and flooding the shaft (same stream, 1:35:44; `bugsctions-shelter-flood.mp4`). Previous pick, kept in `site/media/bug-sand.mp4`: 10.9 s of the sand collect action filtering out blocks with sand on top (Stream 13, 3:38), which shows the action thinking, not failing. |
| `bug-stair.mp4` | 17 | pop (Space) | The client example. 13 s, Stream 7 (21 July), Ben's first stream with the bot, test course "westbound_switchback_regression": a stone staircase in the sky with a glowstone finish pad at the top. The bot walks up the stairs (first 4 s), then stops one step below the pad and stands there for the rest. One take from the display recording, 1274.4–1287.4 s; the camera drifts a little twice. The game's chat line naming the course shows bottom left for the first 9 s. Ben, live, about 0:21:22 on the stream: "You see him sitting right there, not moving… He could just jump up here and get to the end, but he doesn't." The cause, traced later that stream: the bot's idea of its own width was a hair under the server's, so the server kept correcting it off the step. Fixed on 23–24 July as a contact rounding fix in prismarine-physics (pathfinder fork commits 9db0cde to 2598cd7). The same course was still stuck at 3:00 on that stream. Alternative kept in `bugs\` as `client-stair-bounce.mp4`: 8.6 s of the bot jumping again and again at a one-block step in a dark corridor ("alternating_two_drop_pillars", same stream, 0:22:36). |
| `minelabs-lava-steps-stock.mp4` | 19 | pop (Space), held | The before. 6.9 s, real time, silent: the stock mineflayer-pathfinder bot (written 17 November for this) on the lava stepping-stones course. It clips the lava on each hop, catches fire and dies in the lava after the fifth stone; it ends on the chat lines "Runner tried to swim in lava", "Runner left the game". One fixed spectator camera, cropped below the Mine Labs overlay and letterboxed to 1280x720. Raw, cut script, course and stock bot in `Google Talk Clips/minelabs/lava-steps/` (`take-course-2.mkv`, 24.1–31.0 s). |
| `minelabs-lava-steps-ours.mp4` | 19 | pop (Space), held | The after. 6.8 s, real time, silent: our navigation on the same course, same camera; across all six stones onto the gold pad at full health (the yellow line is its planned path, from the block-highlighter mod). Raw in the same folder (`take-course-2.mkv`, 14.1–20.9 s). |
| `navigation-loop.mp4` | 29 | silent loop | 5–10 s crossing awkward terrain. |
| `combat-loop.mp4` | 24 | silent loop | 5–10 s defending itself with no tool call. |
| `monument-loop.mp4` | 26 (optional, not wired in) | silent loop | The monument escape, run time 3:09–3:11. |

A pop clip (AltoClef, the Pokémon example on "Minecraft is a harder problem", slide 17, and the lava course's two runs in part 5) is a step. Each one has a thumbnail in its box from the start (its first frame, dimmed, with
a ▶), so you can see where it lives. Space on the step before it plays it big over the slide, growing out of that
thumbnail, which is left as an empty slot; when it ends it shrinks back into the thumbnail and fades, the thumbnail shows
the frame it stopped on, and the box turns red (slide 11's card turns green). ← puts it back to waiting. → reaches the step without playing it
(the box just turns red), and → during the clip lands it and moves on. On slide 17, Tools turns red on its own click;
Actions and Client turn red as their clips land. Both clips are cut by `cut_bugs.sh` in `Google Talk Clips\bugs\`.
On slide 11 the AltoClef clip lands in the AltoClef card instead, which gets a green edge (`.credit` on the figure).
A pop with `data-hold` (the lava course's two runs on "An integration test, in a 3D world", 17 November) doesn't land
when it ends: it stays up on its last frame, R replays it, and the next Space or → lands it and moves on. Its box can sit
in any `.pop-home` (not only a `.stack` or `.compare`), and thumbnails are drawn up to 640 px wide so a large one stays
sharp. Two pops can share one box (the first builds the thumbnail, the next reuses it); playing the next while a held
one is up is a cut, so the dimmed slide never shows between them.

A played clip waits with a "Space to play" label. Space starts and pauses it, and moves on once it has finished;
the arrows always move, so → skips a clip. It runs in the speaker window too, kept in step with the audience one
and always muted there.

The route clip is cut into parts by `data-segments` on its `<figure>`: "start,end,first[-last]" for each part, in
seconds, naming the chain steps it shows (counted from 0). Recut the file and these have to change with it.

| Part | Seconds | Chain steps lit | What's in shot |
|---|---|---|---|
| 1 | 0.0–6.8 | Wood | Punching a tree until the log breaks, crafting a crafting table in the inventory, putting it down, crafting a wooden pickaxe |
| 2 | 6.8–10.6 | Stone | Mining stone with the wooden pickaxe, crafting a stone pickaxe |
| 3 | 10.6–18.6 | Iron | Mining iron ore, smelting it in a lit furnace, crafting an iron pickaxe, crafting iron boots |
| 4 | 18.6–20.6 | Diamonds | Mining diamond ore until the diamond drops |
| 5 | 20.6–32.4 | Nether | Pouring water on lava, mining the obsidian, placing the portal frame, lighting it, arriving in the Nether, killing blazes until the rods drop |
| 6 | 32.4–37.5 | Pearls | Killing an enderman, crafting eyes of ender |
| 7 | 37.5–42.5 | Stronghold | Throwing an eye of ender, the last eyes going in until the End portal opens |
| 8 | 42.5–48.5 | Ender Dragon | The dragon flying over, perched and breathing, then the death beams |

Each part is also its own MP4, and `cut_route3.sh` re-cuts them all, joins them and prints the new
`data-segments`. All of it is on Ben's PC in `Videos\AIBengineering\2026-09-17 - Beat the game\Post Stream\Google Talk Clips\`
(parts in `route3\`). Every shot comes from two YouTube videos marked CC BY, of which only the needed sections were
downloaded on 10 and 11 November with yt-dlp into `route2\src\`: The Aeon Arc, "The ONLY Minecraft Survival Guide You'll Ever
Need in 2026!" (youtu.be/OqI2VPr0_4s; 60–140, 370–430, 505–545, 745–780, 820–895, 1180–1232 and 1335–1500 s) and
Schmizzle, "A Perfect Start To MINECRAFT" (youtu.be/GmpdcZ0ziq8, 665–712 s). CC BY allows reuse, including in a
published copy, as long as both are credited; the credits slide does that and must keep doing it. The guides have
burned-in captions, toasts and a boss bar, so their shots are cropped in (1.33x for play, 1.5x on the crafting screens),
and a dot or two of caption can still show at the bottom of a crafting shot. No shot puts the iron armour on the player;
the iron step ends on crafting the boots. The thrown eye of ender is small on screen. Earlier versions are kept:
`how-to-win-v1.mp4` (35 s, all from the bot's run, with `cut_route.sh` and `route\`) and `how-to-win-v2.mp4` (33 s,
YouTube for Wood to Diamonds and the bot's run from the Nether on, with `cut_route2.sh` and `route2\`).

Run times are measured from the bot joining the world; the recording will be offset from that. `cut.sh` in the
same folder cuts the other clips. `dragon-reaction.mp4` comes from the stream recording, which runs about 1 s
behind the screen recording, with the stream's mixed audio brought down to -16 LUFS.

## Voice

Ben's feedback on the first draft (9 November): too text heavy, and the writing sounded like AI. The slides are in
his voice, not a polished one.

- One heading and one visual or number per slide. Explanations go in the speaker notes, not on the slide.
- First person, plain words, contractions ("I didn't touch it", "the easy bit"). Australian spelling.
- Use his own phrases where he has said them: "bite-sized problems", "it underpins everything, and it was the most
  unreliable at first", "basically rewriting Baritone in TypeScript", "lots of scenarios, much iterating".
- No slogans, no neat contrast pairs ("X, not Y"), no rule-of-three flourishes, no summing-up line at the bottom.
- No put-on slang either. If he hasn't said it, don't write it for him.

## Run database explorer (appendix)

- Slide 36 loads nothing until "Load the database" is pressed. Then `explorer.js` fetches sql.js and
  `site/data/bot-data.sqlite.gz` (2.4 MB) and runs every query in the browser, on a copy in memory.
- The database is `bot-data.sqlite` from the Hugging Face dataset, unmodified, gzipped with `gzip -9 -n`.
  Original sha256 `14aecd03902d48dc0c84c71dc01f8a16a4ac835f88e79428cff94b0f044af2e0`, 21.4 MB. Licence cc-by-4.0.
- `site/vendor/sqljs/` is sql.js 1.15.2 (MIT, licence file alongside), copied from the npm tarball after
  checking its published sha512.
- It needs a web server (the wasm file cannot be fetched from `file://`). The rest of the deck does not.
- Database values are only ever written with `textContent`. Escape gives the arrow keys back to the deck.

## How the deck works

- Published (14 November): github.com/aibengineering/mine-ai-talk, public, with GitHub Pages at
  aibengineering.github.io/mine-ai-talk from `.github/workflows/pages.yml` on every push to main. Ben chose to
  publish everything, including the Pokémon clip, the Pikachu icon, the AltoClef clip and the headline screenshots,
  all credited on the credits slide. TODO chips start hidden off the homelab (T shows them). `.gitignore` keeps out
  `tools/shots/`, the lock, the edit log, WORKERS.md and the service file.
- `site/` is the whole deck: `index.html` (slides and speaker notes), `deck.css`, `deck.js`, `explorer.js`,
  `media/`, `data/`, `vendor/`. No build step, relative URLs only, nothing fetched from other sites, so it runs
  from GitHub Pages or any static host. Opening `index.html` from disk works for everything but the appendix.
- `server.ts` serves `site/` with Bun (Range support for video). Run it by hand, no service needed:
  `HOST=127.0.0.1,<tailnet-host> PORT=8850 bun server.ts`. `mine-ai-talk.service` is an unused
  user unit kept in case that changes.
- Keys: arrows or Space to move, Shift+→ or Shift+← to jump a whole slide past its steps, F fullscreen, S speaker view (notes, next slide, timer and pace),
  Space or K play or pause a clip, R restart clip, M mute, T hide TODO chips. On a phone: a tap on the right does what Space does (plays clips and pops), a tap on the left goes back, and a swipe is → or ←, so it skips clips. The cues say "Tap" instead of "Space" on a touch screen.
  `?silent` on the URL plays the dragon clip's silent fallback.
- **The Space cue:** a chip in the middle of the footer, "▶ Space to play", lit whenever the next Space plays
  something: a played clip or the route montage that hasn't started, or a pop clip that's the next step, which it
  names ("▶ Space to play: Actions"). Ben asked for it on 11 November, since several slides play clips on Space with
  nothing on screen saying so. Played clips also keep their own big "▶ Space to play" label.
- **Paused clips show it:** a clip that has started and is paused short of its end (Space, K, a click, or the
  other window) gets `.paused` (`syncPaused` in `deck.js`), which lights a small green "❚❚" chip in the clip's
  top-right corner. The same chip is the play/pause button: faint on hover while the clip plays, click it to pause
  or resume. Nothing dims or covers the frame, because Ben pauses to point at things in it (his call, 12
  November, after a first try with a big centre box). The footer cue says "▶ Space to resume" (seen on pop slides;
  the footer is hidden on full-screen clips and the running route). Played clips keep their bar button too. Every
  click goes through `clipCommand`, same as Space, so the speaker window follows. Loops (slides 7, 24, 29) have the chip too since 12 November
  (Ben: every video should pause the same way); K pauses them as well, Space resumes a paused loop but otherwise still moves on, and the
  speaker window's loops stay still. On a touch screen the chip is always faintly shown, since there's no hover. None of it shows on a pop that →
  lands mid-play, nor a clip that has run to its end. Hidden in print and in `tools/shoot.mjs`. Ben asked for it
  on 12 November: a paused clip used to just look frozen.
- **The route's steps are buttons:** on slide 5, a click or tap on a step's icon in the chain (or its number key,
  1–8, while the slide is up) jumps the clip to the start of that step's part (`routeSeek` in `deck.js`, using
  `data-segments`). Paused, it stays paused on that frame; playing, not started or finished, it plays on from there.
  The lit step follows at once, and the speaker window jumps with it. A tap on a step never counts as a deck tap.
  The steps show a pointer and a green ring on hover once the clip has loaded, and nothing otherwise. Ben asked for
  it on 14 November, to go back to something he went past or skip ahead mid-talk.
- Print to PDF from the browser for a one-slide-per-page fallback.
- `tools/shoot.mjs` screenshots every slide and reports anything outside the safe area.
- `tools/make-qr.mjs` writes the QR code on the Questions slide. It needs the `qrcode` package from somewhere on
  `NODE_PATH`; the deck itself loads nothing.
- A number with `data-count` counts up when its slide opens (`data-as="hours"` or `"dollars"` for the format). The
  real text is in the HTML, so print, reduced motion and no-JS all show the final number.
- A step that only switches something on is an empty `<i class="step key-…">` straight under the slide, and the
  CSS keys off `.slide:has(.key-….shown)`. Anything revealed or animated this way needs a print rule and a
  reduced-motion rule.
- The Claude, Gemini and ChatGPT marks are inline SVG symbols at the top of `index.html`, used with `<use>` on
  slides 8 and 15. No image files, nothing fetched.

## Look

Ben's direction (10 November): Minecrafty and a bit futuristic, pixel fonts, crisp terminal style, Minecraft
icons like the ones in DeepMind's Argon paper (arXiv 2610.22319). Dark only for now; light or dark for the
room gets decided once the presenting setup is known.

- **Surface:** the End. `#15121c`, panels `#211c2d`, terminal panels `#0b0910`. Accent is terminal green `#7ee2a0`.
- **Pixel type (Monocraft, regular weight):** `h1` only, which is the title, the question, the chapter cards and Questions. Ben found
  it hard to read for detail (10 November), and it is: A reads like R, K like H. Sizes are multiples of 9 px so
  the font's pixels stay square.
- **Terminal type (Departure Mono):** slide headings (`h2`, `h3`), big numbers, the toast, anything the model reads
  or writes (the prompt, receipts, its quotes), kickers, links, the footer. Sizes are multiples of 11 px.
  One-pixel hard drop shadow on headings and numbers, like the game.
- **Plain system font:** body text, step labels, chart labels, the explorer's table. Never set these in a pixel font.
- **Panels** are square with a Minecraft GUI bevel (light top and left, dark bottom and right). No rounded corners.
- **Icons:** the Pixel Perfection texture pack by XSSheep and Nova_Wostra, CC BY-SA 4.0, the same pack the Argon
  paper used. It is the pack's own pixel art, not Mojang's, so "no Mojang artwork" still holds. Files in
  `site/vendor/pixel-perfection/` are copied unchanged (see `CREDITS.txt` there); the deck only crops and scales
  them in CSS. An edited icon would have to be shared under BY-SA too. The credit and the not-affiliated line are
  on the appendix credits slide (the last one) and must stay. The grass block on slide 9 is the pack's two grass
  textures; the top one is grey in the pack, as it is in the game, and `deck.css` colours it green with a blend
  over the unedited file.
- **The Pikachu on slide 9 is not from the pack.** It's drawn for the talk (`tools/draw-pikachu.py`), lives in
  `site/art/`, and shares the Pokémon line on the credits slide with the slide 7 clip.
- **The dragon is the one thing that isn't an icon.** `site/art/ender-dragon.png` (the route slide) and
  `site/art/dragon-head.png` (title hotbar, show of hands, the win toast) are renders of the pack's own dragon
  texture on a box model, made by `tools/render-dragon.mjs` and `tools/dragon.html` (the usage line is at the top of
  the script; it needs Playwright and a copy of Three.js, which the deck itself never loads). They are adaptations
  of the pack's art, so they are CC BY-SA 4.0 as well, and the credits slide says so.
- Icons are drawn at whole multiples of their size (16 px items, 9 px HUD sprites) with `image-rendering: pixelated`.
  Blocks are CSS cubes from the pack's face textures (`.cube`), items sit in inventory slots (`.slot`).
- The progress bar is the game's XP bar. The win gets an advancement toast, and so do the three facts on
  the intro slide, which is also where people who haven't played first see one. The game's three headings are used:
  "Advancement Made!" (the win), "Goal Reached!" and, in pink, "Challenge Complete!" (the intro).
- **Fonts:** `site/vendor/fonts/`, both SIL OFL 1.1 with licence files alongside. Monocraft 4.2.1 (Idrees Hassan),
  Departure Mono 1.500 (Helena Zhang).
- **The chapter cards** (slides 3, 6, 10, 14, 19 and 30) use the look the area openers had: an icon from the pack,
  a green "Part N of 7" line, the question in the pixel font and one line under it. The list on the right uses the
  same boxes as the layer strip: green for this part, a tick for the ones already done. Between cards it folds down to
  a rail of 44 px numbered boxes in the right margin, and opens and folds in under half a second.
- **The headline cards on slide 8** are the one place with paper-coloured panels. They're meant to look cut out of
  somewhere else. Each drops in a little crooked, next to its date on the line: a square marker on the line, a stem
  to the card and the date beside the stem in terminal type, green for the last one.
- One idea per slide. Charts use the five-colour palette in `deck.css` in fixed order (checked against the new
  surface with the dataviz validator); text never takes a series colour. Chart marks are square-ended to match.
  `--series-mute` is a grey for bars that are there for scale and aren't the point (slides 32 and 37).

## Part-card subtitles are teases (17 November)

Ben: "i am wondering if these subtitles SHOULD be giving the answer? should this be more fun?" The six part cards now carry a short tease instead of a summary, with no full stop: 1 "No tutorial included", 2 "Because Pokémon was taken", 3 "Spoiler: yes", 4 "Badly, at first" (this card had none before), 5 "By watching it die a lot", 6 "Whatever broke that week". Earlier lines in this file that quote the old summaries describe the cards before this change. On the same day card 6 became "We died at least 312 times during development", with a line of small print giving the count's scope, when part 6 became the "We died…" ladder.
