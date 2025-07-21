import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

const connectTODatacase = async () => {
  try {
   await mongoose.connect(DB_URI);
   console.log('connected to MongoDB successfully');
   
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export default connectTODatacase;