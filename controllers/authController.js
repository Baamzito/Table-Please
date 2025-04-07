const User = require('../models/user')

let authController = {}

authController.signup = function(req, res){
    res.render('signup')
}

module.exports = authController