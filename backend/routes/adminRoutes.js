const express = require('express');
const router = express.Router();
const authorizedRole = require('../middleware/authorizedRole');
const adminController = require('../controllers/adminController');
const authToken = require('../middleware/authToken');

// Estatísticas
router.get('/dashboard', authToken, authorizedRole('admin'), adminController.getStats)

// Validação de restaurantes
router.get('/users/pending', authToken, authorizedRole('admin'), adminController.getPendingUsers);
router.post('/users/:id/validate', authToken, authorizedRole('admin'), adminController.validateUser);

// Gestão dos restaurantes
router.get('/restaurants', authToken, authorizedRole('admin'), adminController.getAllRestaurants);
router.get('/restaurants/validated', authToken, authorizedRole('admin'), adminController.getValidatedRestaurants);
router.post('/restaurants', authToken, authorizedRole('admin'), adminController.addRestaurant);
router.put('/restaurants/:id', authToken, authorizedRole('admin'), adminController.editRestaurant);
router.delete('/restaurants/:id', authToken, authorizedRole('admin'), adminController.deleteRestaurant);

module.exports = router;