// Usage: node serve.mjs <dir containing index.html>  (serves it on :5199)
import http from 'http';
import fs from 'fs';
http.createServer((_, r) => {
    r.setHeader('content-type', 'text/html; charset=utf-8');
    r.end(fs.readFileSync(process.argv[2] + '/index.html'));
}).listen(5199);
