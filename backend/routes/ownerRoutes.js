const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authorizedRole = require('../middleware/authorizedRole');
const upload = require('../middleware/upload');
const authToken = require('../middleware/authToken');

// Gestão dos Restaurantes
router.get('/restaurants', authToken, authorizedRole('restaurant'), ownerController.getMyRestaurants);
router.post('/restaurants', authToken, authorizedRole('restaurant'), ownerController.createRestaurant);
router.get('/restaurants/:id', authToken, authorizedRole('restaurant'), ownerController.getRestaurantById);
router.put('/restaurants/:id', authToken, authorizedRole('restaurant'), ownerController.updateRestaurant);
router.delete('/restaurants/:id', authToken, authorizedRole('restaurant'), ownerController.deleteRestaurant);

// Gestão dos menus
router.get('/restaurant/:restaurantId/menus', authToken, authorizedRole('restaurant'), ownerController.showRestaurantMenus);
router.get('/restaurant/:restaurantId/menu/create', authToken, authorizedRole('restaurant'), ownerController.showCreateMenu);
router.post('/restaurant/:restaurantId/menu/create', authToken, authorizedRole('restaurant'), ownerController.createMenu);
router.get('/menu/:menuId/edit', authToken, authorizedRole('restaurant'), ownerController.showEditMenu);
router.post('/menu/:menuId/edit', authToken, authorizedRole('restaurant'), ownerController.updateMenu);
router.post('/menu/:menuId/delete', authToken, authorizedRole('restaurant'), ownerController.deleteMenu);

// Gestão dos Itens dos Menus
router.get('/menu/:menuId/items', authToken, authorizedRole('restaurant'), ownerController.showMenuItems);
router.get('/menu/:menuId/item/create', authToken, authorizedRole('restaurant'), ownerController.showCreateMenuItem);
router.post('/menu/:menuId/item/create', authToken, authorizedRole('restaurant'), upload.single('image'), ownerController.createMenuItem);
router.get('/menu-item/:itemId/edit', authToken, authorizedRole('restaurant'), ownerController.showEditMenuItem);
router.post('/menu-item/:itemId/edit', authToken, authorizedRole('restaurant'), upload.single('image'), ownerController.updateMenuItem);
router.post('/menu-item/:itemId/delete', authToken, authorizedRole('restaurant'), ownerController.deleteMenuItem);

module.exports = router;