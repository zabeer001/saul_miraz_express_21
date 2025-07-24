import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/env.js';
import { hashPassword } from '../../helpers/hashPassowrd.js';
import User from '../../models/user.model.js';
import { registerMail } from '../../functionalController/emailNotificationController.js';




export const signUpService = async ({ name, email, password }) => {

  // console.log('SignUp Service:', { name, email, password });

  try {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await registerMail(email);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};