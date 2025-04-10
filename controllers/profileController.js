const User = require('../models/user')

let profileController = {}

profileController.showProfile = async function(req, res){
    res.render('profile/profile')
}

profileController.editProfile = async function(req, res){
    res.render('profile/profile-edit')
}

module.exports = profileController