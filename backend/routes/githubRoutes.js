import express from 'express';
import { getGithubAuthUrl, handleGithubCallback, getGithubStatus, getGithubRepos } from '../controllers/githubController.js';

const router = express.Router();

router.get('/auth', getGithubAuthUrl);
router.post('/callback', handleGithubCallback);
router.get('/status', getGithubStatus);
router.get('/repos', getGithubRepos);

export default router;
