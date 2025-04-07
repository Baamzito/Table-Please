const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', authController.signup)

module.exports = router;
