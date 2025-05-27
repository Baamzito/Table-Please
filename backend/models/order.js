const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menuItem',
    required: true
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant',
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDetails: {
    address: { type: String },
    notes: { type: String },
    contactPhone: { type: String },
  },
  type: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'paypal', 'mbway'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema, 'orders');