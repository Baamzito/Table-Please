const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantsController')

router.get('/', restaurantsController.showRestaurants)

module.exports = router;