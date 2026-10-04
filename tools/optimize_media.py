"""
Prepare photos, renders and videos for the portfolio.

IMAGES  ->  assets/img/<slug>/<name>.webp      (max 2000 px, for full-screen view)
            assets/img/<slug>/<name>-sm.webp   (max 900 px, used on the page)
VIDEOS  ->  assets/video/<name>.mp4 (H.264, muted, web-optimized) + <name>-poster.jpg

Setup (once):
    pip install pillow imageio-ffmpeg

Usage:
    # every image in a folder -> assets/img/<slug>/ (names are slugified file names)
    python tools/optimize_media.py images "path/to/folder" <slug>

    # one image with a chosen name
    python tools/optimize_media.py image "path/to/photo.jpg" <slug> <name>

    # a video clip: start and end in seconds, optional speed-up (e.g. 2 = 2x)
    python tools/optimize_media.py video "path/to/clip.mp4" <name> <start> <end> [speed]
"""
import os
import re
import subprocess
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp")


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def export_image(src, slug, name):
    out_dir = os.path.join(ROOT, "assets", "img", slug)
    os.makedirs(out_dir, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(src))
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    for suffix, max_dim, quality in (("", 2000, 80), ("-sm", 900, 74)):
        c = im.copy()
        c.thumbnail((max_dim, max_dim), Image.LANCZOS)
        c.save(os.path.join(out_dir, f"{name}{suffix}.webp"), "WEBP", quality=quality, method=6)
    print(f"  assets/img/{slug}/{name}.webp  (+ -sm)")


def ffmpeg_exe():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def export_video(src, name, start, end, speed=1.0):
    out_dir = os.path.join(ROOT, "assets", "video")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, name + ".mp4")
    vf = (f"trim=start={start}:end={end},setpts=(PTS-STARTPTS)/{speed},"
          "scale='if(gt(iw,ih),min(960,iw),-2)':'if(gt(iw,ih),-2,min(960,ih))',fps=30,format=yuv420p")
    ff = ffmpeg_exe()
    subprocess.run([ff, "-y", "-loglevel", "error", "-i", src, "-vf", vf, "-an", "-c:v", "libx264",
                    "-preset", "slow", "-crf", "27", "-movflags", "+faststart", out], check=True)
    subprocess.run([ff, "-y", "-loglevel", "error", "-ss", "1", "-i", out, "-frames:v", "1", "-q:v", "4",
                    os.path.join(out_dir, name + "-poster.jpg")], check=True)
    print(f"  assets/video/{name}.mp4  ({os.path.getsize(out) / 1e6:.1f} MB) + poster")


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return
    cmd = argv[1]
    if cmd == "images":
        folder, slug = argv[2], argv[3]
        for f in sorted(os.listdir(folder)):
            if f.lower().endswith(IMG_EXT):
                export_image(os.path.join(folder, f), slug, slugify(os.path.splitext(f)[0]))
    elif cmd == "image":
        export_image(argv[2], argv[3], argv[4])
    elif cmd == "video":
        speed = float(argv[6]) if len(argv) > 6 else 1.0
        export_video(argv[2], argv[3], float(argv[4]), float(argv[5]), speed)
    else:
        print(__doc__)


if __name__ == "__main__":
    main(sys.argv)
