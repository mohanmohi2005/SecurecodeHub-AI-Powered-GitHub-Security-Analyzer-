import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const verifyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email: 'themohi2005@gmail.com' });
    console.log("Here is the database record for themohi2005@gmail.com:");
    console.log(user);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

verifyDB();
