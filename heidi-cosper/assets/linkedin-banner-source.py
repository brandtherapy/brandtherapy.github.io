"""Render Heidi's 1584 x 396 LinkedIn banner from the existing approved art field."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
SIZE = (1584, 396)
source = Image.open(HERE / "linkedin-banner-legacy.png").convert("RGB")
canvas = Image.new("RGB", SIZE, "#0c1725")
canvas.paste(source.crop((1180, 0, 1584, 396)), (1180, 0))

# A broad ink field removes every letter of the previous position. Its edge
# fades into the retained bronze artwork, preserving the existing visual system.
mask = Image.new("L", SIZE, 0)
pixels = mask.load()
for x in range(1100, 1584):
    alpha = 255 if x < 1380 else int(255 * (1584 - x) / 204)
    for y in range(SIZE[1]):
        pixels[x, y] = max(0, alpha)
canvas.paste(Image.new("RGB", SIZE, "#0c1725"), (0, 0), mask)

draw = ImageDraw.Draw(canvas)
serif = "/System/Library/Fonts/Supplemental/Baskerville.ttc"
sans = "/System/Library/Fonts/Avenir Next.ttc"
audience_font = ImageFont.truetype(sans, 27)
main_font = ImageFont.truetype(serif, 106)
support_font = ImageFont.truetype(serif, 37)
service_font = ImageFont.truetype(sans, 23)

draw.text((390, 58), "FOR WOMEN IN LEADERSHIP", fill="#C79A65", font=audience_font, stroke_width=0)
draw.text((385, 91), "Lead from conviction", fill="#F8EFDF", font=main_font, stroke_width=0)
draw.text((390, 229), "Leadership coaching when responsibility outgrows the role", fill="#F8EFDF", font=support_font)
draw.line((390, 292, 490, 292), fill="#B68452", width=3)
draw.text((390, 303), "EXPONENTIAL IMPACT  |  PRESCOTT VALLEY", fill="#C9B89F", font=service_font)
canvas.save(HERE / "linkedin-banner.png", optimize=True)
