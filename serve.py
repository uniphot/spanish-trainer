#!/usr/bin/env python3
"""Local server for A fondo. Usage: python3 serve.py [port]  →  http://localhost:8770

Speech recognition and the microphone need a "secure context"; localhost counts as one,
so open the app through this server rather than double-clicking index.html.
It also serves /api/news: today's articles from a fixed list of Mexican news feeds (news.py).
"""
import http.server
import socketserver
import sys
import webbrowser

import news

PORT = next((int(a) for a in sys.argv[1:] if a.isdigit()), 8770)


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Always revalidate so edits and updates show up without a hard refresh.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?")[0] == "/api/news":
            try:
                body = news.get_news(force="refresh=1" in self.path)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
            except Exception as e:  # network down, etc.
                body = ('{"error": "%s", "items": [], "sources": []}' % str(e).replace('"', "'")).encode()
                self.send_response(502)
                self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def log_message(self, *args):
        pass


Handler.extensions_map[".js"] = "text/javascript"


class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server(("127.0.0.1", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"A fondo is running at {url}  (Ctrl+C to stop)")
        if "--no-open" not in sys.argv:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
