import express from 'express';
import ContactController from '../controllers/contact.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import upload from "../helpers/multer.js";

const contactRouter = express.Router();



// Store new contact message (accessible to any authenticated user, or even public if no auth is needed)
contactRouter.post('/', upload.none(), ContactController.store);

// Admin-only routes
contactRouter.get('/', authenticate, isAdmin, ContactController.index);
contactRouter.get('/:id', authenticate, isAdmin, ContactController.show);
contactRouter.put('/:id', upload.none(), authenticate, isAdmin, ContactController.update);
contactRouter.delete('/:id', authenticate, isAdmin, ContactController.destroy);

export default contactRouter;
