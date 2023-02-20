const sgMail = require('@sendgrid/mail');

const sendEmailUtility= async (EmailTo, EmailText, EmailSubject) => {
    sgMail.setApiKey(process.env.SENDGRID_KEY);
    // const fromEmail =
    const mailOptions = {
        to: EmailTo,
        from: `Task Manager MERN <${process.env.SENDGRID_EMAIL_FROM}>`,
        subject: EmailSubject,
        text: EmailText
    }

    return sgMail.send(mailOptions);

}
module.exports= sendEmailUtility