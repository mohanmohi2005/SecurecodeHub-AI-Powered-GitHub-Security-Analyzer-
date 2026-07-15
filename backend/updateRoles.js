import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users to have the 'admin' role
    const result = await User.updateMany({}, { $set: { role: 'admin' } });
    console.log(`Successfully updated ${result.modifiedCount} users to 'admin'.`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating roles:', error);
    process.exit(1);
  }
};

updateRoles();
