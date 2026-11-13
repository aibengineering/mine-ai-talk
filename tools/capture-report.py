# The three crops on the Google card of the headlines slide, taken from the PDF of the Gemini 2.5 report.
#   uv run --no-project --with pymupdf python -I tools/capture-report.py <report.pdf> <outDir>
# The PDF is https://storage.googleapis.com/deepmind-media/gemini/gemini_v2_5_report.pdf (arXiv 2507.06261v1).
import sys

import pymupdf

src, out = sys.argv[1], sys.argv[2]
doc = pymupdf.open(src)
ZOOM = 4
LEFT, RIGHT = 55, 540  # the text column, with a little margin


def crop(page, rect, name):
    pix = page.get_pixmap(matrix=pymupdf.Matrix(ZOOM, ZOOM), clip=rect, alpha=False)
    pix.save(f"{out}/{name}.png")
    print(name, pix.width, pix.height, [round(v) for v in rect])


# First page: the Google DeepMind logo and the rule under it.
first = doc[0]
logo = pymupdf.Rect(first.get_image_info()[0]["bbox"])
crop(first, pymupdf.Rect(LEFT, logo.y0 - 6, RIGHT, logo.y1 + 9), "google-logo")

# The page with section 4.1: the chapter heading and the section heading, cropped narrow so they come out large.
needle = "4.1. Gemini Plays Pokémon"
page = next(p for p in doc if p.search_for(needle))
heading = page.search_for(needle)[0]
chapter = page.search_for("4. Example use cases of Gemini 2.5 Pro")[0]
crop(page, pymupdf.Rect(LEFT, chapter.y0 - 8, 340, heading.y1 + 8), "google-section")

# Three lines of that section, with the sentence about finishing the game highlighted. The yellow goes under the text.
sentence = "Gemini 2.5 Pro completed the game after 813 hours and entered the Hall of Fame to become the Pokémon League Champion!"
above = page.search_for("has made, particularly")[0]
parts = page.search_for(sentence, clip=pymupdf.Rect(LEFT, above.y0, RIGHT, above.y1 + 40))
assert len(parts) == 2, parts
for part in parts:
    page.draw_rect(part + (-1, 0, 1, 0), color=None, fill=(1, 0.894, 0.361), overlay=False)
# The lines are 13.5 pt apart, so a margin of more than 2 pt would catch the edges of the lines above and below.
crop(page, pymupdf.Rect(LEFT, above.y0 - 2, RIGHT, parts[-1].y1 + 1.5), "google-quote")
