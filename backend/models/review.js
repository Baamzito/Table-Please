const mongoose = require('mongoose')

const reviewsSchema = new mongoose.Schema({

    reviews: [{
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurant' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        rating: { type: Number, required: true, min: 0, max: 5 },
        comment: { type: String, required: false },
        imageUrl: { type: String, required: false },
        createdDate: { type: Date, default: Date.now },
    }],

},{ timestamps: true });


module.exports = mongoose.model('review', reviewsSchema, 'reviews')