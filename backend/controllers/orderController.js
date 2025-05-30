const Order = require('../models/order');

const orderController = {};

orderController.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');

    if (!order)
      return res.status(404).json({ message: 'Encomenda não encontrada.' });

    if (order.userId.toString() !== req.user.id && req.user.role != 'admin' && req.user.role != 'restaurant')
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

    const orders = await Order.find({ restaurantId })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao obter encomendas do restaurante.' });
  }
};

orderController.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: 'Order not found.' });

    if (order.userId.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: 'Unauthorized.' });

    const createdAt = new Date(order.createdAt).getTime();
    const now = Date.now();
    const diffInMinutes = (now - createdAt) / (1000 * 60);

    if (diffInMinutes > 5)
      return res.status(400).json({ message: 'Cannot cancel after 5 minutes.' });

    if (order.deliveryStatus !== 'pending')
      return res.status(400).json({ message: 'Order cannot be canceled at this stage.' });

    order.deliveryStatus = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel order.' });
  }
};

orderController.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'inProgress', 'outForDelivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id).populate('restaurantId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryStatus = status;
    await order.save();

    if (status === 'inProgress') {
      const prepTime = order.restaurantId.settings?.preparationTime || 30;
      const deliveryTime = order.restaurantId.settings?.deliveryTime || 20;

      setTimeout(async () => {
        const stillInProgress = await Order.findById(id);
        if (stillInProgress?.deliveryStatus === 'inProgress') {
          await Order.findByIdAndUpdate(id, { deliveryStatus: 'outForDelivery' });

          setTimeout(async () => {
            const stillOut = await Order.findById(id);
            if (stillOut?.deliveryStatus === 'outForDelivery') {
              await Order.findByIdAndUpdate(id, { deliveryStatus: 'delivered' });
            }
          }, deliveryTime * 60 * 1000);
        }
      }, prepTime * 60 * 1000);
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = orderController;
