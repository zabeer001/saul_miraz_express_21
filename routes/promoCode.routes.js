import express from 'express';
import {
  promoCodeStats,
  promoCodeStore,
  promoCodeIndex,
  promoCodeShow,
  promoCodeUpdate,
  promoCodeDestroy
} from '../controllers/promoCode.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../helpers/multer.js';

const promoCodeRouter = express.Router();

// Promo code stats
promoCodeRouter.get('/stats', promoCodeStats);

// Create promo code
promoCodeRouter.post(
  '/',
  upload.none(),
  authenticate,
  isAdmin,
  promoCodeStore
);

// Get all promo codes
promoCodeRouter.get('/', promoCodeIndex);

// Get single promo code
promoCodeRouter.get('/:id', promoCodeShow);

// Update promo code
promoCodeRouter.put(
  '/:id',
  upload.none(),
  authenticate,
  isAdmin,
  promoCodeUpdate
);

// Delete promo code
promoCodeRouter.delete(
  '/:id',
  authenticate,
  isAdmin,
  promoCodeDestroy
);

export default promoCodeRouter;
