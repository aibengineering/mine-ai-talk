# Mine AI talk

The slide deck for a talk at Google on 18 November 2026 about how Claude beat Minecraft with
[Mine AI MCP](https://github.com/aibengineering/mine-ai-mcp), the MCP server it played through.

**Live: https://aibengineering.github.io/mine-ai-talk/**

- `site/` is the whole deck: `index.html` (slides and speaker notes), `deck.css`, `deck.js`, clips in `media/`,
  and the winning run's database in `data/` for the appendix explorer. No build step, relative URLs only.
- Keys: → or Space for next, ← for back, S for the speaker view (notes and timer), F for fullscreen, T to toggle TODO chips.
- Run it locally with [Bun](https://bun.sh): `bun server.ts`, then open http://127.0.0.1:8850.
- `BRIEF.md` is the working brief: the talk's structure, timings, verified facts and sources.
- `tools/` holds the helper scripts used to build the deck (screenshots, headline captures, the QR code).

Third-party clips, screenshots and icons are credited on the deck's credits slide.
