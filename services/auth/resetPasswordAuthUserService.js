import User from "../../models/user.model.js";
import bcrypt from 'bcryptjs';

export const resetPasswordAuthUserService = async (req) => {
  try {
    const { current_password, password } = req.body;
    const authUser = req.authUser;

    if (!authUser || !authUser._id) {
      return { status: 401, message: 'Unauthorized' };
    }

    if (!current_password || !password) {
      return { status: 400, message: 'Current password and new password are required' };
    }

    const user = await User.findById(authUser._id);
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return { status: 400, message: 'Current password is incorrect' };
    }

    // Hash and set new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return {
      status: 200,
      message: 'Password reset successfully',
    };
  } catch (error) {
    return {
      status: 400,
      message: 'Failed to reset password',
      error: error.message,
    };
  }
};
