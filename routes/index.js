const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', async function (req, res, next) {
  try {
    if (req.user) {
      const userData = await User.findById(req.user.id);
      res.render('index', { user: userData, title: 'Table Please' });
    } else {
      res.render('index', { user: null, title: 'Table Please' });
    }
  } catch (error) {
    res.status(500).send('Erro ao buscar dados do perfil');
  }
});

module.exports = router;
