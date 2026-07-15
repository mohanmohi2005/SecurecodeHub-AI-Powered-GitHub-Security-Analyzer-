import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repositoryName: {
    type: String,
    required: true
  },
  repositoryUrl: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    default: 'main'
  },
  language: {
    type: String,
    default: 'Unknown'
  },
  scanDate: {
    type: Date,
    default: Date.now
  },
  securityScore: {
    type: Number,
    default: 100
  },
  lastCommitHash: {
    type: String,
    default: ''
  }
});

const Repository = mongoose.model('Repository', repositorySchema);
export default Repository;
