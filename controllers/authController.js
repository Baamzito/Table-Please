const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let authController = {}

authController.showSignup = function(req, res){
    res.render('auth/signup')
}

authController.showLogin = function(req, res){
    res.render('auth/login')
}

authController.signup = async function(req, res){
    const {username, password, role, firstName, lastName} = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 5) {
        return res.status(400).json({ error: 'Username is required and must be at least 5 characters long.' });
    }

    if (!password || typeof password !== 'string' || password.length < 5) {
        return res.status(400).json({ error: 'Password is required and must be at least 5 characters long.' });
    }

    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        return res.status(400).json({ error: 'First name is required and must be a non-empty string.' });
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
        return res.status(400).json({ error: 'Last name is required and must be a non-empty string.' });
    }

    try{
        const user = await User.create({username, password, role, firstName, lastName})
        res.status(201).json(user)
    } catch(err){
        res.status(400).send('Error: User was not created!')
    }

}

authController.login = async function(req, res){
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).json({message: 'Username and password are required'})
    }

    try{
        const user = await User.findOne({username})

        if(!user){
            return res.status(401).json({message: 'Username or password is invalid.'})
        }

        const passwordMatched = await bcrypt.compare(password, user.password)

        if(!passwordMatched){
            return res.status(401).json({message: 'Username or password is invalid.'})
        }

        const accessToken = jwt.sign({id: user._id, username: user.username, role: user.role}, process.env.JWT_SECRET, {expiresIn: '7d'}) 

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 604800000 // 7 dias
        });

        res.locals.isAuthenticated = true
        
        return res.redirect('/')
    } catch(err){
        return res.status(400).json({message: err.message})
    }
}

authController.logout = function(req, res) {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'strict',
    });

    res.redirect('/auth/login');
}

module.exports = authController