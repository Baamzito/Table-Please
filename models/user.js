const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlenght: 4},
    password: { type: String, required: true, minlenght: 7},
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