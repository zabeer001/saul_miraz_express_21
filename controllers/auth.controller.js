import { signUpService } from '../services/auth/signup.service.js';
import { loginService } from '../services/auth/login.service.js';
import { logoutService } from '../services/auth/logout.service.js';
import { googleLogin } from '../services/auth/googleLogin.js';
import { changeProfileDetailsService } from '../services/auth/changeProfileDetailsService.js';
import { resetPasswordAuthUserService } from '../services/auth/resetPasswordAuthUserService.js';

export const signUp = async (req, res) => {

  console.log('SignUp Request:', req.body);

  try {
    const result = await signUpService(req.body);

    // console.log('User registered successfully:', result);
    return res.status(201).json({
      message: 'User registered successfully',
     ...result,
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(400).json({
      message: 'Signup failed',
      error: error.message || 'Something went wrong',
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    return res.status(201).json({
      message: 'User login successfully',
      ...result,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // ✅ Extract token from header
  try {
    const result = await logoutService(token);
    return res.json(result);
  } catch (err) {
    console.error('Logout error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.authUser; // 👈 already fetched in middleware
    return res.json({
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const result = await googleLogin(req.body);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(400).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

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
