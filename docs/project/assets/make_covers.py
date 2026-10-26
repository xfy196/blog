# -*- coding: utf-8 -*-
"""宝宝链 · 公众号封面生成脚本（横版 / 竖版 / 方版）

用法：修改下方 TEXTS 后运行
    python make_covers.py
依赖：pip install pillow
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SCREENS = os.path.join(HERE, "screens")
OUT = os.path.join(HERE, "covers")
os.makedirs(OUT, exist_ok=True)

BG      = (251, 247, 240)   # 暖白纸感
INK     = (46, 42, 38)      # 深墨
TERRA   = (192, 93, 58)     # 陶土橙（主色）
MUTED   = (150, 128, 112)   # 淡棕提示色

SERIF = "C:/Windows/Fonts/Source Han Serif SC Heavy (TrueType).ttf"
SANS_B = "C:/Windows/Fonts/Noto Sans SC Bold (TrueType).otf"
SANS_M = "C:/Windows/Fonts/Noto Sans SC Medium (TrueType).otf"
SANS_R = "C:/Windows/Fonts/Noto Sans SC (TrueType).otf"

TEXTS = {
    "kicker":  "宝宝链 · 一个家庭共用的宝宝相册",
    "line1":   "宝宝的照片",
    "line2":   "都死在了家庭群里",
    "footer":  "不用下载，扫码就能用",
}


def F(path, size):
    return ImageFont.truetype(path, size)


def tracked(draw, xy, text, font, fill, tracking=0.0):
    """逐字绘制，支持字间距，返回绘制宽度"""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking
    return x - xy[0]


def tracked_width(text, font, tracking=0.0):
    return sum(font.getlength(c) + tracking for c in text) - tracking


def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.size[0] - 1, img.size[1] - 1],
                                           radius=radius, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def drop_shadow(canvas, size, radius, blur=28, dy=16, alpha=38, spread=2):
    w, h = size
    sh = Image.new("RGBA", (w + blur * 4, h + blur * 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(sh)
    d.rounded_rectangle([blur * 2 - spread, blur * 2 - spread,
                         blur * 2 + w + spread, blur * 2 + h + spread],
                        radius=radius + spread, fill=(60, 40, 30, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    return sh, (-blur * 2, -blur * 2 + dy)


def place(canvas, path, height, pos, radius=None):
    """按高度等比缩放手机截图，圆角+投影后贴到画布 pos(左上角)"""
    src = Image.open(path).convert("RGB")
    w = int(height * src.size[0] / src.size[1])
    im = src.resize((w, height), Image.LANCZOS)
    r = radius if radius is not None else int(w * 0.055)
    im = rounded(im, r)
    sh, off = drop_shadow(canvas, (w, height), r)
    canvas.alpha_composite(sh, (pos[0] + off[0], pos[1] + off[1]))
    canvas.alpha_composite(im, pos)
    return w


# ---------------- 横版 2.35:1（公众号首图） ----------------
def horizontal(W=1800, H=766):
    c = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(c)

    place(c, os.path.join(SCREENS, "family.png"), 700, (1030, 118))
    place(c, os.path.join(SCREENS, "album.png"), 700, (1310, 62))

    x = 118
    y = 132
    f_k = F(SANS_M, 27)
    d.ellipse([x, y + 9, x + 11, y + 20], fill=TERRA)
    tracked(d, (x + 23, y), TEXTS["kicker"], f_k, MUTED, 1.2)

    f_t = F(SERIF, 94)
    tracked(d, (x, 196), TEXTS["line1"], f_t, INK, 3)
    tracked(d, (x, 310), TEXTS["line2"], f_t, INK, 3)

    d.rectangle([x, 480, x + 66, 484], fill=TERRA)
    f_f = F(SANS_R, 30)
    tracked(d, (x + 88, 466), TEXTS["footer"], f_f, MUTED, 1.0)

    c.convert("RGB").save(os.path.join(OUT, "cover-horizontal-1800x766.png"), quality=95)
    return c


# ---------------- 竖版 3:4（朋友圈 / 小红书） ----------------
def vertical(W=1080, H=1440):
    c = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(c)

    place(c, os.path.join(SCREENS, "album.png"), 900, (96, 560))
    place(c, os.path.join(SCREENS, "family.png"), 900, (556, 560))

    x = 96
    y = 104
    f_k = F(SANS_M, 26)
    d.ellipse([x, y + 8, x + 10, y + 18], fill=TERRA)
    tracked(d, (x + 22, y), TEXTS["kicker"], f_k, MUTED, 1.0)

    f_t = F(SERIF, 92)
    tracked(d, (x, 172), TEXTS["line1"], f_t, INK, 2)
    tracked(d, (x, 288), TEXTS["line2"], f_t, INK, 2)

    d.rectangle([x, 438, x + 60, 442], fill=TERRA)
    f_f = F(SANS_R, 28)
    tracked(d, (x + 80, 424), TEXTS["footer"], f_f, MUTED, 1.0)

    c.convert("RGB").save(os.path.join(OUT, "cover-vertical-1080x1440.png"), quality=95)
    return c


# ---------------- 方版 1:1（分享卡片） ----------------
def square(W=1080, H=1080):
    c = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(c)

    src = Image.open(os.path.join(SCREENS, "album.png"))
    ph = int(src.size[0] * 780 / src.size[1])
    place(c, os.path.join(SCREENS, "album.png"), 780, ((W - ph) // 2, 424))

    f_k = F(SANS_M, 26)
    kw = tracked_width(TEXTS["kicker"], f_k, 1.0) + 32
    d.ellipse([(W - kw) / 2, 96, (W - kw) / 2 + 10, 106], fill=TERRA)
    tracked(d, ((W - kw) / 2 + 22, 87), TEXTS["kicker"], f_k, MUTED, 1.0)

    f_t = F(SERIF, 92)
    w1 = tracked_width(TEXTS["line1"], f_t, 2)
    tracked(d, ((W - w1) / 2, 152), TEXTS["line1"], f_t, INK, 2)
    w2 = tracked_width(TEXTS["line2"], f_t, 2)
    tracked(d, ((W - w2) / 2, 268), TEXTS["line2"], f_t, INK, 2)

    c.convert("RGB").save(os.path.join(OUT, "cover-square-1080x1080.png"), quality=95)
    return c


if __name__ == "__main__":
    horizontal()
    vertical()
    square()
    for f in sorted(os.listdir(OUT)):
        p = os.path.join(OUT, f)
        print(f, Image.open(p).size, f"{os.path.getsize(p)/1024:.0f}KB")
