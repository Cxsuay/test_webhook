const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');
const SECRET = '123456';
function sign(body) {
  return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`;
}

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  // 判断路径是否正确
  if (req.method === 'POST' && req.url === '/webhook') {
    let buffers = [];
    req.on('data', (buffer) => {
      buffers.push(buffer);
    });
    req.on('end', () => {
      let body = Buffer.concat(buffers);
      let event = req.headers['x-github-event']; // event = push;
      // github 请求来的时候 要传递请求体 另外还会传递一个 signature 过来 需要验证signature
      let signature = req.headers['x-hub-signature'];

      if (signature !== sign(body)) {
        return res.end('Not Allowed');
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
      if (event === 'push') { // 开始部署
        let payload = JSON.parse(body);
        console.log('%c 🥓 payload.repository.name: ', 'font-size:20px;background-color: #FFDD4D;color:#fff;', payload.repository.name);
        let child = spawn("sh", [`./${payload.repository.name}.sh`]); // 开启子进程 执行脚本~
        let buffers = [];
        child.stdout.on('data', (buffer) => {
          buffers.push(buffer);
        });
        child.stdout.on('end', () => {
          let logs = Buffer.concat(buffers);
          console.log('%c 🍟 logs: ', 'font-size:20px;background-color: #42b983;color:#fff;', logs);
        })
      }
    });
  } else {
    res.end('Not Found');
  }
});

server.listen(3666, () => {
  console.log('webhook 服务已经在 4000 端口上启动。');
});