const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../middleware/upload');
const authToken = require('../middleware/authToken');

router.get('/', authToken, profileController.showProfile)
router.get('/edit', authToken, profileController.showEditProfile)
router.post('/update', authToken, upload.single('profileImage'), profileController.updateProfile)
router.get('/change-password', authToken, profileController.showChangePassword)
router.post('/change-password', authToken, profileController.updatePassword)

module.exports = router;
