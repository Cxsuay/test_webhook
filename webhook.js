const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  // 判断路径是否正确
  if (req.method === 'POST' && req.url === '/webhook') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.end('Not Found');
  }
});

server.listen(3666, () => {
  console.log('webhook 服务已经在 4000 端口上启动。');
});