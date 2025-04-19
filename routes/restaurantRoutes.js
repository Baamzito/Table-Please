const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantsController');
const authorizedRole = require('../middleware/authorizedRole');

router.get('/', restaurantsController.showRestaurants)
router.get('/create', authorizedRole('admin','customer'), restaurantsController.showCreateRestaurant)
router.get('/:id', restaurantsController.showRestaurantDetails)

module.exports = router;