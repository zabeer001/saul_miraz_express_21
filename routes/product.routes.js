import express from 'express';
import {
  productStats,
  productStore,
  productIndex,
  productShow,
  productUpdate,
  productDestroy
} from '../controllers/product.controller.js';
import upload from "../helpers/multer.js";
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const productRouter = express.Router();

// Product stats
productRouter.get('/stats', productStats);

// Store product
productRouter.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'media', maxCount: 7 },
  ]),
  authenticate,
  isAdmin,
  productStore
);

// List products and single product
productRouter.get('/', productIndex);
productRouter.get('/:id', productShow);

// Update product
productRouter.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'media', maxCount: 7 },
  ]),
  authenticate,
  isAdmin,
  productUpdate
);

// Delete product
productRouter.delete('/:id', authenticate, isAdmin, productDestroy);

export default productRouter;
