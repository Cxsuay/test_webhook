const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'qq', // 使用内置传输发送邮件
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: 'xx@qq.com',
    // 这里密码不是 qq 密码 是设置的 smtp 授权码
    pass: 'xxx'
  }
})

function sendMail(message) {
  let mailOptions = {
    from: '"746062753" <746062753@qq.com>', // 发送地址
    to: '746062753@qq.com', // 接受者
    subject: '部署通知', // 主题
    html: message // 内容主体
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('err', error);
    }
    console.log('message sent: %s', info.messageId);
  })
}

module.exports = sendMail;