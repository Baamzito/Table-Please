const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postcode: { type: String, required: true }
    },
    contact: {
        phone: { type: String, required: true,  },
        email: { type: String, match: /.+\@.+\..+/ },
        website: { type: String, required: false }
    },

},{ timestamps: true });


module.exports = mongoose.model('restaurant', restaurantSchema, 'restaurants')
