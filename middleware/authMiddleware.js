const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    req.user = null
    return next()
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = decoded;
    next();
  } catch (err) {
    req.user = null;
    return next()
  }
};