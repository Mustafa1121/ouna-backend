const nodemailer = require('nodemailer')

exports.sendMail = async (options) => {
    // create transporter
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    // Define the mail options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // send the mail
    await transport.sendMail(mailOptions)
}