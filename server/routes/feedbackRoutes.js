const express = require('express');
const router = express.Router();
const { sendFeedbackEmail } = require('../services/mailService');

router.post('/', async (req, res) => {
    console.log("📬 Feedback endpoint hit");
    console.log("Request body:", req.body);
    
    const { email, message } = req.body;

    if (!email || !message) {
        console.log("❌ Missing email or message");
        return res.status(400).json({
            success: false,
            error: 'Email and message are required'
        });
    }

    try {
        console.log(`🔄 Processing feedback from: ${email}`);
        await sendFeedbackEmail(email, message);
        console.log("✅ Feedback processed successfully");
        
        res.status(200).json({
            success: true,
            message: 'Feedback sent successfully'
        });
    } catch (error) {
        console.error('❌ Email sending failed in route handler:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            error: 'Failed to send feedback email',
            details: error.message // Add this for debugging
        });
    }
});

module.exports = router;
