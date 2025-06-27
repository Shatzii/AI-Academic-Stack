#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const multer = require('multer');
const archiver = require('archiver');
const extract = require('extract-zip');

const app = express();
const PORT = process.env.VC_PORT || 3001;
const REPOS_DIR = process.env.VC_REPOS_DIR || './repositories';
const UPLOADS_DIR = './uploads';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Ensure directories exist
[REPOS_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

class VersionControl {
  constructor(repoPath) {
    this.repoPath = repoPath;
    this.metaPath = path.join(repoPath, '.vc');
    this.versionsPath = path.join(this.metaPath, 'versions');
    this.branchesPath = path.join(this.metaPath, 'branches');
    this.currentBranch = 'main';
    this.init();
  }

  init() {
    if (!fs.existsSync(this.metaPath)) {
      fs.mkdirSync(this.metaPath, { recursive: true });
      fs.mkdirSync(this.versionsPath, { recursive: true });
      fs.mkdirSync(this.branchesPath, { recursive: true });
      
      // Create main branch
      fs.writeFileSync(
        path.join(this.branchesPath, 'main.json'),
        JSON.stringify({ commits: [], head: null })
      );
      
      // Set current branch
      fs.writeFileSync(
        path.join(this.metaPath, 'HEAD'),
        'main'
      );
    }
  }

  generateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  getCurrentBranch() {
    if (fs.existsSync(path.join(this.metaPath, 'HEAD'))) {
      return fs.readFileSync(path.join(this.metaPath, 'HEAD'), 'utf8').trim();
    }
    return 'main';
  }

  getBranchData(branchName = null) {
    const branch = branchName || this.getCurrentBranch();
    const branchFile = path.join(this.branchesPath, `${branch}.json`);
    if (fs.existsSync(branchFile)) {
      return JSON.parse(fs.readFileSync(branchFile, 'utf8'));
    }
    return { commits: [], head: null };
  }

  saveBranchData(branchData, branchName = null) {
    const branch = branchName || this.getCurrentBranch();
    const branchFile = path.join(this.branchesPath, `${branch}.json`);
    fs.writeFileSync(branchFile, JSON.stringify(branchData, null, 2));
  }

  createCommit(message, author = 'System', files = []) {
    const timestamp = new Date().toISOString();
    const commitId = this.generateHash(`${timestamp}-${message}-${author}`);
    
    // Create snapshot of current state
    const snapshot = this.createSnapshot(files);
    
    const commit = {
      id: commitId,
      message,
      author,
      timestamp,
      snapshot,
      files: files.map(f => ({
        path: f.path,
        hash: f.hash,
        size: f.size,
        type: f.type
      }))
    };

    // Save commit
    const commitFile = path.join(this.versionsPath, `${commitId}.json`);
    fs.writeFileSync(commitFile, JSON.stringify(commit, null, 2));

    // Update branch
    const branchData = this.getBranchData();
    branchData.commits.push(commitId);
    branchData.head = commitId;
    this.saveBranchData(branchData);

    return commit;
  }

  createSnapshot(files) {
    const snapshotId = this.generateHash(`snapshot-${Date.now()}`);
    const snapshotDir = path.join(this.versionsPath, `snapshot-${snapshotId}`);
    
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }

    files.forEach(file => {
      const targetPath = path.join(snapshotDir, file.path);
      const targetDir = path.dirname(targetPath);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      if (fs.existsSync(file.fullPath)) {
        fs.copyFileSync(file.fullPath, targetPath);
      }
    });

    return snapshotId;
  }

  getCommit(commitId) {
    const commitFile = path.join(this.versionsPath, `${commitId}.json`);
    if (fs.existsSync(commitFile)) {
      return JSON.parse(fs.readFileSync(commitFile, 'utf8'));
    }
    return null;
  }

  getHistory(limit = 50) {
    const branchData = this.getBranchData();
    return branchData.commits
      .slice(-limit)
      .reverse()
      .map(commitId => this.getCommit(commitId))
      .filter(Boolean);
  }

  createBranch(branchName, fromCommit = null) {
    const branchFile = path.join(this.branchesPath, `${branchName}.json`);
    
    if (fs.existsSync(branchFile)) {
      throw new Error(`Branch ${branchName} already exists`);
    }

    let branchData;
    if (fromCommit) {
      const currentBranch = this.getBranchData();
      const commitIndex = currentBranch.commits.indexOf(fromCommit);
      if (commitIndex === -1) {
        throw new Error(`Commit ${fromCommit} not found`);
      }
      branchData = {
        commits: currentBranch.commits.slice(0, commitIndex + 1),
        head: fromCommit
      };
    } else {
      branchData = this.getBranchData();
    }

    fs.writeFileSync(branchFile, JSON.stringify(branchData, null, 2));
    return branchName;
  }

  switchBranch(branchName) {
    const branchFile = path.join(this.branchesPath, `${branchName}.json`);
    if (!fs.existsSync(branchFile)) {
      throw new Error(`Branch ${branchName} does not exist`);
    }
    
    fs.writeFileSync(path.join(this.metaPath, 'HEAD'), branchName);
    return branchName;
  }

  getBranches() {
    const branches = [];
    const currentBranch = this.getCurrentBranch();
    
    fs.readdirSync(this.branchesPath).forEach(file => {
      if (file.endsWith('.json')) {
        const branchName = file.replace('.json', '');
        const branchData = this.getBranchData(branchName);
        branches.push({
          name: branchName,
          current: branchName === currentBranch,
          commits: branchData.commits.length,
          head: branchData.head
        });
      }
    });

    return branches;
  }

  revertToCommit(commitId) {
    const commit = this.getCommit(commitId);
    if (!commit) {
      throw new Error(`Commit ${commitId} not found`);
    }

    const snapshotDir = path.join(this.versionsPath, `snapshot-${commit.snapshot}`);
    if (!fs.existsSync(snapshotDir)) {
      throw new Error(`Snapshot ${commit.snapshot} not found`);
    }

    // Copy snapshot back to repository
    this.copyDirectory(snapshotDir, this.repoPath);
    
    return commit;
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return;
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    entries.forEach(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  getStats() {
    const branchData = this.getBranchData();
    const branches = this.getBranches();
    
    return {
      currentBranch: this.getCurrentBranch(),
      totalCommits: branchData.commits.length,
      totalBranches: branches.length,
      latestCommit: branchData.head ? this.getCommit(branchData.head) : null,
      repositorySize: this.getDirectorySize(this.repoPath),
      metadataSize: this.getDirectorySize(this.metaPath)
    };
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    if (!fs.existsSync(dirPath)) return 0;
    
    const walk = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          walk(filePath);
        } else {
          totalSize += stats.size;
        }
      });
    };
    
    walk(dirPath);
    return totalSize;
  }
}

// API Routes

// Get repository info
app.get('/api/repos/:repoName', (req, res) => {
  try {
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const stats = vc.getStats();
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new repository
app.post('/api/repos', (req, res) => {
  try {
    const { name, description } = req.body;
    const repoPath = path.join(REPOS_DIR, name);
    
    if (fs.existsSync(repoPath)) {
      return res.status(400).json({ error: 'Repository already exists' });
    }
    
    fs.mkdirSync(repoPath, { recursive: true });
    const vc = new VersionControl(repoPath);
    
    // Create initial commit
    const commit = vc.createCommit('Initial commit', 'System', []);
    
    res.json({ name, description, initialCommit: commit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload files and create commit
app.post('/api/repos/:repoName/commit', upload.array('files'), (req, res) => {
  try {
    const { message, author = 'Anonymous' } = req.body;
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const files = [];
    
    // Process uploaded files
    req.files.forEach(file => {
      const targetPath = path.join(repoPath, file.originalname);
      const targetDir = path.dirname(targetPath);
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      fs.copyFileSync(file.path, targetPath);
      fs.unlinkSync(file.path); // Clean up upload
      
      files.push({
        path: file.originalname,
        fullPath: targetPath,
        hash: vc.generateHash(fs.readFileSync(targetPath)),
        size: file.size,
        type: file.mimetype
      });
    });
    
    const commit = vc.createCommit(message, author, files);
    res.json(commit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get commit history
app.get('/api/repos/:repoName/history', (req, res) => {
  try {
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const limit = parseInt(req.query.limit) || 50;
    const history = vc.getHistory(limit);
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific commit
app.get('/api/repos/:repoName/commits/:commitId', (req, res) => {
  try {
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const commit = vc.getCommit(req.params.commitId);
    
    if (!commit) {
      return res.status(404).json({ error: 'Commit not found' });
    }
    
    res.json(commit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create branch
app.post('/api/repos/:repoName/branches', (req, res) => {
  try {
    const { name, fromCommit } = req.body;
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const branchName = vc.createBranch(name, fromCommit);
    
    res.json({ name: branchName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get branches
app.get('/api/repos/:repoName/branches', (req, res) => {
  try {
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const branches = vc.getBranches();
    
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Switch branch
app.post('/api/repos/:repoName/checkout', (req, res) => {
  try {
    const { branch } = req.body;
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const currentBranch = vc.switchBranch(branch);
    
    res.json({ currentBranch });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revert to commit
app.post('/api/repos/:repoName/revert', (req, res) => {
  try {
    const { commitId } = req.body;
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const vc = new VersionControl(repoPath);
    const commit = vc.revertToCommit(commitId);
    
    res.json({ message: `Reverted to commit ${commitId}`, commit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download repository as ZIP
app.get('/api/repos/:repoName/download', (req, res) => {
  try {
    const repoPath = path.join(REPOS_DIR, req.params.repoName);
    if (!fs.existsSync(repoPath)) {
      return res.status(404).json({ error: 'Repository not found' });
    }
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.repoName}.zip"`);
    
    archive.pipe(res);
    archive.directory(repoPath, req.params.repoName);
    archive.finalize();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List all repositories
app.get('/api/repos', (req, res) => {
  try {
    const repos = [];
    const entries = fs.readdirSync(REPOS_DIR, { withFileTypes: true });
    
    entries.forEach(entry => {
      if (entry.isDirectory()) {
        const repoPath = path.join(REPOS_DIR, entry.name);
        const vc = new VersionControl(repoPath);
        const stats = vc.getStats();
        
        repos.push({
          name: entry.name,
          ...stats
        });
      }
    });
    
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🔧 Shatzii Version Control Server running on port ${PORT}`);
  console.log(`📁 Repositories directory: ${path.resolve(REPOS_DIR)}`);
  console.log(`🌐 Access the web interface at: http://localhost:${PORT}`);
});

module.exports = { app, VersionControl };
