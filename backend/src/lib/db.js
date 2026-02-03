import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  try {
    const conn=await mongoose.connect(ENV.DB_URL);
    console.log(' ✅Database connected successfully', conn.connection.host);
  } catch (error) {
   
    console.error(' ❌Database connection failed', error);
    process.exit(1); //0 mean success ,1 means failure
  } 
};

