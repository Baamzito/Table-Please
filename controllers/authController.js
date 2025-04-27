const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let authController = {}

authController.showSignup = function(req, res){
    if (req.user) {
        return res.redirect('/');
    }
    res.render('auth/signup', {title: 'Sign up'})
}

authController.showLogin = function(req, res){
    if (req.user) {
        return res.redirect('/');
    }
    res.render('auth/login', {title: 'Login'})
}

authController.signup = async function(req, res){
    const { username, password, email, role, firstName, lastName, street, city, postalCode } = req.body;

    if (!username || typeof username !== 'string' || username.trim().length < 5) {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'Username is required and must be at least 5 characters long.' 
        });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'Password is required and must be at least 8 characters long.' 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'Please enter a valid email address.' 
        });
    }

    const validRoles = ['customer', 'restaurant'];
    if (!role || !validRoles.includes(role)) {
        return res.render('auth/signup', {
            title: 'Sign up',
            error: 'Please select a valid account type.' 
        });
    }

    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'First name is required.' 
        });
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'Last name is required.' 
        });
    }

    if (!street || typeof street !== 'string' || street.trim() === '') {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'Street address is required.' 
        });
    }

    if (!city || typeof city !== 'string' || city.trim() === '') {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'City is required.' 
        });
    }

    const postalRegex = /^[0-9]{4}-[0-9]{3}$/;
    if (!postalCode || !postalRegex.test(postalCode)) {
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'Please enter a valid postal code in format XXXX-XXX.' 
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('auth/signup', { 
                title: 'Sign up',
                error: 'Username already exists. Please choose another one.' 
            });
        }
        
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.render('auth/signup', { 
                title: 'Sign up',
                error: 'Email already registered. Please use another email or log in.' 
            });
        }
        
        const user = await User.create({
            username, 
            password, 
            email, 
            role, 
            firstName, 
            lastName, 
            address: {
                street,
                city,
                postalCode
            }
        });
        
        return res.render('auth/login', { 
            title: 'Login',
            success: 'Account created successfully! You can now log in.' 
        });
        
    } catch (err) {
        console.error('Error during signup:', err);
        return res.render('auth/signup', { 
            title: 'Sign up',
            error: 'An error occurred during registration. Please try again.' 
        });
    }

}

authController.login = async function(req, res){
    const {username, password} = req.body

    if (!username || !password) {
        return res.render('auth/login', {
            title: 'Login', 
            error: 'Username and password are required.'
        })
    }

    try{
        const user = await User.findOne({username})

        if(!user){
            return res.render('auth/login', {
                title: 'Login', 
                error: 'Username or password is invalid.'
            })
        }

        const passwordMatched = await bcrypt.compare(password, user.password)
        if(!passwordMatched){
            return res.render('auth/login', {
                title: 'Login', 
                error: 'Username or password is invalid.'
            })
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
        console.error('Login error:', err);
        
        return res.render('auth/login', {
            title: 'Login',
            error: 'An error occurred during login. Please try again.'
        });
    }
}

authController.logout = function(req, res) {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'strict',
        });
        
        return res.redirect('/auth/login');
    } catch (err) {
        console.error('Logout error:', err);

        return res.redirect('/auth/login');
    }
}

module.exports = authController