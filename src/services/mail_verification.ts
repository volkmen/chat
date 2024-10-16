import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: 'yardev@ukr.net',
    pass: 'YmpdWI9MtDGCHAC6'
  }
});

transporter
  .sendMail({
    from: 'yardev@ukr.net', // sender address
    to: 'yaroslvovk@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  })
  .then(res => {
    console.log('SUCCESSFULLY sent', res);
  })
  .catch(e => {
    console.error(e);
    throw e;
  });
