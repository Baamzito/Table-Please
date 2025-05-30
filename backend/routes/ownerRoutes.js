const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authorizedRole = require('../middleware/authorizedRole');
const upload = require('../middleware/upload');
const authToken = require('../middleware/authToken');

// Gestão dos Restaurantes
router.get('/restaurants', authToken, authorizedRole('restaurant'), ownerController.getMyRestaurants); //Devolve os restaurantes do Dono
router.post('/restaurants', authToken, authorizedRole('restaurant'), ownerController.createRestaurant); //Cria um restaurante
router.get('/restaurants/:id', authToken, authorizedRole('restaurant'), ownerController.getRestaurantById); //Devolve o restaurante pelo ID
router.put('/restaurants/:id', authToken, authorizedRole('restaurant'), ownerController.updateRestaurant); //Atualiza o restaurante
router.delete('/restaurants/:id', authToken, authorizedRole('restaurant'), ownerController.deleteRestaurant); //Remove o restaurante

// Gestão dos Menus
router.get('/restaurants/:restaurantId/menus', authToken, authorizedRole('restaurant'), ownerController.getMenusByRestaurant); //Devolve os menus referentes ao restaurante
router.post('/restaurants/:restaurantId/menus', authToken, authorizedRole('restaurant'), ownerController.createMenu); //Cria um menu associando-o ao restaurante do parâmetro
router.get('/restaurants/:restaurantId/menus/:menuId', authToken, authorizedRole('restaurant'), ownerController.getMenuById); //Devolve um menu pelo ID
router.put('/restaurants/:restaurantId/menus/:menuId', authToken, authorizedRole('restaurant'), ownerController.updateMenu); // Atualiza o menu
router.delete('/restaurants/:restaurantId/menus/:menuId', authToken, authorizedRole('restaurant'), ownerController.deleteMenu); //Remove um menu

// Gestão dos Itens dos Menus
router.get('/restaurants/:restaurantId/menus/:menuId/items', authToken, authorizedRole('restaurant'), ownerController.getMenuItemsByMenu); //Devolve os menuitems referentes ao menu
router.post('/restaurants/:restaurantId/menus/:menuId/items', authToken, authorizedRole('restaurant'), upload.single('image'), ownerController.createMenuItem); //Cria um menuItem associando-o ao menu
router.get('/restaurants/:restaurantId/menus/:menuId/items/:itemId', authToken, authorizedRole('restaurant'), ownerController.getMenuItemById); //Devolve o menuItem pelo ID
router.put('/restaurants/:restaurantId/menus/:menuId/items/:itemId', authToken, authorizedRole('restaurant'), upload.single('image'), ownerController.updateMenuItem); //Atualiza o menuItem
router.delete('/restaurants/:restaurantId/menus/:menuId/items/:itemId', authToken, authorizedRole('restaurant'), ownerController.deleteMenuItem); //Remove um menuItem

module.exports = router;