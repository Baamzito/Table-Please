const User = require('../models/user')
const jwt = require('jsonwebtoken')

let authController = {}

authController.showSignup = function(req, res){
    
    res.render('signup')
}

authController.showLogin = function(req, res){
    res.render('login')
}

authController.signup = async function(req, res){
    const {username, password, role, firstName, lastName} = req.body;

    try{
        const user = await User.create({username, password, role, firstName, lastName})
        res.status(201).json(user)
    } catch(err){
        res.status(400).send('Error: User was not created!')
    }

}

authController.login = function(req, res){
    res.send('login')
}

module.exports = authController