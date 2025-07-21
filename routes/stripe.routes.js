import express from 'express';
import upload from '../helpers/multer.js';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  stripeCheckout,
  stripeCheckoutCancel,
  stripeCheckoutSuccess,
  stripeCheckPaymentStatus,
} from '../controllers/stripe.controller.js';

const stripeRouter = express.Router();

stripeRouter.post('/checkout', upload.none(), authenticate, stripeCheckout);
stripeRouter.get('/payment/success', stripeCheckoutSuccess);
stripeRouter.get('/cancel', stripeCheckoutCancel);
stripeRouter.post('/check-payment-status', authenticate, stripeCheckPaymentStatus);

export default stripeRouter;
