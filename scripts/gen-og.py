"""生成社交分享图 docs/public/og.png（1200x630）。

用法：python scripts/gen-og.py
仅依赖 Pillow + numpy，已经包含在 DSH 运行环境里。
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "public" / "og.png"

W, H = 1200, 630
BG = (251, 250, 246)
INK = (23, 73, 59)
BRAND = (47, 122, 99)
MUTED = (78, 86, 82)
LINE = (220, 216, 204)

YAHEI = "C:/Windows/Fonts/msyh.ttc"
YAHEI_BOLD = "C:/Windows/Fonts/msyhbd.ttc"
GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def gradient_tile(size: int) -> Image.Image:
    """左上深、右下浅的对角渐变，作为头像底色。"""
    x = np.linspace(0, 1, size)
    y = np.linspace(0, 1, size)
    t = np.clip((x[None, :] + y[:, None]) / 2, 0, 1)

    start = np.array([18, 61, 49], dtype=float)
    end = np.array([99, 179, 148], dtype=float)
    rgb = start[None, None, :] + (end - start)[None, None, :] * t[:, :, None]
    return Image.fromarray(rgb.astype("uint8"), "RGB")


def main() -> None:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # 右侧：圆角渐变方块 + 白色 L
    tile = gradient_tile(320)
    mask = Image.new("L", (320, 320), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 319, 319), radius=72, fill=255)
    img.paste(tile, (820, 155), mask)

    letter = Image.new("RGBA", (320, 320), (0, 0, 0, 0))
    d = ImageDraw.Draw(letter)
    f = font(GEORGIA_BOLD, 210)
    box = d.textbbox((0, 0), "L", font=f)
    d.text(((320 - (box[2] - box[0])) / 2 - box[0], (320 - (box[3] - box[1])) / 2 - box[1] - 14), "L", font=f, fill=(255, 255, 255, 240))
    img.paste(letter, (820, 155), letter)

    # 左侧文字
    draw.text((80, 132), "LINY · BLOG", font=font(YAHEI_BOLD, 22), fill=BRAND)

    draw.text((74, 196), "Liny", font=font(GEORGIA_BOLD, 168), fill=INK)
    draw.text((80, 400), "写代码，也写生活", font=font(YAHEI_BOLD, 38), fill=MUTED)

    draw.line([(80, 484), (700, 484)], fill=LINE, width=2)
    draw.text((80, 510), "yqlg.github.io/blog", font=font(YAHEI, 24), fill=(138, 144, 139))

    img.save(OUT, optimize=True)
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
