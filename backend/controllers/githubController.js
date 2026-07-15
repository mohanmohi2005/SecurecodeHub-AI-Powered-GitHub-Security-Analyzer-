import axios from 'axios';
import User from '../models/User.js';

export const getGithubAuthUrl = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.FRONTEND_URL}/github/callback`;
  const scope = 'repo';
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  res.json({ url: githubUrl });
};

export const handleGithubCallback = async (req, res) => {
  const { code, userId } = req.body;

  if (!code || !userId) {
    return res.status(400).json({ error: 'Code and userId are required' });
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: {
        Accept: 'application/json'
      }
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to retrieve access token' });
    }

    // 2. Get GitHub user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { login: githubUsername, id: githubId } = userResponse.data;

    // 3. Save to database
    await User.findByIdAndUpdate(userId, {
      githubId: githubId.toString(),
      githubUsername,
      githubAccessToken: access_token
    });

    res.json({ message: 'GitHub connected successfully', githubUsername });

  } catch (error) {
    console.error('GitHub OAuth Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to connect to GitHub' });
  }
};

export const getGithubStatus = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'UserId is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Assuming we want to check if they have a githubId
    const isConnected = !!user.githubId;
    
    res.json({ isConnected, githubUsername: user.githubUsername });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get GitHub status' });
  }
};

export const getGithubRepos = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'UserId is required' });

    const user = await User.findById(userId).select('+githubAccessToken');
    if (!user || !user.githubAccessToken) {
      return res.status(401).json({ error: 'GitHub not connected' });
    }

    const reposResponse = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${user.githubAccessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    // Map to a cleaner format for the frontend
    const repos = reposResponse.data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      private: repo.private,
      language: repo.language,
      updated_at: repo.updated_at
    }));

    res.json({ repos });
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch repositories from GitHub' });
  }
};
