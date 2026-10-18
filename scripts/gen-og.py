"""生成品牌素材：docs/public/avatar.png（512）与 docs/public/og.png（1200x630）。

用法：python scripts/gen-og.py
只依赖 Pillow + numpy。
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "docs" / "public"

BG = (251, 250, 246)
INK = (23, 73, 59)
BRAND = (47, 122, 99)
MUTED = (78, 86, 82)
LINE = (220, 216, 204)
DOT = (185, 236, 216)

YAHEI = "C:/Windows/Fonts/msyh.ttc"
YAHEI_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"

SS = 2  # 超采样倍数


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def gradient(size: int) -> Image.Image:
    """左上深、右下浅的对角渐变。"""
    t = np.linspace(0, 1, size)
    xx, yy = np.meshgrid(t, t)
    k = np.clip((xx + yy) / 2, 0, 1)

    start = np.array([15, 61, 49], dtype=float)
    end = np.array([99, 179, 148], dtype=float)
    rgb = start[None, None, :] + (end - start)[None, None, :] * k[:, :, None]
    return Image.fromarray(rgb.astype("uint8"), "RGB")


def mark(size: int) -> Image.Image:
    """渐变方块 + 圆角折线 L + 右上角圆点。"""
    px = size * SS
    base = gradient(px)

    # L：两段圆头折线
    overlay = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    stroke = int(22 / 240 * px)
    pts = [(int(92 / 240 * px), int(70 / 240 * px)), (int(92 / 240 * px), int(150 / 240 * px)), (int(156 / 240 * px), int(150 / 240 * px))]
    draw.line(pts, fill=(255, 255, 255, 255), width=stroke, joint="curve")
    for x, y in (pts[0], pts[-1]):
        r = stroke / 2
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, 255))

    dot_r = int(9 / 240 * px)
    cx, cy = int(168 / 240 * px), int(74 / 240 * px)
    draw.ellipse((cx - dot_r, cy - dot_r, cx + dot_r, cy + dot_r), fill=DOT + (255,))

    base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
    return base.resize((size, size), Image.LANCZOS)


def rounded(img: Image.Image, radius: int) -> Image.Image:
    size = img.size[0]
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def build_avatar() -> None:
    img = mark(512)
    img.save(PUBLIC / "avatar.png", optimize=True)
    print("wrote avatar.png")


def build_og() -> None:
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), BG)

    tile = rounded(mark(300), 68)
    img.paste(tile, (830, 165), tile)

    draw = ImageDraw.Draw(img)
    draw.text((80, 132), "LINY · BLOG", font=font(YAHEI_BOLD, 22), fill=BRAND)
    draw.text((74, 190), "Liny", font=font(GEORGIA_BOLD, 170), fill=INK)
    draw.text((80, 402), "写代码，也写生活", font=font(YAHEI_BOLD, 38), fill=MUTED)
    draw.line([(80, 486), (700, 486)], fill=LINE, width=2)
    draw.text((80, 512), "yqlg.github.io/blog", font=font(YAHEI, 24), fill=(138, 144, 139))

    img.save(PUBLIC / "og.png", optimize=True)
    print("wrote og.png")


if __name__ == "__main__":
    build_avatar()
    build_og()
