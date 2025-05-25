const express = require('express');
const router = express.Router();
const authorizedRole = require('../middleware/authorizedRole');
const adminController = require('../controllers/adminController');
const authToken = require('../middleware/authToken');

router.get('/dashboard', authToken, authorizedRole('admin'), adminController.showDashboard)

// Validação de restaurantes
router.post('/validate-user/:id', authToken, authorizedRole('admin'), adminController.validateUser);

// Gestão dos restaurantes
router.post('/add-restaurant', authToken, authorizedRole('admin'), adminController.addRestaurant);
router.post('/edit-restaurant/:id', authToken, authorizedRole('admin'), adminController.editRestaurant);
router.post('/delete-restaurant/:id', authToken, authorizedRole('admin'), adminController.deleteRestaurant);

// Ver todos os restaurantes
router.get('/validated-restaurants', authToken, authorizedRole('admin'), adminController.getValidatedRestaurants);
router.get('/restaurants', authToken, authorizedRole('admin'), adminController.getAllRestaurants);

module.exports = router;