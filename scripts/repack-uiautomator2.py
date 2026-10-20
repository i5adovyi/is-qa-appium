#!/usr/bin/env python3
"""Reproduce the unbundled driver; only needed for dependency maintenance."""
import base64
import gzip
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import tarfile
import tempfile
import urllib.request

URL = "https://registry.npmjs.org/appium-uiautomator2-driver/-/appium-uiautomator2-driver-8.7.0.tgz"
INTEGRITY = "5ABLmKeAkE13QkNB2Qd9hTOYl2nfia6ZQ5QNCXefMzlr2HOdsq7T79FZ8Ad2kOydjdI9c1hb6LZ3ctanbUUbOA=="
ROOT = Path(__file__).resolve().parent.parent
DESTINATION = ROOT / "vendor/appium-uiautomator2-driver-8.7.0-unbundled.tgz"


def repack():
    with urllib.request.urlopen(URL, timeout=120) as response:
        original = response.read()
    actual = base64.b64encode(hashlib.sha512(original).digest()).decode()
    if actual != INTEGRITY:
        raise ValueError("Upstream tarball integrity mismatch; refusing to repack.")

    files = {}
    with tarfile.open(fileobj=io.BytesIO(original), mode="r:gz") as archive:
        for member in archive:
            name = PurePosixPath(member.name)
            if name.is_absolute() or ".." in name.parts or name.parts[0] != "package":
                raise ValueError(f"Unexpected archive path: {name}")
            if "node_modules" in name.parts or name.name == "npm-shrinkwrap.json":
                continue
            if member.isdir():
                continue
            if not member.isfile():
                raise ValueError(f"Unexpected non-regular file: {name}")
            content = archive.extractfile(member).read()
            if str(name) == "package/package.json":
                manifest = json.loads(content)
                if manifest["name"] != "appium-uiautomator2-driver" or manifest["version"] != "8.7.0":
                    raise ValueError("Unexpected upstream package identity.")
                manifest.pop("bundleDependencies", None)
                manifest.pop("bundledDependencies", None)
                content = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode()
            files[str(name)] = (content, member.mode)
    if "package/LICENSE" not in files or "package/package.json" not in files:
        raise ValueError("Upstream package is missing its license or manifest.")

    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".repack-", dir=DESTINATION.parent) as staging:
        temporary = Path(staging) / DESTINATION.name
        with temporary.open("wb") as output:
            with gzip.GzipFile(filename="", mode="wb", fileobj=output, mtime=0) as compressed:
                with tarfile.open(fileobj=compressed, mode="w", format=tarfile.USTAR_FORMAT) as archive:
                    for name, (content, mode) in sorted(files.items()):
                        member = tarfile.TarInfo(name)
                        member.size = len(content)
                        member.mode = mode
                        archive.addfile(member, io.BytesIO(content))
        temporary.replace(DESTINATION)
    print(f"Repacked {len(files)} upstream files, retaining driver code and license.")
    print(f"SHA-256: {hashlib.sha256(DESTINATION.read_bytes()).hexdigest()}")


if __name__ == "__main__":
    repack()
