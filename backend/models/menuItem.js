const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: [
            'Appetizer',
            'Main Course',
            'Side',
            'Dessert',
            'Beverage',
            'Vegetarian',
            'Vegan',
            'Kids',
            'Gluten-Free',
            'Healthy'
        ]
    },
    available: { type: Boolean, default: true },
    itemInfo: {
        calories: { type: Number, required: true },
        proteins: { type: Number, required: true },
        fats: { type: Number, required: true },
        carbohydrates: { type: Number, required: true },
        fiber: { type: Number, required: false },
        sodium: { type: Number, required: false }
    },
    price: { type: Number, required: true },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menu',
        required: true
    },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('menuItem', menuItemSchema, 'menuItems');