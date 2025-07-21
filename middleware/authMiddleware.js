import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';  // make sure this path is correct
import { JWT_SECRET } from '../config/env.js';
import { tokenBlacklist } from '../helpers/tokenBlacklist.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted
    if (await tokenBlacklist.has(token)) {
      return res.status(401).json({ message: 'Token is no longer usable, please log in again.' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch full user from DB by userId in decoded token
    const authUser = await User.findById(decoded.userId).select('-password');

    if (!authUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach full user info as req.authUser (change to req.user if you want)
    req.authUser = authUser;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
