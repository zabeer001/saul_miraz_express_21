import express from 'express';
import {
  orderStore,
  orderIndex,
  orderShow,
  orderUpdate,
  orderDestroy,
  orderStats,
  orderBestSellingProducts
} from '../controllers/order.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from "../helpers/multer.js";

const orderRouter = express.Router();

orderRouter.get('/stats', authenticate, isAdmin, orderStats);
orderRouter.get('/best-selling-products', orderBestSellingProducts);

orderRouter.post('/', upload.none(), authenticate, orderStore);
orderRouter.get('/', authenticate, orderIndex);
orderRouter.get('/:id', orderShow);
orderRouter.put('/:id', upload.none(), authenticate, isAdmin, orderUpdate);
orderRouter.delete('/:id', authenticate, isAdmin, orderDestroy);

export default orderRouter;
