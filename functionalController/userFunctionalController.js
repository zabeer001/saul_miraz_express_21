import { changeProfileDetailsService } from "../services/auth/changeProfileDetailsService.js";
import { resetPasswordAuthUserService } from "../services/auth/resetPasswordAuthUserService.js";


export const changeProfileDetails = async (req, res) => {
  try {
    const result = await changeProfileDetailsService(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(400).json({
      message: 'Profile update failed',
      error: error.message,
    });
  }
};

export const resetPasswordAuthUser = async (req, res) => {
  try {
    const result = await resetPasswordAuthUserService(req);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(400).json({
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};