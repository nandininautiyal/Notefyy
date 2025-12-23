const sendMail = require("../services/mailService");

const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Feedback message is required" });
    }

    await sendMail({ name, email, message });

    res.status(200).json({ success: true, message: "Feedback sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send feedback" });
  }
};

module.exports = { submitFeedback };
