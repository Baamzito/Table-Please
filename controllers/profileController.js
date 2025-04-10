const User = require('../models/user')

let profileController = {}

profileController.showProfile = async function(req, res){
    res.render('profile')
}

module.exports = profileController