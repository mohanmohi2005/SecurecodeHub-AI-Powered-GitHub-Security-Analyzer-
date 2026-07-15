import express from 'express';
import { startScan, getScanResults, getScanHistory, deleteScanHistory, getScanStats } from '../controllers/scanController.js';

const router = express.Router();

router.post('/start', startScan);
router.get('/results/:repositoryId', getScanResults);
router.get('/history/:userId', getScanHistory);
router.delete('/history/:id', deleteScanHistory);
router.get('/stats/:userId', getScanStats);

export default router;
