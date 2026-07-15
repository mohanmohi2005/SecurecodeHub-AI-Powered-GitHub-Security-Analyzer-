import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const fixRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Reset everyone to 'user'
    const resetResult = await User.updateMany({}, { $set: { role: 'user' } });
    console.log(`Reset ${resetResult.modifiedCount} users to 'user' role.`);

    // Set the specific account to 'admin'
    const adminResult = await User.updateOne(
      { email: 'themohi2005@gmail.com' },
      { $set: { role: 'admin' } }
    );
    
    if (adminResult.modifiedCount > 0) {
      console.log("Successfully set 'themohi2005@gmail.com' to admin.");
    } else {
      console.log("Warning: Could not find 'themohi2005@gmail.com' in the database (or it was already admin before the reset).");
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing roles:', error);
    process.exit(1);
  }
};

fixRoles();
