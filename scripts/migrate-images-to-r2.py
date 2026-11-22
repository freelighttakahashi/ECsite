#!/usr/bin/env python3
"""Download ColorMe CDN images and upload them to Cloudflare R2, then rewrite
products.json (images field + description_html) to use R2 URLs.

Credentials are read from environment variables:
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL
"""
import json, os, re, sys, time, urllib.request, urllib.parse
from pathlib import Path

import boto3
from botocore.config import Config

ACCOUNT_ID = os.environ["R2_ACCOUNT_ID"]
ACCESS_KEY = os.environ["R2_ACCESS_KEY_ID"]
SECRET_KEY = os.environ["R2_SECRET_ACCESS_KEY"]
BUCKET = os.environ["R2_BUCKET"]
PUBLIC_URL = os.environ["R2_PUBLIC_URL"].rstrip("/")

ENDPOINT = f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com"

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="auto",
    config=Config(signature_version="s3v4"),
)


def collect_image_urls(data):
    urls = set()
    for p in data:
        imgs = p.get("images", "")
        if isinstance(imgs, str):
            for i in imgs.split(";"):
                i = i.strip()
                if i:
                    urls.add(i)
        elif isinstance(imgs, list):
            for i in imgs:
                if i:
                    urls.add(i)
        for m in re.findall(r'src=["\']([^"\']+)["\']', p.get("description_html", "") or ""):
            urls.add(m)
    return urls


def normalize_url(u):
    u = u.strip()
    if u.startswith("//"):
        u = "https:" + u
    return u


def r2_key_for(u):
    parsed = urllib.parse.urlparse(normalize_url(u))
    return parsed.path.lstrip("/")  # preserve directory structure


def download(url):
    req = urllib.request.Request(normalize_url(url), headers={"User-Agent": "Mozilla/5.0"})
    last = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.read()
        except Exception as e:
            last = e
            time.sleep(1 + attempt)
    raise RuntimeError(f"download failed: {url} -> {last}")


def build_mapping(urls):
    mapping = {}  # original url -> r2 url
    # group by r2 key to avoid duplicate uploads
    by_key = {}
    for u in urls:
        by_key.setdefault(r2_key_for(u), []).append(u)

    for key, originals in by_key.items():
        # download once using first original
        data = download(originals[0])
        s3.put_object(Bucket=BUCKET, Key=key, Body=data, ContentType=guess_ct(key))
        r2_url = f"{PUBLIC_URL}/{key}"
        for u in originals:
            mapping[u] = r2_url
            # also map protocol-relative variant
            if u.startswith("//"):
                mapping["https:" + u] = r2_url
            else:
                mapping["//" + u.split("://", 1)[-1]] = r2_url
        print(f"uploaded: {key} ({len(data)} bytes)")
    return mapping


def guess_ct(key):
    k = key.lower()
    if k.endswith(".jpg") or k.endswith(".jpeg"):
        return "image/jpeg"
    if k.endswith(".png"):
        return "image/png"
    if k.endswith(".gif"):
        return "image/gif"
    if k.endswith(".webp"):
        return "image/webp"
    return "application/octet-stream"


def apply_mapping_to_file(path, mapping):
    data = json.load(open(path, encoding="utf-8-sig"))
    for p in data:
        # images field
        imgs = p.get("images", "")
        if isinstance(imgs, str):
            parts = [x.strip() for x in imgs.split(";") if x.strip()]
            new_parts = [mapping.get(u, mapping.get(normalize_url(u), u)) for u in parts]
            p["images"] = ";".join(new_parts)
        elif isinstance(imgs, list):
            p["images"] = [mapping.get(u, mapping.get(normalize_url(u), u)) for u in imgs]

        # description_html
        html = p.get("description_html", "") or ""
        html = re.sub(
            r'src=(["\'])([^"\']+)\1',
            lambda m: 'src=' + m.group(1) + mapping.get(m.group(2), mapping.get(normalize_url(m.group(2)), m.group(2))) + m.group(1),
            html,
        )
        p["description_html"] = html
    # write back preserving BOM? original had BOM. Write without BOM (json standard). Use utf-8.
    with open(path, "w", encoding="utf-8-sig") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"rewrote: {path}")


def main():
    if len(sys.argv) < 2:
        print("usage: migrate-images-to-r2.py <products.json> [<products.json> ...]")
        sys.exit(1)

    # First pass: collect urls from all files
    all_urls = set()
    for path in sys.argv[1:]:
        data = json.load(open(path, encoding="utf-8-sig"))
        all_urls |= collect_image_urls(data)
    print(f"collected {len(all_urls)} unique image urls")

    mapping = build_mapping(all_urls)
    # save mapping
    map_path = Path("data/raw/r2-url-mapping.json")
    map_path.parent.mkdir(parents=True, exist_ok=True)
    with open(map_path, "w", encoding="utf-8") as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)
    print(f"saved mapping: {map_path} ({len(mapping)} entries)")

    for path in sys.argv[1:]:
        apply_mapping_to_file(path, mapping)

    print("DONE")


if __name__ == "__main__":
    main()
