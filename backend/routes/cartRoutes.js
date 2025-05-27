const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authToken = require('../middleware/authToken');

router.get('/', authToken, cartController.getCart);
router.post('/items', authToken, cartController.addItem);
router.put('/items/:menuItemId', authToken, cartController.updateItem);
router.delete('/items/:menuItemId', authToken, cartController.removeItem);
router.delete('/', authToken, cartController.clearCart);
router.post('/submit', authToken, cartController.submitCart);

module.exports = router;