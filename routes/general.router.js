import { Router } from 'express';
import upload from '../helpers/multer.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { changeProfileDetails, resetPasswordAuthUser } from '../functionalController/userFunctionalController.js';
import { changeOrderStatus } from '../functionalController/orderFuntionalController.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { sendSubscriberMail } from '../functionalController/emailNotificationController.js';


const generalRouter = Router();

// Change profile details (with image upload)
generalRouter.post(
  '/change-profile-details',
  authenticate,                 // ensure the user is authenticated
  upload.single('image'),        // handle single image upload
  changeProfileDetails          // call functional controller
);

// Reset password for authenticated user
generalRouter.post(
  '/password/reset-for-auth-user',
  authenticate,      // ensure user is logged in and req.authUser is set
  upload.none(),     // no files, only fields
  resetPasswordAuthUser
);

generalRouter.post(
  '/orders-status/:id',
  authenticate,      // ensure user is logged in
  isAdmin,
  upload.none(),     // no files, only fields
  changeOrderStatus  // controller
);

generalRouter.post('/subscribe',  upload.none() ,sendSubscriberMail);
// generalRouter.post('/subscribe',  upload.none() ,sendSubscriberMail);

export default generalRouter;