# -*- coding: utf-8 -*-
"""把真实手机截图包成与其他界面截图一致的可嵌入卡片

用法：python wrap_screenshot.py <源图> <输出名>
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "screens")

BORDER = (232, 226, 216, 255)
SHADOW = (60, 40, 30, 34)


def autocrop(im, tol=8):
    """去掉四周近白的留白"""
    g = im.convert("RGB")
    w, h = g.size
    px = g.load()
    xs, ys = [], []
    for y in range(h):
        for x in range(0, w, 3):
            r, gg, b = px[x, y]
            if r < 255 - tol or gg < 255 - tol or b < 255 - tol:
                xs.append(x)
                ys.append(y)
    if not xs:
        return im
    box = (max(min(xs) - 2, 0), max(min(ys) - 2, 0),
           min(max(xs) + 4, w), min(max(ys) + 4, h))
    return im.crop(box)


def wrap(src_path, name, target_h=1600, radius_ratio=0.052, pad=44):
    im = Image.open(src_path).convert("RGB")
    im = autocrop(im)
    w, h = im.size
    tw = int(w * target_h / h)
    im = im.resize((tw, target_h), Image.LANCZOS)

    r = int(tw * radius_ratio)
    mask = Image.new("L", (tw, target_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, tw - 1, target_h - 1],
                                           radius=r, fill=255)
    card = im.convert("RGBA")
    card.putalpha(mask)

    d = ImageDraw.Draw(card)
    d.rounded_rectangle([0, 0, tw - 1, target_h - 1], radius=r,
                        outline=BORDER, width=2)

    canvas = Image.new("RGBA", (tw + pad * 2, target_h + pad * 2), (0, 0, 0, 0))
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle(
        [pad - 2, pad + 10, pad + tw + 2, pad + target_h + 14],
        radius=r + 2, fill=SHADOW)
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(sh)
    canvas.alpha_composite(card, (pad, pad))

    os.makedirs(OUT_DIR, exist_ok=True)
    dst = os.path.join(OUT_DIR, name)
    canvas.save(dst)
    print(name, canvas.size, f"{os.path.getsize(dst)/1024:.0f}KB")


if __name__ == "__main__":
    src = sys.argv[1] if len(sys.argv) > 1 else \
        r"C:\Users\Administrator\.workbuddy\clipboard-images\clipboard-2026-10-26T15-22-05-804Z-c7906130.png"
    name = sys.argv[2] if len(sys.argv) > 2 else "ai.png"
    wrap(src, name)
