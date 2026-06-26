"""
Generate the light-mode dot-art mask from the original (dark-mode) mask.

The hero portrait is a halftone: a regular 7px grid of dots whose *size*
encodes the portrait's tone (big dot = dark area, small dot = light area).
The dots live in the alpha channel of the PNG (RGB is solid white); the CSS
fills the mask with a gold color.

This script produces the LIGHT-mode variant, which is the dark-mode mask with:
  1. Dot sizes inverted (big <-> small) within the existing silhouette.
  2. The largest dots in the body's outer boundary layer removed.
  3. Boosted dot-size variance in the head region for more contrast.
  4. The largest dots on the head's outer boundary removed entirely.

Dark mode keeps the original mask untouched.

Usage (run from the `portfolio/` directory):
    python scripts/generate_light_dotart.py

Requires: numpy, pillow, scipy.

Inputs : public/portrait-gold-mask.png        (original / dark-mode mask)
Outputs: public/portrait-gold-mask-light.png  (light-mode mask)
"""

import numpy as np
from PIL import Image
from scipy.ndimage import convolve

# ---- Halftone grid parameters (detected from the original mask) ----
P = 7            # grid pitch in px
PX = PY = 3      # grid phase offset
MASS_MIN = 50    # min alpha-sum for a grid cell to count as an active dot

# ---- Tuning knobs ----
HEAD_END_ROW = 39      # grid rows above this index are the head/neck region
FACE_VARIANCE_GAIN = 1.45   # >1 amplifies head dot-size contrast
FACE_RADIUS_CAP = 3.2       # clamp boosted head radii (cell half-width = 3.5)
OUTER_NEIGHBOR_MAX = 6      # cell is "outer" if it has <= this many active neighbors
BODY_REMOVE_PCT = 45        # body outer dots >= this size percentile are removed
HEAD_OUTER_REMOVE_RADIUS = 2.5   # head outer dots >= this radius are removed
SUPERSAMPLE = 4             # anti-aliasing factor when rasterizing dots

SRC = "public/portrait-gold-mask.png"
DST = "public/portrait-gold-mask-light.png"


def main():
    alpha = np.array(Image.open(SRC))[:, :, 3].astype(float)
    H, W = alpha.shape
    rows = list(range(PY, H, P))
    cols = list(range(PX, W, P))
    R_, C_ = len(rows), len(cols)

    # Measure each grid cell's "mass" (alpha sum) -> proxy for dot area.
    active = np.zeros((R_, C_), bool)
    mass = np.zeros((R_, C_))
    for i, cy in enumerate(rows):
        for j, cx in enumerate(cols):
            y0, y1 = max(0, cy - 3), min(H, cy + 4)
            x0, x1 = max(0, cx - 3), min(W, cx + 4)
            m = alpha[y0:y1, x0:x1].sum()
            if m > MASS_MIN:
                active[i, j] = True
                mass[i, j] = m

    # Radius per dot (solid-disk approximation), then invert sizes.
    r = np.sqrt(mass / (255 * np.pi))
    r_min, r_max = r[active].min(), r[active].max()
    r_inv = np.where(active, r_min + r_max - r, 0.0)

    # Head region.
    head = np.zeros_like(active)
    head[:HEAD_END_ROW, :] = True
    head &= active

    # (1+3) Boost size variance in the head to pronounce features.
    mean_head = r_inv[head].mean()
    r_final = np.where(
        head,
        np.clip(mean_head + FACE_VARIANCE_GAIN * (r_inv - mean_head), 0, FACE_RADIUS_CAP),
        r_inv,
    )

    # Active-neighbor count (8-connectivity) -> identifies boundary cells.
    k = np.ones((3, 3))
    k[1, 1] = 0
    neigh = convolve(active.astype(int), k, mode="constant")

    # (2) Remove the larger dots in the BODY outer band.
    body_band = active & (neigh <= OUTER_NEIGHBOR_MAX) & (~head)
    body_thr = np.percentile(r_inv[body_band], BODY_REMOVE_PCT)
    remove = body_band & (r_inv >= body_thr)

    # (4) Remove the largest dots on the HEAD outer boundary entirely.
    head_band = head & (neigh <= OUTER_NEIGHBOR_MAX)
    remove |= head_band & (r_final >= HEAD_OUTER_REMOVE_RADIUS)

    keep = active & ~remove

    # Rasterize anti-aliased disks via supersampling, max-compositing.
    SS = SUPERSAMPLE
    big = np.zeros((H * SS, W * SS), np.float32)
    for i, cy in enumerate(rows):
        for j, cx in enumerate(cols):
            if not keep[i, j]:
                continue
            R = r_final[i, j] * SS
            if R < 0.3:
                continue
            pad = int(np.ceil(R)) + 1
            cyS, cxS = cy * SS + SS // 2, cx * SS + SS // 2
            y0, y1 = max(0, cyS - pad), min(H * SS, cyS + pad + 1)
            x0, x1 = max(0, cxS - pad), min(W * SS, cxS + pad + 1)
            ys, xs = np.ogrid[y0:y1, x0:x1]
            d2 = (ys - cyS) ** 2 + (xs - cxS) ** 2
            disk = (d2 <= R * R).astype(np.float32)
            big[y0:y1, x0:x1] = np.maximum(big[y0:y1, x0:x1], disk)

    # Downsample (box filter) for smooth edges.
    small = big.reshape(H, SS, W, SS).mean(axis=(1, 3))
    new_alpha = np.clip(small * 255, 0, 255).astype(np.uint8)

    out = np.zeros((H, W, 4), np.uint8)
    out[:, :, 0:3] = 255  # white RGB; CSS recolors via the mask fill
    out[:, :, 3] = new_alpha
    Image.fromarray(out, "RGBA").save(DST)

    removed_total = int(remove.sum())
    removed_head = int((head_band & (r_final >= HEAD_OUTER_REMOVE_RADIUS)).sum())
    print(f"Active dots: {int(active.sum())}")
    print(f"Removed total: {removed_total} (head outer: {removed_head})")
    print(f"Wrote {DST}")


if __name__ == "__main__":
    main()
