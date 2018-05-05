const plugin = function (options){
  const seneca = this;
  let nodemailer, transporter = null;

  seneca.add({ role: 'email', cmd: 'send' }, function(args, done){
    const mailOptions = {
      from: 'Micromerce Info ✔ <info@micromerce.com>',
      to: args.to, 
      subject: args.subject,
      html: args.body
    };
    transporter.sendMail(mailOptions, function(err, info){
      if(err){
        done({code: err}, null);
      } else {
        done(null, {status: "sent"});
      }
    });
  });

  seneca.add({init: 'mailer'}, function(options, done){
    nodemailer = require('nodemailer');
    nodemailer.createTestAccount(function(err, account){
      if(err) return;
      
      transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });
      done();
    });
  });

  return 'mailer';
}

module.exports = plugin;
