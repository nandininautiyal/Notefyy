const sgMail = require('@sendgrid/mail');

console.log("SENDGRID_API_KEY exists:", !!process.env.SENDGRID_API_KEY);
console.log("SENDGRID_VERIFIED_SENDER exists:", !!process.env.SENDGRID_VERIFIED_SENDER);

if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY is missing!");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("✅ SendGrid configured successfully");
}

const sendFeedbackEmail = async (studentEmail, message) => {
  console.log(`📧 Sending email via SendGrid from: ${studentEmail}`);
  
  try {
    const msg = {
      to: process.env.SENDGRID_VERIFIED_SENDER, // Your email (to receive feedback)
      from: process.env.SENDGRID_VERIFIED_SENDER, // Must match verified sender
      replyTo: studentEmail, // So you can reply to the student
      subject: `Notefyy Feedback from ${studentEmail}`,
      text: message,
      html: `
        <h3>New Feedback from Notefyy</h3>
        <p><strong>From:</strong> ${studentEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };
    
    const response = await sgMail.send(msg);
    console.log("✅ Email sent successfully via SendGrid!");
    console.log("Status code:", response[0].statusCode);
    
    return response;
  } catch (error) {
    console.error("❌ SendGrid error!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Error body:", error.response.body);
    }
    
    throw error;
  }
};

module.exports = { sendFeedbackEmail };