import express from 'express';
import { addRepository, getRepository, getRepositoryFile } from '../controllers/repositoryController.js';

const router = express.Router();

router.post('/add', addRepository);
router.get('/:id', getRepository);
router.get('/:id/file', getRepositoryFile);

export default router;
