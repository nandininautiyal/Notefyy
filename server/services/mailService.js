const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//  Define the sending function
const sendFeedbackEmail = async (studentEmail, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: process.env.EMAIL_USER,   
        replyTo: studentEmail,        
        subject: `✨ Notefyy: New Feedback from ${studentEmail}`,
        text: `You have received a new message!\n\nFrom: ${studentEmail}\nMessage: ${message}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendFeedbackEmail };
