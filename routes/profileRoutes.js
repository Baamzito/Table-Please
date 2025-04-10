const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const profileController = require('../controllers/profileController')

router.get('/', profileController.showProfile)
router.get('/edit', profileController.editProfile)

module.exports = router;
