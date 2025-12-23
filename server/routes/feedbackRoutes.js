const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../services/mailService');


router.post('/', async (req, res) => {
    const { email, message } = req.body;

    // Basic validation
    if (!email || !message) {
        return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    try {
        await sendFeedbackEmail(email, message);
        res.status(200).json({ success: true, message: 'Feedback sent!' });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ success: false, error: 'Failed to send email' });
    }
});

module.exports = router;