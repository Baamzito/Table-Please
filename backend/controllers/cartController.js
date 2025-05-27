const Cart = require('../models/cart');
const Menu = require('../models/menu');
const MenuItem = require('../models/menuItem');
const Order = require('../models/order');
const mongoose = require('mongoose');
require('dotenv').config();

const cartController = {};

cartController.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItem');
    if (!cart) return res.status(200).json({ items: [] });

    cart.items.forEach(item => {
      item.menuItem.image = `${process.env.BASE_URL}${item.menuItem.image}`;
    });

    return res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

cartController.addItem = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(menuItemId) || quantity < 1)
      return res.status(400).json({ message: 'Invalid data.' });

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found.' });

    const menu = await Menu.findById(menuItem.menuId);
    if (!menu) return res.status(404).json({ message: 'Menu not found for the item.' });

    const restaurantId = menu.restaurantId;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart && cart.items.length > 0) {
      const existingRestaurantId = cart.items[0].restaurantId.toString();
      if (existingRestaurantId !== restaurantId.toString()) {
        return res.status(400).json({
          message: 'You can only add items from the same restaurant to the cart.'
        });
      }
    }

    const itemIndex = cart?.items.findIndex(item => item.menuItem.equals(menuItemId));

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [{
          menuItem: menuItemId,
          quantity,
          price: menuItem.price,
          restaurantId: restaurantId
        }]
      });
    } else if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        price: menuItem.price,
        restaurantId: restaurantId
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add item to cart.' });
  }
};

cartController.updateItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: 'Invalid menuItem ID.' });
    }

    if (!quantity || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity.' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const item = cart.items.find(item => item.menuItem.equals(menuItemId));
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update cart item.' });
  }
};

cartController.removeItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: 'Invalid menuItem ID.' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(item => !item.menuItem.equals(menuItemId));

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove item from cart.' });
  }
};

cartController.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear cart.' });
  }
};

cartController.submitCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryDetails, type, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId }).populate('items.menuItem');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const uniqueRestaurants = [...new Set(cart.items.map(item => item.restaurantId.toString()))];
    if (uniqueRestaurants.length > 1) {
      return res.status(400).json({ message: 'Cannot submit items from multiple restaurants in one order.' });
    }

    const restaurantId = uniqueRestaurants[0];

    const orderItems = cart.items.map(item => ({
      menuItem: item.menuItem._id,
      quantity: item.quantity,
      price: item.price
    }));

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      userId,
      restaurantId,
      items: orderItems,
      totalPrice,
      deliveryDetails,
      type,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending'
    });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Order submitted successfully.', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit cart.' });
  }
};

module.exports = cartController;
