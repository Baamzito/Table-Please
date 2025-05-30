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
    city: { type: String, default: null },
    postalCode: { type: String, default: null },
  },
  contact: {
    type: String,
    required: true,
    match: [/^\+?\d{9,15}$/, "Invalid phone number format"]
  },
  type: {
    type: String,
    enum: ['dine-in', 'delivery'],
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card'],
    required: true
  },
  citizenCardNumber: {
    type: String,
    required: false  
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'inProgress', 'outForDelivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema, 'orders');