import argparse
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "assets" / "truck-var-logo.png"
ICON_DIR = ROOT / "icons"
ANDROID_DENSITIES = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}
ANDROID_ADAPTIVE_DENSITIES = {
    "mdpi": 108,
    "hdpi": 162,
    "xhdpi": 216,
    "xxhdpi": 324,
    "xxxhdpi": 432,
}
ADAPTIVE_BACKGROUND = "#001D3B"


def square_logo(source, size):
    return ImageOps.fit(source, (size, size), method=Image.Resampling.LANCZOS)


def prepare_pwa_icons(source):
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    for size, name in (
        (192, "app-icon-192.png"),
        (512, "app-icon-512.png"),
        (180, "apple-touch-icon.png"),
    ):
        square_logo(source, size).save(ICON_DIR / name, optimize=True)

    maskable = Image.new("RGB", (512, 512), ADAPTIVE_BACKGROUND)
    safe_logo = ImageOps.contain(source, (368, 368), method=Image.Resampling.LANCZOS)
    maskable.paste(safe_logo, ((512 - safe_logo.width) // 2, (512 - safe_logo.height) // 2))
    maskable.save(ICON_DIR / "app-icon-maskable-512.png", optimize=True)


def prepare_android_icons(source, android_dir):
    resource_dir = android_dir / "app" / "src" / "main" / "res"
    if not resource_dir.is_dir():
        raise FileNotFoundError(f"Android resources not found: {resource_dir}")

    for density, size in ANDROID_DENSITIES.items():
        mipmap_dir = resource_dir / f"mipmap-{density}"
        mipmap_dir.mkdir(parents=True, exist_ok=True)
        icon = square_logo(source, size)
        for name in ("ic_launcher.png", "ic_launcher_round.png"):
            icon.save(mipmap_dir / name, optimize=True)

        foreground_size = ANDROID_ADAPTIVE_DENSITIES[density]
        foreground = Image.new("RGBA", (foreground_size, foreground_size), (0, 0, 0, 0))
        safe_logo = ImageOps.contain(
            source,
            (int(foreground_size * 0.8), int(foreground_size * 0.8)),
            method=Image.Resampling.LANCZOS,
        ).convert("RGBA")
        foreground.alpha_composite(
            safe_logo,
            ((foreground_size - safe_logo.width) // 2, (foreground_size - safe_logo.height) // 2),
        )
        foreground.save(mipmap_dir / "ic_launcher_foreground.png", optimize=True)

    adaptive_dir = resource_dir / "mipmap-anydpi-v26"
    adaptive_dir.mkdir(parents=True, exist_ok=True)
    adaptive_xml = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
"""
    for name in ("ic_launcher.xml", "ic_launcher_round.xml"):
        (adaptive_dir / name).write_text(adaptive_xml, encoding="utf-8")

    values_dir = resource_dir / "values"
    values_dir.mkdir(parents=True, exist_ok=True)
    color_xml = f"""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">{escape(ADAPTIVE_BACKGROUND)}</color>
</resources>
"""
    (values_dir / "ic_launcher_background.xml").write_text(color_xml, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--android-dir", type=Path)
    args = parser.parse_args()

    with Image.open(SOURCE) as image:
        source = image.convert("RGB")
        prepare_pwa_icons(source)
        if args.android_dir:
            prepare_android_icons(source, args.android_dir.resolve())


if __name__ == "__main__":
    main()
