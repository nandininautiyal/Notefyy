const { getFilesByFolder } = require('../services/driveService');

/**
 * Controller to handle fetching files from a specific Google Drive folder
 */
const getFolderContents = async (req, res) => {
    const { folderId } = req.params;

    // 1. Basic Validation
    if (!folderId || folderId === 'coming_soon' || folderId === 'undefined') {
        return res.status(400).json({ 
            success: false, 
            error: "A valid Folder ID is required." 
        });
    }

    try {
        // 2. Fetch files using the Service
        const files = await getFilesByFolder(folderId);

        // 3. Return the list of files to the frontend
        res.status(200).json(files);
        
    } catch (error) {
        console.error("Error in driveController:", error.message);
        
        // Handle specific Google API errors (like folder not found)
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch files from Google Drive. Ensure the folder is shared with the Service Account email." 
        });
    }
};

module.exports = { getFolderContents };