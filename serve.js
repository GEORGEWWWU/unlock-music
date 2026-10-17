/**
 * 极简静态服务器 —— 仅用于本地预览，无第三方依赖。
 * 用法：node serve.js [端口]   （默认 8123）
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.argv[2]) || 8123;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/' || p === '') p = '/index.html';
    const file = path.join(ROOT, path.normalize(p).replace(/^[\\/]+/, ''));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end('forbidden');
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('404 ' + p);
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(buf);
    });
  })
  .listen(PORT, '127.0.0.1', () => console.log('http://127.0.0.1:' + PORT));
