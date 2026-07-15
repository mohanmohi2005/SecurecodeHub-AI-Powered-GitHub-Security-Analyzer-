import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import repositoryRoutes from './routes/repositoryRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/securecodehub';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Database connection
const maskedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
console.log(`Connecting to MongoDB at: ${maskedURI}`);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
  .then(() => {
    console.log('MongoDB Connected Successfully.');
  })
  .catch(async (err) => {
    console.error('MongoDB connection error:', err.message || err);
    console.error('Tip: Make sure your MONGODB_URI is correct in the .env file and your current IP address is whitelisted in the MongoDB Atlas Network Access settings.');
    console.log('\n--- Falling back to local in-memory MongoDB ---');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log('In-memory MongoDB Connected Successfully at:', inMemoryUri);
    } catch (fallbackErr) {
      console.error('Failed to start in-memory MongoDB:', fallbackErr);
    }
  });

// Root check route
app.get('/', (req, res) => {
  res.json({ message: 'Secure CodeHub API is running.' });
});

// Authentication routes
app.use('/', authRoutes);

// Repository routes
app.use('/api/repository', repositoryRoutes);

// Scan routes
app.use('/api/scan', scanRoutes);

// GitHub routes
app.use('/api/github', githubRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
