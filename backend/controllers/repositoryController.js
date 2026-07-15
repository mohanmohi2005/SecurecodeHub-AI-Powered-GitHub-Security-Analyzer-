import Repository from '../models/Repository.js';
import User from '../models/User.js';

export const addRepository = async (req, res) => {
  try {
    const { repositoryUrl, branch, userId } = req.body;

    if (!repositoryUrl || !userId) {
      return res.status(400).json({ message: 'Repository URL and User ID are required.' });
    }

    // Extract repository name from URL
    // e.g., https://github.com/username/repo.git -> username/repo
    // e.g., git@github.com:username/repo.git -> username/repo
    let repositoryName = 'Unknown Repository';
    const cleanUrl = repositoryUrl.trim();

    if (cleanUrl.startsWith('git@')) {
      const colonIndex = cleanUrl.indexOf(':');
      if (colonIndex !== -1) {
        let path = cleanUrl.substring(colonIndex + 1);
        if (path.endsWith('.git')) {
          path = path.slice(0, -4);
        }
        repositoryName = path;
      }
    } else {
      try {
        let parsedUrl = cleanUrl;
        if (!/^https?:\/\//i.test(parsedUrl)) {
          parsedUrl = 'https://' + parsedUrl;
        }
        const url = new URL(parsedUrl);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          repositoryName = `${parts[0]}/${parts[1]}`;
        } else if (parts.length === 1) {
          repositoryName = parts[0];
        }
        if (repositoryName.endsWith('.git')) {
          repositoryName = repositoryName.slice(0, -4);
        }
      } catch (e) {
        repositoryName = cleanUrl;
        if (repositoryName.endsWith('.git')) {
          repositoryName = repositoryName.slice(0, -4);
        }
      }
    }

    const newRepository = new Repository({
      userId,
      repositoryName,
      repositoryUrl,
      branch: branch || 'main'
    });

    const savedRepository = await newRepository.save();

    res.status(201).json(savedRepository);
  } catch (error) {
    console.error('Error adding repository:', error);
    res.status(500).json({ message: 'Failed to add repository.', error: error.message });
  }
};

export const getRepository = async (req, res) => {
  try {
    const repository = await Repository.findById(req.params.id);
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    res.status(200).json(repository);
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ message: 'Failed to fetch repository.', error: error.message });
  }
};

export const getRepositoryFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { filePath, userId } = req.query;

    if (!filePath || !userId) {
      return res.status(400).json({ message: 'filePath and userId are required.' });
    }

    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    const userDoc = await User.findById(userId).select('+githubAccessToken');
    const githubToken = userDoc ? userDoc.githubAccessToken : process.env.GITHUB_TOKEN;

    // Parse owner and repo
    let owner = '', repo = '';
    const nameParts = repository.repositoryName.split('/');
    if (nameParts.length === 2) {
      owner = nameParts[0];
      repo = nameParts[1];
    } else {
      return res.status(400).json({ message: 'Invalid repository name format.' });
    }

    const branch = repository.branch || 'main';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

    const fetchOptions = {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'SecureCodeHub-Analyzer'
      }
    };
    
    if (githubToken) {
      fetchOptions.headers['Authorization'] = `Bearer ${githubToken}`;
    }

    const fileRes = await fetch(apiUrl, fetchOptions);
    if (!fileRes.ok) {
      return res.status(fileRes.status).json({ message: 'Failed to fetch file from GitHub.' });
    }

    const content = await fileRes.text();
    res.status(200).json({ content });

  } catch (error) {
    console.error('Error fetching repository file:', error);
    res.status(500).json({ message: 'Failed to fetch file content.', error: error.message });
  }
};

