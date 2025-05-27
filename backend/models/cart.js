const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    menuItem: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:"menuItem", 
        required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:"User", 
        required: true 
    },
    items: [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('cart', cartSchema, 'cart')