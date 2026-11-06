"""Real listening for A fondo: the newest episodes and videos from a fixed list of Mexican
podcasts and YouTube channels, as JSON (served at /api/listen).

On the published site (GitHub Pages) there is no server: the publish workflow runs
`python3 listen.py <site>/listen.json` every few hours and the app reads that file instead.

Only titles and links are kept here. Audio streams from each podcast's own host, videos play in
YouTube's embedded player, and the browser reads transcripts straight from the podcast's host.
"""
import calendar
import concurrent.futures
import email.utils
import hashlib
import html
import json
import re
import sys
import time

from news import _clean, _download, _tag

YT = "https://www.youtube.com/feeds/videos.xml?channel_id={}"

# id (see js/data/shows.js), kind, feed url, how many episodes to keep
SHOWS = [
    ("slow-mx", "audio", "https://anchor.fm/s/1138f3a68/podcast/rss", 8),
    ("cafecito", "audio", "https://anchor.fm/s/10fbcd2ec/podcast/rss", 6),
    ("tell-me", "audio", "https://anchor.fm/s/ff977db8/podcast/rss", 6),
    ("dreaming", "audio", "https://rss.buzzsprout.com/2404122.rss", 12),
    ("andrea", "audio", "https://anchor.fm/s/fc941b1c/podcast/rss", 6),
    ("how-to", "audio", "https://anchor.fm/s/10594f934/podcast/rss", 6),
    ("spanish-go", "audio", "https://rss.buzzsprout.com/1040905.rss", 4),
    ("no-hay-tos", "audio", "https://feeds.simplecast.com/UrwSRKXH", 6),
    ("cheleando", "audio", "https://anchor.fm/s/3d813124/podcast/rss", 4),
    ("ambulante", "audio", "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/b3c9b6e7-72ba-45c4-aff9-b1e7012d213b/092b66a8-4329-4183-bb12-b1e7012d216f/podcast.rss", 12),
    ("dudas", "audio", "https://feeds.acast.com/public/shows/617c0d208afe370012ddf145", 4),
    ("botepronto", "audio", "https://feeds.simplecast.com/t5LnVB_E", 4),
    ("cotorrisa", "audio", "https://feeds.simplecast.com/xE9e0As4", 3),
    ("yt-andrea", "video", YT.format("UC5GNAC8a68xLid0o4_mftBA"), 6),
    ("yt-mextalki", "video", YT.format("UCeJguGZvG8yKQW6ZAgG060Q"), 4),
    ("yt-rancho", "video", YT.format("UCJjyyWFwUIOfKhb35WgCqVg"), 6),
    ("yt-jauja", "video", YT.format("UCVZsY1CF9VwLTKgs9YLQkXw"), 6),
    ("yt-curiosamente", "video", YT.format("UCX16cLWl6dCjlZMgUBxgGkA"), 6),
    ("yt-luisito", "video", YT.format("UCECJDeK0MNapZbpaOzxrUPA"), 5),
    ("yt-tienda", "video", YT.format("UC2RFakE0-eLOWgIVGGGn6tg"), 5),
    ("yt-nmas", "video", YT.format("UCUsm-fannqOY02PNN67C0KA"), 6),
]

FULL_BROADCAST = re.compile(r"\b\d{1,2} de [a-záéíóú]+ (de )?\d{4}\s*$", re.I)  # hours-long news shows
ABOUT_MEXICO = re.compile(r"M[ée]xic|Oaxaca|Chiapas|Guadalajara|Monterrey|Tijuana|Ju[aá]rez|Veracruz|Sinaloa|Yucat[aá]n|Michoac[aá]n", re.I)
CACHE_SECONDS = 30 * 60
_cache = {"ts": 0, "data": None}


def _seconds(text):
    """itunes:duration comes as 1672, 17:40 or 00:08:13."""
    parts = [p for p in (text or "").strip().split(":") if p.isdigit()]
    total = 0
    for p in parts:
        total = total * 60 + int(p)
    return total


def _ms(text):
    try:
        return int(email.utils.parsedate_to_datetime(text).timestamp() * 1000)
    except (TypeError, ValueError):
        return 0


def _item_id(show, key):
    return hashlib.sha1(f"{show}:{key}".encode()).hexdigest()[:12]


def _attr(tag, name):
    m = re.search(r'\b%s="([^"]*)"' % name, tag)
    return html.unescape(m.group(1)) if m else ""


def _podcast(xml, show, keep):
    out = []
    for block in re.findall(r"<item\b.*?</item>", xml, re.S):
        enclosure = re.search(r"<enclosure\b[^>]*>", block)
        audio = _attr(enclosure.group(0), "url") if enclosure else ""
        if not audio.startswith("https://"):
            continue  # an http stream would be blocked on the https site
        vtt = ""
        for tag in re.findall(r"<podcast:transcript\b[^>]*>", block):
            if _attr(tag, "type") == "text/vtt":
                vtt = _attr(tag, "url")
        title, desc = _clean(_tag(block, "title")), _clean(_tag(block, "description"))
        out.append({
            "id": _item_id(show, _clean(_tag(block, "guid")) or audio),
            "show": show, "kind": "audio", "title": title, "date": _ms(_clean(_tag(block, "pubDate"))),
            "desc": desc[:280], "audio": audio, "dur": _seconds(_clean(_tag(block, "itunes:duration"))),
            "vtt": vtt, "link": _clean(_tag(block, "link")),
            "explicit": _clean(_tag(block, "itunes:explicit")).lower() in ("yes", "true"),
            "mx": bool(ABOUT_MEXICO.search(f"{title} {desc}")),
        })
    out.sort(key=lambda x: x["date"], reverse=True)
    if not any(x["vtt"] for x in out):
        return out[:keep]
    # with transcripts (the source of line-by-line practice) keep those, plus anything about Mexico
    picked = [x for x in out if x["vtt"]][:keep]
    picked += [x for x in out if x["vtt"] and x["mx"] and x not in picked]
    return picked


def _youtube(xml, show, keep):
    out = []
    for block in re.findall(r"<entry>.*?</entry>", xml, re.S):
        link = re.search(r'<link rel="alternate" href="([^"]+)"', block)
        vid = _tag(block, "yt:videoId")
        if not vid or not link or "/shorts/" in link.group(1):
            continue  # a 30-second Short is no use for listening practice
        title = _clean(_tag(block, "title"))
        if FULL_BROADCAST.search(title):
            continue
        date = _tag(block, "published")
        out.append({
            "id": _item_id(show, vid), "show": show, "kind": "video", "title": title,
            "date": calendar.timegm(time.strptime(date[:19], "%Y-%m-%dT%H:%M:%S")) * 1000 if date else 0,
            "desc": _clean(_tag(block, "media:description"))[:280], "yt": vid, "link": link.group(1),
        })
    return out[:keep]


def _fetch(src):
    show, kind, url, keep = src
    xml = _download(url).decode("utf-8", errors="replace")
    if "<item" not in xml and "<entry" not in xml:
        raise RuntimeError("no feed received (the site may be down)")
    return (_youtube if kind == "video" else _podcast)(xml, show, keep)


def get_listen(force=False):
    if not force and _cache["data"] and time.time() - _cache["ts"] < CACHE_SECONDS:
        return _cache["data"]
    items, report = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(_fetch, s): s for s in SHOWS}
        for fut, src in futures.items():
            try:
                got = fut.result(timeout=60)
                items.extend(got)
                report.append({"id": src[0], "ok": True, "count": len(got)})
            except Exception as e:  # one broken feed must not break the page
                report.append({"id": src[0], "ok": False, "error": str(e)[:120]})
    items.sort(key=lambda x: x["date"], reverse=True)
    data = json.dumps({"fetched": int(time.time() * 1000), "sources": report, "items": items}, ensure_ascii=False).encode("utf-8")
    if items:
        _cache.update(ts=time.time(), data=data)
    return data


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "listen.json"
    body = get_listen(force=True)
    with open(out, "wb") as f:
        f.write(body)
    d = json.loads(body)
    ok = sum(1 for s in d["sources"] if s.get("ok") and s.get("count"))
    print(f"{len(d['items'])} items from {ok}/{len(d['sources'])} shows → {out}")
    for s in d["sources"]:
        if not s.get("ok") or not s.get("count"):
            print(f"  {s['id']}: {s.get('error', 'nothing usable')}")
