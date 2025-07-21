import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import bcrypt from 'bcryptjs';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/env.js';
import { hashPassword } from '../../helpers/hashPassowrd.js';
import User from '../../models/user.model.js';


export const loginService = async ({ email, password }) => {
  try {
   
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
     

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('No email found');
    }

    // return {
    //     process: "continue"
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: '012923',
        image: 'ajksdbhasd',
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};
