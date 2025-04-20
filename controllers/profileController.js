const User = require('../models/user')
const fs = require('fs');
const path = require('path');

let profileController = {}

profileController.showProfile = async function(req, res){
    try{
        const userData = await User.findById(req.user.id)
        res.render('profile/profile', { title: 'Profile', user: userData })
    } catch (error) {
        res.status(500).send('Erro ao buscar dados do perfil');
    }
}

profileController.showEditProfile = async function(req, res){
    try{
        const userData = await User.findById(req.user.id)
        res.render('profile/profile-edit', { title: 'Profile Edit', user: userData })
    } catch (error) {
        res.status(500).send('Erro ao buscar dados do perfil');
    }
}

module.exports = profileController