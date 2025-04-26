const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authorizedRole = require('../middleware/authorizedRole');
const upload = require('../middleware/upload');

// Gestão dos Restaurantes
router.get('/my-restaurants', authorizedRole('restaurant'), ownerController.showMyRestaurants);
router.get('/create-restaurant', authorizedRole('restaurant'), ownerController.showCreateRestaurant);
router.post('/create-restaurant', authorizedRole('restaurant'), ownerController.createRestaurant);
router.get('/edit/:id', authorizedRole('restaurant'), ownerController.showEditRestaurant);
router.post('/edit/:id', authorizedRole('restaurant'), ownerController.updateRestaurant);
router.post('/delete/:id', authorizedRole('restaurant'), ownerController.deleteRestaurant);

// Gestão dos menus
router.get('/restaurant/:restaurantId/menus', authorizedRole('restaurant'), ownerController.showRestaurantMenus);
router.get('/restaurant/:restaurantId/menu/create', authorizedRole('restaurant'), ownerController.showCreateMenu);
router.post('/restaurant/:restaurantId/menu/create', authorizedRole('restaurant'), ownerController.createMenu);
router.get('/menu/:menuId/edit', authorizedRole('restaurant'), ownerController.showEditMenu);
router.post('/menu/:menuId/edit', authorizedRole('restaurant'), ownerController.updateMenu);
router.post('/menu/:menuId/delete', authorizedRole('restaurant'), ownerController.deleteMenu);

// Gestão dos Itens dos Menus
router.get('/menu/:menuId/items', authorizedRole('restaurant'), ownerController.showMenuItems);
router.get('/menu/:menuId/item/create', authorizedRole('restaurant'), ownerController.showCreateMenuItem);
router.post('/menu/:menuId/item/create', authorizedRole('restaurant'), upload.single('image'), ownerController.createMenuItem);
router.get('/menu-item/:itemId/edit', authorizedRole('restaurant'), ownerController.showEditMenuItem);
router.post('/menu-item/:itemId/edit', authorizedRole('restaurant'), upload.single('image'), ownerController.updateMenuItem);
router.post('/menu-item/:itemId/delete', authorizedRole('restaurant'), ownerController.deleteMenuItem);

module.exports = router;