import express from 'express';
import {
  categoryIndex,
  categoryIndexByType,
  categoryStore,
  categoryShow,
  categoryUpdate,
  categoryDestroy,
  categoryStats
} from '../controllers/category.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from "../helpers/multer.js";

const categoryRouter = express.Router();

// Routes
categoryRouter.get('/by-type', categoryIndexByType);
categoryRouter.get('/stats', categoryStats);



categoryRouter.post(
  '/',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  authenticate,
  isAdmin,
  categoryStore
);

categoryRouter.get('/', categoryIndex);
categoryRouter.get('/:id', categoryShow);

categoryRouter.put(
  '/:id',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  authenticate,
  isAdmin,
  categoryUpdate
);

categoryRouter.delete(
  '/:id',
  authenticate,
  isAdmin,
  categoryDestroy // using 'destroy' to avoid 'delete' keyword conflict
);



export default categoryRouter;
