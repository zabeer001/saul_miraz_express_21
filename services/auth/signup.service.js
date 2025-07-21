import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config/env.js';
import { hashPassword } from '../../helpers/hashPassowrd.js';
import User from '../../models/user.model.js';




export const signUpService = async ({ name, email, password }) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword });
    await user.save({ session });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
