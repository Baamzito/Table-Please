const Order = require('../models/order');

const orderController = {};

orderController.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');

    if (!order)
      return res.status(404).json({ message: 'Encomenda não encontrada.' });

    if (order.userId.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: 'Acesso negado à encomenda.' });

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter a encomenda.' });
  }
};

orderController.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter histórico de encomendas.' });
  }
};

orderController.getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Aqui podes validar se o utilizador tem permissão para ver este restaurante
    // Ex: se req.user.restaurants.includes(restaurantId) || req.user.isAdmin

    const orders = await Order.find({ restaurantId })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter encomendas do restaurante.' });
  }
};

module.exports = orderController;
