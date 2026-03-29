const nodemailer = require('nodemailer');
const twilio = require('twilio');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'YOUR_EMAIL',
            pass: 'YOUR_PASSWORD'
        }
    });

    const mailOptions = {
        from: 'YOUR_EMAIL',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (err) {
        console.error(err);
    }
};

const sendSms = async (to, body) => {
    const client = new twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

    try {
        await client.messages.create({
            body,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to
        });
        console.log('SMS sent');
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    sendEmail,
    sendSms
};
