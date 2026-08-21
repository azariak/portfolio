"""
Generate the Open Graph / Twitter link-preview card.

The site's gold dot-art portrait only exists as a CSS composite: `.hero-dotart`
paints `background-color: var(--accent)` and punches it through the alpha
channel of `portrait-gold-mask.png`. There is no standalone gold image on disk,
so link previews (which can't run CSS) need that composite baked into a file.

This script renders it at the 1200x630 size social crawlers expect, laid out to
mirror the hero: eyebrow, stacked name, gold rule, subtitle on the left; the
gold halftone portrait on the right.

Usage (run from the `portfolio/` directory):
    python scripts/generate_og_card.py

Requires: pillow.

Inputs : public/portrait-gold-mask.png  (alpha-channel halftone mask)
Outputs: public/og-card.png             (1200x630 preview card)
"""

from PIL import Image, ImageDraw, ImageFont

# ---- Canvas (the 1.91:1 ratio OG/Twitter render at) ----
W, H = 1200, 630

# ---- Palette (mirrors the dark-mode tokens in src/index.css) ----
BG = (12, 10, 8)           # --bg        #0c0a08
TEXT = (240, 235, 226)     # --text      #f0ebe2
MUTED = (138, 126, 109)    # --text-muted #8a7e6d
ACCENT = (201, 169, 110)   # --accent    #c9a96e

# ---- Dot-art placement ----
DOT_H = 520                # rendered height of the halftone portrait
DOT_RIGHT = 1118           # right edge x
DOT_OPACITY = 0.78         # site uses 0.38; pushed up so it survives thumbnail scaling

# ---- Text layout ----
PAD_L = 88
INDENT = 54                # second name line, matching .hero-name-indent

SRC = "public/portrait-gold-mask.png"
DST = "public/og-card.png"

# Cormorant Garamond / DM Sans are webfonts, so approximate with local faces.
SERIF = "C:/Windows/Fonts/cambria.ttc"
SANS = "C:/Windows/Fonts/segoeui.ttf"


def tracked_text(draw, xy, text, font, fill, tracking):
    """Draw text with manual letter-spacing; returns the advance width."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x - tracking - xy[0]


def main():
    card = Image.new("RGB", (W, H), BG)

    # ---- Gold halftone portrait, right side ----
    mask = Image.open(SRC).split()[3]  # alpha holds the dots
    ratio = mask.width / mask.height
    dot_w = round(DOT_H * ratio)
    mask = mask.resize((dot_w, DOT_H), Image.LANCZOS)
    mask = mask.point(lambda a: int(a * DOT_OPACITY))

    gold = Image.new("RGB", (dot_w, DOT_H), ACCENT)
    card.paste(gold, (DOT_RIGHT - dot_w, (H - DOT_H) // 2), mask)

    draw = ImageDraw.Draw(card)

    f_name = ImageFont.truetype(SERIF, 104)
    f_eyebrow = ImageFont.truetype(SANS, 21)
    f_sub = ImageFont.truetype(SANS, 27)

    # ---- Eyebrow ----
    y = 118
    tracked_text(draw, (PAD_L, y), "TORONTO, CANADA", f_eyebrow, ACCENT, 3.4)

    # ---- Name, stacked and indented like the hero ----
    y += 62
    draw.text((PAD_L, y), "Azaria", font=f_name, fill=TEXT)
    y += 116
    draw.text((PAD_L + INDENT, y), "Kelman", font=f_name, fill=TEXT)

    # ---- Gold rule ----
    y += 152
    draw.rectangle([PAD_L, y, PAD_L + 76, y + 2], fill=ACCENT)

    # ---- Subtitle ----
    y += 34
    draw.text((PAD_L, y), "Computer Science & Philosophy", font=f_sub, fill=MUTED)
    draw.text((PAD_L, y + 38), "University of Toronto", font=f_sub, fill=MUTED)

    card.save(DST, optimize=True)
    print(f"Wrote {DST} ({W}x{H})")


if __name__ == "__main__":
    main()
