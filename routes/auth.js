const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const verifyToken = require('../middleware/verifyToken')

router.get('/signup', authController.showSignup)
router.post('/signup', authController.signup)
router.get('/login', verifyToken, authController.showLogin)
router.post('/login', authController.login)

module.exports = router;
