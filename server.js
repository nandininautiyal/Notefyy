require('dotenv').config();
const express = require('express');
const path = require('path');

// Import routes
const feedbackRoutes = require('./server/routes/feedbackRoutes');
const driveRoutes = require('./server/routes/driveRoutes');

const app = express();

/* ======================
   Middleware
====================== */

// Parse JSON bodies
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Request logger (debug-friendly)
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

/* ======================
   API Routes
====================== */

app.use('/api/feedback', feedbackRoutes);
app.use('/api/drive', driveRoutes);

/* ======================
   Frontend Fallback 
====================== */

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ======================
   Global Error Handler
====================== */

app.use((err, req, res, next) => {
    console.error("Critical Server Error:", err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong on the server!'
    });
});

/* ======================
   Start Server
====================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
*************************************************
Notefyy is flying at http://localhost:${PORT}
Mode: Development
Feedback: Enabled
Google Drive: Enabled
*************************************************
`);
});
