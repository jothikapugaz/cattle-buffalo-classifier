"""Audit the final cattle/buffalo image-classification dataset.

Expected directory layout:
    dataset/
      cattle/
      buffalo/

The script does not modify the dataset. It reports class counts, image
formats, color channels, dimensions, aspect ratios, and basic integrity
information so the project documentation can use measured values instead of
hard-coded assumptions.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Iterable

from PIL import Image, UnidentifiedImageError

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tif", ".tiff"}
EXPECTED_CLASSES = ("cattle", "buffalo")


def iter_images(folder: Path) -> Iterable[Path]:
    """Yield supported image files recursively in a folder."""
    if not folder.exists():
        return
    for path in sorted(folder.rglob("*")):
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            yield path


def channel_name(mode: str) -> str:
    """Map Pillow image modes to the project channel categories."""
    if mode == "RGB":
        return "RGB"
    if mode == "RGBA":
        return "RGBA"
    if mode in {"1", "L", "I", "F", "I;16"}:
        return "Grayscale"
    return mode


def audit_class(class_dir: Path) -> dict:
    """Collect measurable statistics for one class directory."""
    images = list(iter_images(class_dir))
    extensions = Counter()
    channels = Counter()
    resolutions = Counter()
    aspect_ratios = Counter()
    corrupt = []

    for path in images:
        extensions[path.suffix.lower().lstrip(".")] += 1
        try:
            with Image.open(path) as image:
                image.verify()
            with Image.open(path) as image:
                width, height = image.size
                channels[channel_name(image.mode)] += 1
                resolutions[f"{width}x{height}"] += 1
                aspect = round(width / height, 3) if height else None
                if aspect is not None:
                    aspect_ratios[str(aspect)] += 1
        except (UnidentifiedImageError, OSError, ValueError):
            corrupt.append(str(path))

    return {
        "count": len(images),
        "extensions": dict(sorted(extensions.items())),
        "channels": dict(sorted(channels.items())),
        "unique_resolutions": len(resolutions),
        "top_resolutions": resolutions.most_common(10),
        "unique_aspect_ratios": len(aspect_ratios),
        "top_aspect_ratios": aspect_ratios.most_common(10),
        "corrupt_images": corrupt,
    }


def audit_dataset(dataset_dir: Path) -> dict:
    """Audit both expected classes and return a JSON-serializable report."""
    classes = {}
    for class_name in EXPECTED_CLASSES:
        classes[class_name] = audit_class(dataset_dir / class_name)

    total = sum(value["count"] for value in classes.values())
    counts = {name: value["count"] for name, value in classes.items()}
    imbalance_ratio = None
    if all(counts.values()):
        imbalance_ratio = round(max(counts.values()) / min(counts.values()), 4)

    return {
        "dataset": str(dataset_dir.resolve()),
        "expected_classes": list(EXPECTED_CLASSES),
        "total_images": total,
        "class_counts": counts,
        "class_distribution_percent": {
            name: round((count / total) * 100, 2) if total else 0
            for name, count in counts.items()
        },
        "imbalance_ratio_larger_to_smaller": imbalance_ratio,
        "classes": classes,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Audit cattle/buffalo dataset statistics")
    parser.add_argument("dataset", type=Path, help="Dataset root containing cattle/ and buffalo/")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Optional JSON report path",
    )
    args = parser.parse_args()

    report = audit_dataset(args.dataset)
    rendered = json.dumps(report, indent=2)
    print(rendered)

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered + "\n", encoding="utf-8")
        print(f"\nReport written to: {args.output}")


if __name__ == "__main__":
    main()
