const seneca = require('seneca')();
const plugin = require('./app/plugin');

seneca
  .use(plugin)
  .act({
    role: 'email',
    cmd: 'send',
    to: 'Ehab Gamal <ehab.g.sh@gmail.com>',
    subject: 'Micromerce Nodemailer Message',
    body: '<h1>Hello from Micromerce!</h1>'
  }, (err, res) => {
    if(err) console.log('Error sending the email');
    else console.log(res);
  });
