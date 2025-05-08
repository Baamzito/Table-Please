const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantsController');

router.get('/', restaurantsController.showRestaurants)
router.get('/search', restaurantsController.searchRestaurants);
router.get('/:id', restaurantsController.showRestaurantDetails)

module.exports = router;