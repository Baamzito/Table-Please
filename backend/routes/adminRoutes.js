const express = require('express');
const router = express.Router();
const authorizedRole = require('../middleware/authorizedRole');
const adminController = require('../controllers/adminController')

router.get('/dashboard', authorizedRole('admin'), adminController.showDashboard)

// Validação de restaurantes
router.post('/validate-user/:id', adminController.validateUser);

// Gestão dos restaurantes
router.post('/add-restaurant', adminController.addRestaurant);
router.post('/edit-restaurant/:id', adminController.editRestaurant);
router.post('/delete-restaurant/:id', adminController.deleteRestaurant);

// Ver todos os restaurantes
router.get('/validated-restaurants', adminController.getValidatedRestaurants);
router.get('/restaurants', adminController.getAllRestaurants);

module.exports = router;