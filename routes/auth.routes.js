import { Router } from 'express';

import upload from '../helpers/multer.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { changeProfileDetails, login, loginWithGoogle, logout, profile, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

// Existing routes
authRouter.post('/login', upload.none(), login);
authRouter.post('/register', upload.none(), signUp);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/me', authenticate, profile);
authRouter.post('/change-profile-deatils', authenticate, changeProfileDetails);
authRouter.post('/google/jwt-process', upload.none(), loginWithGoogle);

export default authRouter;