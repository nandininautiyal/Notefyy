const { google } = require('googleapis');

// Create JWT client
const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});


auth.authorize();

const drive = google.drive({
    version: 'v3',
    auth,
});

const getFilesByFolder = async (folderId) => {
    try {
        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, webViewLink, mimeType)',
        });

        return response.data.files;
    } catch (error) {
        console.error("Google Drive API Error:", error.message);
        throw error;
    }
};

module.exports = { getFilesByFolder };
