const nodemailer = require("nodemailer");

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("EMAIL_USER value:", process.env.EMAIL_USER?.substring(0, 3) + "***"); // Partial log for security

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add these options for better reliability
  pool: true,
  maxConnections: 1,
  rateDelta: 1000,
  rateLimit: 1,
});

// verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail transporter error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
  } else {
    console.log("✅ Mail server ready");
  }
});

const sendFeedbackEmail = async (studentEmail, message) => {
  console.log(`📧 Attempting to send email from: ${studentEmail}`);
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: studentEmail,
      subject: `Notefyy Feedback from ${studentEmail}`,
      text: message,
    });
    
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    
    return info;
  } catch (error) {
    console.error("❌ Email sending failed!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw error;
  }
};

module.exports = { sendFeedbackEmail };