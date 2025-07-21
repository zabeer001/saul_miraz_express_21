import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DB_URI = process.env.DB_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '';

export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';
// .env.development.local


export const STRIPE_KEY = process.env.STRIPE_KEY || '';
export const STRIPE_SECRET = process.env.STRIPE_SECRET || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export const FRONTEND_URL = process.env.FRONTEND_URL || '';
export const BACKEND_URL = process.env.BACKEND_URL || '';

export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASS = process.env.EMAIL_PASS || '';
