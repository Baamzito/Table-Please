const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    
    menu: [{
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurant' },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: {type: Number, required: true },
        category: {type: String, required: true },
        available: {type: Boolean, required: true },
    }],

},{ timestamps: true });


module.exports = mongoose.model('menu', menuSchema, 'menus')
