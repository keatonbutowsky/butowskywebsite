"""
Generate portrait crops + responsive image variants from family-photo.jpg.
Order in photo (L->R): Keaton, Megan, Ed, Dani, Lauren, Ben.

These are placeholders; Keaton plans to replace with real individual headshots.
Run: python scripts/make_portraits.py
Outputs: img/portraits/{name}.{webp,jpg} at multiple widths
         img/hero/{family-1280,1920,2560}.{webp,jpg}
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "family-photo.jpg"
OUT_PORTRAITS = ROOT / "img" / "portraits"
OUT_HERO = ROOT / "img" / "hero"
OUT_PORTRAITS.mkdir(parents=True, exist_ok=True)
OUT_HERO.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC)
img = ImageOps.exif_transpose(img).convert("RGB")
W, H = img.size
print(f"Source: {W}x{H}")

# Approx face center positions (cx, cy as fractions of W, H), tuned for this group photo.
faces = [
    ("keaton", 0.155, 0.275),
    ("megan",  0.275, 0.290),
    ("ed",     0.415, 0.290),
    ("dani",   0.575, 0.305),
    ("lauren", 0.700, 0.305),
    ("ben",    0.860, 0.260),
]

# 4:5 portrait, tightly framed on head + neckline so neighbors mostly fall outside.
# crop_w ~360 at H=1442 keeps single-face dominance given ~280-340px face spacing.
crop_h = int(H * 0.32)
crop_w = int(crop_h * 4 / 5)

def clamp_box(cx_frac, cy_frac):
    cx = int(W * cx_frac)
    cy = int(H * cy_frac)
    # Anchor crop so face sits in upper-third of the frame (classic portrait composition).
    top  = max(0, min(H - crop_h, cy - int(crop_h * 0.38)))
    left = max(0, min(W - crop_w, cx - crop_w // 2))
    return (left, top, left + crop_w, top + crop_h)

WIDTHS = [320, 640, 1024]

for name, cx_frac, cy_frac in faces:
    box = clamp_box(cx_frac, cy_frac)
    crop = img.crop(box)
    for w in WIDTHS:
        h = int(w * 5 / 4)
        resized = crop.resize((w, h), Image.LANCZOS)
        resized.save(OUT_PORTRAITS / f"{name}-{w}.webp", "WEBP", quality=82, method=6)
        resized.save(OUT_PORTRAITS / f"{name}-{w}.jpg",  "JPEG", quality=85, optimize=True, progressive=True)
    print(f"  {name}: {box} -> 3 widths")

# Hero variants (full image)
for w in [1280, 1920, 2560]:
    if w > W: w = W
    h = int(H * w / W)
    resized = img.resize((w, h), Image.LANCZOS)
    resized.save(OUT_HERO / f"family-{w}.webp", "WEBP", quality=82, method=6)
    resized.save(OUT_HERO / f"family-{w}.jpg",  "JPEG", quality=85, optimize=True, progressive=True)
    print(f"  hero-{w}")

# Tiny LQIP placeholder (24px wide, base64-friendly)
lqip = img.resize((24, int(H * 24 / W)), Image.LANCZOS)
lqip.save(OUT_HERO / "family-lqip.jpg", "JPEG", quality=40)

print("Done.")
