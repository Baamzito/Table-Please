const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlenght: 5},
    password: { type: String, required: true, minlenght: 5},
    email: { type: String, required: true, unique: true },
    role: {type: String, enum: ['customer', 'restaurant', 'administrator'], required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
},
{timestamps: true})

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

module.exports = mongoose.model('User', userSchema, 'users')