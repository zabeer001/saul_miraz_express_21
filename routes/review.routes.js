import express from 'express';
import {
  reviewHomePage,
  reviewStore,
  reviewIndex,
  reviewShow,
  reviewUpdate,
  reviewDestroy
} from '../controllers/review.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from '../helpers/multer.js';

const reviewRouter = express.Router();

// Home page reviews (latest 5-star reviews)
reviewRouter.get('/home-page', reviewHomePage);

// User can post reviews
reviewRouter.post('/', upload.none(), authenticate, reviewStore);

// Public access to all reviews
reviewRouter.get('/', reviewIndex);

// Single review show
reviewRouter.get('/:id', reviewShow);

// User can update their review
reviewRouter.put('/:id', upload.none(), authenticate, reviewUpdate);

// Only admin can delete reviews
reviewRouter.delete('/:id', authenticate, isAdmin, reviewDestroy);

export default reviewRouter;
