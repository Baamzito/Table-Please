const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController')
const upload = require('../middleware/upload');

router.get('/', profileController.showProfile)
router.get('/edit', profileController.showEditProfile)
router.post('/update', upload.single('profileImage'), profileController.updateProfile)
router.get('/change-password', profileController.showChangePassword)
router.post('/change-password', profileController.updatePassword)

module.exports = router;
