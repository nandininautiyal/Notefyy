const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Optional but VERY useful for debugging
transporter.verify((err, success) => {
    if (err) {
        console.error('❌ Mail transporter error:', err);
    } else {
        console.log('✅ Mail transporter ready');
    }
});

const sendFeedbackEmail = async (studentEmail, message) => {
    const mailOptions = {
        from: `"Notefyy Feedback" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: studentEmail,
        subject: `✨ New Notefyy Feedback`,
        text: `From: ${studentEmail}\n\nMessage:\n${message}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendFeedbackEmail };
