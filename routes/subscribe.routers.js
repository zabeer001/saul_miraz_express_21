import express from 'express';
import SubscriberController from '../controllers/SubscriberController.js';
import upload from '../helpers/multer.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const subscribeRouter = express.Router();

subscribeRouter.post('/email', upload.none(), SubscriberController.sendSubscriptionMail);

export default subscribeRouter;