const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 5},
    password: { type: String, required: true, minlength: 5},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: '/images/default-avatar.jpg' },
    role: {type: String, enum: ['customer', 'restaurant', 'administrator'], required: true},
    address: {
        street: {type: String, default: null},
        city: { type: String, default: null},
        postalCode : { type: String, default: null}
    },
    validated: {type: Boolean, default: false}
},
{timestamps: true})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model('User', userSchema, 'users')