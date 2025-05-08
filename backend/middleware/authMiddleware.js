const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async function (req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    req.user = null;
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userData = await User.findById(decoded.id);
    if (!userData) {
      req.user = null;
      res.locals.user = null;
      return next();
    }

    req.user = userData;

    res.locals.user = {
      id: userData._id,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      profileImage: userData.profileImage,
      role: userData.role,
      validated: userData.validated
    };

    next();
  } catch (err) {
    console.log('Auth error:', err.message);
    req.user = null;
    res.locals.user = null;
    return next();
  }
};