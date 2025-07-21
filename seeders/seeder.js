import mongoose from 'mongoose';
import { DB_URI } from '../config/env.js';

import userSeeder from './userSeeder.js';
import categorySeeder from './categorySeeder.js';
import productSeeder from './productSeeder.js';
import { reviewSeeder } from './reviewSeeder.js';
import { promoCodeSeeder } from './promoCodeSeeder.js';
import { orderSeeder } from './orderSeeder.js';
import { orderProductSeeder } from './orderProductSeeder.js';
import contactSeeder from './conatctSeeder.js';

// import productSeeder from './productSeeder.js';


const runAllSeeders = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');

    await userSeeder();
    await categorySeeder();
    await productSeeder();
    await reviewSeeder();
    await promoCodeSeeder();
    await orderSeeder();
    await orderProductSeeder();
    await contactSeeder();

    console.log('All seeders completed');

    process.exit(0);
  } catch (error) {
    console.error('Error running seeders:', error);
    process.exit(1);
  }
};

runAllSeeders();
