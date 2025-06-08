const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username !== 'sgmart@mail.com' || password !== 'sgmart123') {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  let user = await User.findOne({ username });
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ username, password: hashed });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ token });
};