import { Router } from "express";

import { index } from "../controllers/user.controller.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";


const userRouter = Router();


userRouter.get('/',authenticate, isAdmin ,index);

export default userRouter;