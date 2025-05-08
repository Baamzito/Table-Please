const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'restaurant',
        required: true
    },
    active: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('menu', menuSchema, 'menus')
