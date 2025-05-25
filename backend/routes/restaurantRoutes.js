const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/restaurantsController');

router.get('/', restaurantsController.getAllRestaurants); //Retorna os restaurantes todos
router.get('/search', restaurantsController.searchRestaurants); //Procura os restaurantes a partir do nome do restaurante e cidade 
router.get('/:id', restaurantsController.getRestaurantById); //Retorna o restaurante de acordo com o id do parametro

module.exports = router;