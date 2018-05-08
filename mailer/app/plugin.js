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
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'EMAIL_ADDRESS@gmail.com',
        pass: 'PA$$W0RD'
      }
    });
    done();
  });

  return 'mailer';
}

module.exports = plugin;
