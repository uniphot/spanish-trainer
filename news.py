"""Daily Mexico news for A fondo: fetches a fixed list of RSS feeds from Mexican outlets,
cleans the articles into plain paragraphs and returns them as JSON (served at /api/news).

On the published site (GitHub Pages) there is no server: a scheduled GitHub Action runs
`python3 news.py <site>/news.json` every few hours and the app reads that file instead.

Only the sources below can be fetched — the endpoint never takes a URL from the browser.
"""
import concurrent.futures
import email.utils
import hashlib
import html
import json
import os
import re
import shutil
import ssl
import subprocess
import time
import urllib.request

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"
ARC = "https://www.eluniversal.com.mx/arc/outboundfeeds/rss/category/{}/?outputType=xml"

# id, outlet, section shown in the app, interest group, url
SOURCES = [
    ("eu-nacion", "El Universal", "Nación", "mexico", ARC.format("nacion")),
    ("jornada", "La Jornada", "Portada", "mexico", "https://www.jornada.com.mx/rss/edicion.xml"),
    ("financiero", "El Financiero", "Portada", "mexico", "https://www.elfinanciero.com.mx/arc/outboundfeeds/rss/?outputType=xml"),
    ("eu-metropoli", "El Universal", "Metrópoli", "cdmx", ARC.format("metropoli")),
    ("chilango", "Chilango", "CDMX", "cdmx", "https://www.chilango.com/feed/"),
    ("mxdesconocido", "México Desconocido", "Viajes", "viajes", "https://www.mexicodesconocido.com.mx/feed"),
    ("eu-destinos", "El Universal", "Destinos", "viajes", ARC.format("destinos")),
    ("eu-cultura", "El Universal", "Cultura", "cultura", ARC.format("cultura")),
    ("eu-menu", "El Universal", "Menú", "comida", ARC.format("menu")),
    ("eu-tendencias", "El Universal", "Tendencias", "sociedad", ARC.format("tendencias")),
    ("expansion", "Expansión", "Negocios", "economia", "https://expansion.mx/rss"),
    ("eu-techbit", "El Universal", "Techbit", "ciencia", ARC.format("techbit")),
    ("eu-ciencia", "El Universal", "Ciencia y salud", "ciencia", ARC.format("ciencia-y-salud")),
    ("eu-mundo", "El Universal", "Mundo", "mundo", ARC.format("mundo")),
    ("bbc-mundo", "BBC Mundo", "Internacional", "mundo", "https://feeds.bbci.co.uk/mundo/rss.xml"),
    ("eu-espectaculos", "El Universal", "Espectáculos", "espectaculos", ARC.format("espectaculos")),
]

CACHE_SECONDS = 30 * 60
_cache = {"ts": 0, "data": None}

BOILERPLATE = re.compile(
    r"^(lee también|lea también|te puede interesar|también te puede interesar|suscríbete|síguenos|sigue a|únete|recibe|"
    r"leer más|más información|the post .* appeared first|foto:|fotos:|video:|con información de|descarga|escucha|"
    r"mantente informado|para más|haz clic|da clic|consulta|ver más|también lee|relacionado|nota relacionada|en esta nota)",
    re.I,
)


def _tag(block, name):
    m = re.search(r"<%s\b[^>]*>(.*?)</%s>" % (re.escape(name), re.escape(name)), block, re.S | re.I)
    if not m:
        return ""
    text = m.group(1).strip()
    cdata = re.match(r"^<!\[CDATA\[(.*)\]\]>$", text, re.S)
    return cdata.group(1) if cdata else text


def _paragraphs(raw_html):
    s = re.sub(r"<!--.*?-->", " ", raw_html, flags=re.S)
    s = re.sub(r"<(script|style|figure|figcaption|iframe|blockquote|table|noscript|aside)\b.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<(br|/p|/h[1-6]|/li|/div)\s*/?>", "\n", s, flags=re.I)
    # inline tags (links, bold…) vanish without a space, or "<a>Luna</a>, dijo" reads "Luna , dijo"
    s = re.sub(r"</?(a|b|strong|em|i|u|span|mark|abbr|sub|sup)\b[^>]*>", "", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(html.unescape(s))
    out = []
    for line in s.split("\n"):
        line = re.sub(r"\s+", " ", line).strip()
        line = re.sub(r" ([,;:.)])", r"\1", line)
        if len(line) < 40 or BOILERPLATE.match(line) or line.isupper():
            continue
        if line not in out:
            out.append(line)
        if len(out) >= 30:
            break
    return out


def _clean(text):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", html.unescape(text or "")))).strip()


def _image(block):
    for pat in (r'<media:content[^>]*url="([^"]+)"', r'<enclosure[^>]*url="([^"]+)"', r'<media:thumbnail[^>]*url="([^"]+)"'):
        m = re.search(pat, block)
        if m:
            return html.unescape(m.group(1))
    return None


# Front-page feeds mix everything: refine the interest group from the article's URL section.
URL_GROUPS = [
    (r"/(deportes|futbol|beisbol|nfl|f1)/", "deportes"), (r"/(espectaculos|celebridades|television|musica)/", "espectaculos"),
    (r"/(mundo|internacional)/", "mundo"), (r"/(cultura|culturas|arte)/", "cultura"), (r"/(cdmx|metropoli|capital)/", "cdmx"),
    (r"/(economia|mercados|finanzas|cartera|empresas|dinero)/", "economia"), (r"/(tecnologia|techbit|ciencia)/", "ciencia"),
    (r"/(food-and-drink|menu|gastronomia)/", "comida"), (r"/(viajes|destinos)/", "viajes"),
]


def _group(link, default):
    for pat, g in URL_GROUPS:
        if re.search(pat, link):
            return g
    return default


def _parse(xml_text, src):
    sid, outlet, section, group, _ = src
    items = []
    for block in re.findall(r"<item\b.*?</item>", xml_text, re.S | re.I):
        title = _clean(_tag(block, "title"))
        link = _clean(_tag(block, "link"))
        if not title or not link:
            continue
        try:
            date = int(email.utils.parsedate_to_datetime(_clean(_tag(block, "pubDate"))).timestamp() * 1000)
        except Exception:
            date = None
        summary = _clean(_tag(block, "description"))
        summary = re.sub(r"\s*The post .*$", "", summary)[:500]
        paras = _paragraphs(_tag(block, "content:encoded"))
        if not paras and len(summary) > 40:
            paras = [summary]
        cats = [_clean(c) for c in re.findall(r"<category\b[^>]*>(.*?)</category>", block, re.S)]
        items.append({
            "id": hashlib.sha1(link.encode()).hexdigest()[:12],
            "source": sid, "outlet": outlet, "section": section, "group": _group(link, group) if group == "mexico" else group,
            "title": title, "link": link, "date": date, "summary": summary,
            "paragraphs": paras, "image": _image(block),
            "categories": [re.sub(r"^<!\[CDATA\[|\]\]>$", "", c) for c in cats][:6],
        })
    return items


def _ssl_context():
    # python.org builds on macOS ship without root certificates until "Install Certificates.command"
    # is run; fall back to certifi or the system bundle so HTTPS works out of the box.
    ctx = ssl.create_default_context()
    if ctx.cert_store_stats().get("x509_ca", 0) == 0:
        try:
            import certifi
            ctx.load_verify_locations(certifi.where())
        except Exception:
            if os.path.exists("/etc/ssl/cert.pem"):
                ctx.load_verify_locations("/etc/ssl/cert.pem")
    return ctx


_CTX = _ssl_context()


def _download(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    try:
        with urllib.request.urlopen(req, timeout=12, context=_CTX) as r:
            return r.read(6_000_000)
    except Exception:
        # e.g. a network proxy with its own certificate: curl uses the system's trust settings
        if not shutil.which("curl"):
            raise
        out = subprocess.run(["curl", "-fsSL", "--max-time", "30", "-A", UA, url], capture_output=True, timeout=40)
        # a slow connection may time out mid-feed: complete items received so far are still usable
        if not out.stdout or (out.returncode != 0 and b"</item>" not in out.stdout and b"</entry>" not in out.stdout):
            raise RuntimeError(out.stderr.decode(errors="replace").strip()[:120] or "download failed")
        return out.stdout[:6_000_000]


def _fetch(src):
    xml = _download(src[4]).decode("utf-8", errors="replace")
    if "<item" not in xml and "<entry" not in xml:
        raise RuntimeError("no feed received (the site may be down)")
    items = _parse(xml, src)
    return sorted(items, key=lambda x: x["date"] or 0, reverse=True)[:25]


def get_news(force=False):
    if not force and _cache["data"] and time.time() - _cache["ts"] < CACHE_SECONDS:
        return _cache["data"]
    items, report = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(_fetch, s): s for s in SOURCES}
        for fut, src in futures.items():
            try:
                got = fut.result(timeout=60)
                items.extend(got)
                report.append({"id": src[0], "outlet": src[1], "section": src[2], "ok": True, "count": len(got)})
            except Exception as e:  # one broken feed must not break the digest
                report.append({"id": src[0], "outlet": src[1], "section": src[2], "ok": False, "error": str(e)[:120]})
    seen, unique = set(), []
    for it in sorted(items, key=lambda x: x["date"] or 0, reverse=True):
        key = re.sub(r"\W+", "", it["title"].lower())[:60]
        if it["id"] in seen or key in seen:
            continue
        seen.update({it["id"], key})
        unique.append(it)
    data = json.dumps({"fetched": int(time.time() * 1000), "sources": report, "items": unique}, ensure_ascii=False).encode("utf-8")
    if unique:
        _cache.update(ts=time.time(), data=data)
    return data


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "news.json"
    body = get_news(force=True)
    with open(out, "wb") as f:
        f.write(body)
    d = json.loads(body)
    ok = sum(1 for s in d["sources"] if s.get("ok") and s.get("count"))
    print(f"{len(d['items'])} articles from {ok}/{len(d['sources'])} sources → {out}")
    for s in d["sources"]:
        if not s.get("ok"):
            print(f"  {s['outlet']} · {s['section']}: {s.get('error')}")
