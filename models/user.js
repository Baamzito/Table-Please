const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    role: {type: String, enum: ['customer', 'restaurant', 'administrator'], required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    createdDate: {type: Date, default: Date.now}
})

module.exports = mongoose.model('User', userSchema)