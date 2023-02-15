const nodemailer = require('nodemailer');

const sendEmailUtility= async (EmailTo, EmailText, EmailSubject) => {

    const transporter = nodemailer.createTransport({
        // host: 'mail.teamrabbil.com',
        host: 'smtp.ethereal.email',
        // port: 25,
        port: 587,
        secure: false,
        auth: {
            /*user: "info@teamrabbil.com",
            pass: '~sR4[bhaC[Qs'*/
            user: 'lonny.bahringer@ethereal.email',
            pass: 'mCGKAF1Yv8ghyQM72n'
        },tls: {
            rejectUnauthorized: false
        },
    });


    const mailOptions = {
        from: 'Task Manager MERN <info@teamrabbil.com>',
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };


    return  await transporter.sendMail(mailOptions)

}
module.exports= sendEmailUtility