const { Resend } = require("resend");

console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

const sendFeedbackEmail = async (studentEmail, message) => {
  console.log("📧 Sending email via Resend...");

  try {
    const response = await resend.emails.send({
      from: "Notefyy <onboarding@resend.dev>",
      to: ["nautiyal.nkind@gmail.com"], 
      reply_to: studentEmail,
      subject: `Notefyy Feedback from ${studentEmail}`,
      html: `
        <h3>New Feedback Received</h3>
        <p><strong>From:</strong> ${studentEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("✅ Email sent via Resend!");
    return response;
  } catch (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }
};

module.exports = { sendFeedbackEmail };