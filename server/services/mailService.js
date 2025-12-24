const nodemailer = require("nodemailer");

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("EMAIL_USER value:", process.env.EMAIL_USER?.substring(0, 3) + "***");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 1,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Force synchronous verification check
console.log("🔍 Testing mail transporter connection...");
transporter.verify()
  .then(() => {
    console.log("✅ Mail server ready - Gmail connection successful!");
  })
  .catch((error) => {
    console.error("❌ Mail transporter verification FAILED:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
  });

const sendFeedbackEmail = async (studentEmail, message) => {
  console.log(`📧 Attempting to send email from: ${studentEmail}`);
  
  // Add a timeout wrapper
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Email sending timeout after 30 seconds')), 30000);
  });
  
  const sendPromise = transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: studentEmail,
    subject: `Notefyy Feedback from ${studentEmail}`,
    text: message,
    html: `<p><strong>From:</strong> ${studentEmail}</p><p><strong>Message:</strong></p><p>${message}</p>`,
  });
  
  try {
    const info = await Promise.race([sendPromise, timeoutPromise]);
    
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    
    return info;
  } catch (error) {
    console.error("❌ Email sending FAILED!");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      console.error("🚫 Connection timeout - Gmail is likely blocking this server");
    } else if (error.code === 'EAUTH') {
      console.error("🚫 Authentication failed - Check your credentials");
    } else if (error.code === 'ECONNECTION') {
      console.error("🚫 Connection refused - Network/firewall issue");
    }
    
    throw error;
  }
};

module.exports = { sendFeedbackEmail };