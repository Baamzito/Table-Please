const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload');
const authToken = require('../middleware/authToken');

router.get('/', authToken, profileController.showProfile)
router.put('/', authToken, upload.single('profileImage'), profileController.updateProfile)
router.put('/password', authToken, profileController.updatePassword)

module.exports = router;
