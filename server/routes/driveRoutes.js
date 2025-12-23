const express = require('express');
const router = express.Router();
const { getFolderContents } = require('../controllers/driveController');

// This route now calls the specialized controller function
router.get('/:folderId', getFolderContents);

module.exports = router;