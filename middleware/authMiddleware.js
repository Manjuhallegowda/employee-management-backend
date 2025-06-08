const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No Authorization header');
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found after Bearer');
    return res.status(401).json({ msg: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', decoded);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;