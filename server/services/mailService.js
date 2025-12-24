const nodemailer = require("nodemailer");

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter error:", error);
  } else {
    console.log("✅ Mail server ready");
  }
});

const sendFeedbackEmail = async (studentEmail, message) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: studentEmail,
    subject: `Notefyy Feedback from ${studentEmail}`,
    text: message,
  });
};

module.exports = { sendFeedbackEmail };
