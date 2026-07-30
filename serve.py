import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.join(os.path.dirname(__file__), 'src', 'main', 'resources', 'static')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8001

os.chdir(ROOT)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

print(f'Serving SalesDesk frontend from {ROOT} on port {PORT}')
httpd = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
httpd.serve_forever()
