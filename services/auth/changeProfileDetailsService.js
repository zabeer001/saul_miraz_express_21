import { updateSingleImage } from "../../helpers/updateSingleImage.js";
import User from "../../models/user.model.js";

export const changeProfileDetailsService = async (req) => {
  try {
    const { name, phone } = req.body;
    const authUser = req.authUser; // authenticated user from middleware

    if (!authUser || !authUser._id) {
      return { status: 401, message: 'Unauthorized' };
    }

    // Fetch the user
    const user = await User.findById(authUser._id);
    if (!user) {
      return { status: 404, message: 'User not found' };
    }

    // Update name and phone if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle image update using Cloudinary
    if (req.file) {
      user.image = await updateSingleImage(req.file, user.image);
    }

    await user.save();

    return {
      status: 200,
      message: 'Profile updated successfully',
      data: user,
    };
  } catch (error) {
    return {
      status: 400,
      message: 'Failed to update profile',
      error: error.message,
    };
  }
};