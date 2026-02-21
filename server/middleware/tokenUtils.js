const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateToken = (userId, email, role = 'student') => {
  return jwt.sign(
    { userId, email, role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
