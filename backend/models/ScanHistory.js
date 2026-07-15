import mongoose from 'mongoose';

const scanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  scanDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'complete', 'failed'],
    default: 'pending'
  },
  filesScanned: {
    type: Number,
    default: 0
  },
  vulnerabilitiesFound: {
    type: Number,
    default: 0
  }
});

const ScanHistory = mongoose.model('ScanHistory', scanHistorySchema);
export default ScanHistory;
