import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../../helpers/tokenBlacklist.js';


export const logoutService = async (token) => {
  if (!token) {
    throw new Error('Token required');
  }

  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    throw new Error('Invalid token');
  }

  await tokenBlacklist.add(token, decoded.exp);

  return { message: 'Logged out successfully' };
};
