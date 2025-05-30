const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController')
const authToken = require('../middleware/authToken');

router.get('/user', authToken, orderController.getOrdersByUser);
router.get('/restaurant/:restaurantId', authToken, orderController.getOrdersByRestaurant);
router.get('/:id', authToken, orderController.getOrderById);
router.put('/:id/cancel', authToken, orderController.cancelOrder);
router.put('/:id/status', authToken, orderController.updateOrderStatus);

module.exports = router;