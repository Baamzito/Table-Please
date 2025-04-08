const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let authController = {}

authController.showSignup = function(req, res){
    res.render('signup')
}

authController.showLogin = function(req, res){
    res.render('login')
}

authController.signup = async function(req, res){
    const {username, password, role, firstName, lastName} = req.body;

    if(username)

    try{
        const user = await User.create({username, password, role, firstName, lastName})
        res.status(201).json(user)
    } catch(err){
        res.status(400).send('Error: User was not created!')
    }

}

authController.login = async function(req, res){
    const {username, password} = req.body

    try{
        const user = await User.findOne({username})

        if(!user){
            return res.status(401).json({message: 'Username or password is invalid.'})
        }

        const passwordMatched = await bcrypt.compare(password, user.password)

        if(!passwordMatched){
            return res.status(401).json({message: 'Username or password is invalid.'})
        }

        const accessToken = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'}) 

        return res.status(200).json({
            id: user._id,
            name: user.username,
            accessToken: accessToken
        })
    } catch(err){
        return res.status(400).json({message: err.message})
    }
}

module.exports = authController