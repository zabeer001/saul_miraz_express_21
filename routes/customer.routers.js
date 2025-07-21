import express from 'express';

import { authenticate } from '../middleware/authMiddleware.js';
import CustomerController from '../controllers/customer.controller.js';

const customerRouter = express.Router();

// users can post reviews
customerRouter.get('/', authenticate, CustomerController.customers); // public access?
// only admin can delete reviews

export default customerRouter;