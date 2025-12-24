const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../services/mailService');

router.post('/', async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Email and message are required'
        });
    }

    try {
        await sendFeedbackEmail(email, message);
        res.status(200).json({
            success: true,
            message: 'Feedback sent successfully'
        });
    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send feedback email'
        });
    }
});

module.exports = router;
