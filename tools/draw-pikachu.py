"""Draws the 16 x 16 Pikachu icon for the Pokémon and Minecraft slide and writes it as a PNG.

    python3 -I tools/draw-pikachu.py site/art/pikachu.png

It is drawn here, a pixel at a time, to sit next to the Pixel Perfection icons. It is not a sprite from the games.
Pikachu is still The Pokémon Company's character, so whether it goes in a published copy is Ben's call.
"""
import struct
import sys
import zlib

COLOURS = {
    '.': (0, 0, 0, 0),
    'K': (40, 32, 32, 255),      # ear tips, eyes, nose
    'O': (122, 84, 20, 255),     # outline
    'Y': (250, 214, 60, 255),    # yellow
    'S': (222, 170, 36, 255),    # yellow in shade
    'R': (232, 72, 52, 255),     # cheeks
    'W': (255, 255, 255, 255),   # the light in the eyes
    'M': (150, 70, 50, 255),     # mouth
}

ROWS = [
    '.KK..........KK.',
    '.KKK........KKK.',
    '.OYKO......OKYO.',
    '.OYYO......OYYO.',
    '..OYYO....OYYO..',
    '..OYYYOOOOYYYO..',
    '..OYYYYYYYYYYO..',
    '.OYYYYYYYYYYYYO.',
    '.OYWKYYYYYYWKYO.',
    '.OYKKYYKKYYKKYO.',
    '.ORRYYYYYYYYRRO.',
    '.ORRYMYMMYMYRRO.',
    '.OSYYYMYYMYYYSO.',
    '..OSYYYYYYYYSO..',
    '...OOSSSSSSOO...',
    '.....OOOOOO.....',
]


def chunk(kind, data):
    body = kind + data
    return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body))


def main(path):
    assert len(ROWS) == 16 and all(len(row) == 16 for row in ROWS)
    raw = b''.join(b'\x00' + b''.join(bytes(COLOURS[c]) for c in row) for row in ROWS)
    png = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', 16, 16, 8, 6, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))
    with open(path, 'wb') as out:
        out.write(png)


if __name__ == '__main__':
    main(sys.argv[1])
