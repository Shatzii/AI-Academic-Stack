/**
 * Simple Assignment API Routes
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Create data directories if they don't exist
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const ASSIGNMENTS_DIR = path.join(DATA_DIR, 'assignments');
const SUBMISSIONS_DIR = path.join(DATA_DIR, 'submissions');
const FEEDBACK_DIR = path.join(DATA_DIR, 'feedback');

[DATA_DIR, ASSIGNMENTS_DIR, SUBMISSIONS_DIR, FEEDBACK_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Simple health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Assignment API is operational'
  });
});

// Get all assignments
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(ASSIGNMENTS_DIR);
    const assignments = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        try {
          const data = fs.readFileSync(path.join(ASSIGNMENTS_DIR, file), 'utf8');
          return JSON.parse(data);
        } catch (err) {
          console.error(`Error reading file ${file}:`, err);
          return null;
        }
      })
      .filter(Boolean);
    
    res.json(assignments);
  } catch (error) {
    console.error('Error reading assignments directory:', error);
    res.status(500).json({
      error: 'Failed to retrieve assignments',
      details: error.message
    });
  }
});

// Create a new assignment
router.post('/', (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Assignment title is required' });
    }
    
    const assignmentId = 'assignment_' + Date.now();
    const assignment = {
      id: assignmentId,
      title,
      description: description || '',
      dateCreated: new Date().toISOString(),
      submissions: []
    };
    
    fs.writeFileSync(
      path.join(ASSIGNMENTS_DIR, `${assignmentId}.json`),
      JSON.stringify(assignment, null, 2)
    );
    
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      error: 'Failed to create assignment',
      details: error.message
    });
  }
});

// Get an assignment by ID
router.get('/:id', (req, res) => {
  try {
    const filePath = path.join(ASSIGNMENTS_DIR, `${req.params.id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        error: 'Assignment not found'
      });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    const assignment = JSON.parse(data);
    
    res.json(assignment);
  } catch (error) {
    console.error('Error retrieving assignment:', error);
    res.status(500).json({
      error: 'Failed to retrieve assignment',
      details: error.message
    });
  }
});

// Submit an assignment
router.post('/submit', (req, res) => {
  try {
    const { assignmentId, studentId, content } = req.body;
    
    if (!assignmentId || !studentId) {
      return res.status(400).json({
        error: 'Assignment ID and student ID are required'
      });
    }
    
    // Check if assignment exists
    const assignmentPath = path.join(ASSIGNMENTS_DIR, `${assignmentId}.json`);
    if (!fs.existsSync(assignmentPath)) {
      return res.status(404).json({
        error: 'Assignment not found'
      });
    }
    
    // Create submission
    const submissionId = 'submission_' + Date.now();
    const submission = {
      id: submissionId,
      assignmentId,
      studentId,
      content: content || '',
      dateSubmitted: new Date().toISOString(),
      graded: false
    };
    
    // Save submission
    fs.writeFileSync(
      path.join(SUBMISSIONS_DIR, `${submissionId}.json`),
      JSON.stringify(submission, null, 2)
    );
    
    // Update assignment with submission reference
    const assignmentData = fs.readFileSync(assignmentPath, 'utf8');
    const assignment = JSON.parse(assignmentData);
    
    assignment.submissions.push({
      submissionId,
      studentId,
      dateSubmitted: submission.dateSubmitted
    });
    
    fs.writeFileSync(
      assignmentPath,
      JSON.stringify(assignment, null, 2)
    );
    
    res.status(201).json({
      message: 'Submission successful',
      submissionId,
      dateSubmitted: submission.dateSubmitted
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      error: 'Failed to submit assignment',
      details: error.message
    });
  }
});

// Grade a submission
router.post('/grade', (req, res) => {
  try {
    const { submissionId, teacherId, score, feedback } = req.body;
    
    if (!submissionId || !teacherId || score === undefined) {
      return res.status(400).json({
        error: 'Submission ID, teacher ID, and score are required'
      });
    }
    
    // Check if submission exists
    const submissionPath = path.join(SUBMISSIONS_DIR, `${submissionId}.json`);
    if (!fs.existsSync(submissionPath)) {
      return res.status(404).json({
        error: 'Submission not found'
      });
    }
    
    // Update submission with grade
    const submissionData = fs.readFileSync(submissionPath, 'utf8');
    const submission = JSON.parse(submissionData);
    
    submission.graded = true;
    submission.score = parseFloat(score);
    submission.feedback = feedback || '';
    submission.gradedBy = teacherId;
    submission.gradedAt = new Date().toISOString();
    
    fs.writeFileSync(
      submissionPath,
      JSON.stringify(submission, null, 2)
    );
    
    // Create feedback record
    const feedbackId = 'feedback_' + Date.now();
    const feedbackRecord = {
      id: feedbackId,
      submissionId,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      teacherId,
      score: parseFloat(score),
      feedback: feedback || '',
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(FEEDBACK_DIR, `${feedbackId}.json`),
      JSON.stringify(feedbackRecord, null, 2)
    );
    
    res.json({
      message: 'Submission graded successfully',
      submissionId,
      score,
      gradedAt: submission.gradedAt
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      error: 'Failed to grade submission',
      details: error.message
    });
  }
});

// Get submissions for an assignment
router.get('/:id/submissions', (req, res) => {
  try {
    const assignmentId = req.params.id;
    const files = fs.readdirSync(SUBMISSIONS_DIR);
    
    const submissions = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = fs.readFileSync(path.join(SUBMISSIONS_DIR, file), 'utf8');
        return JSON.parse(data);
      })
      .filter(submission => submission.assignmentId === assignmentId);
    
    res.json(submissions);
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    res.status(500).json({
      error: 'Failed to retrieve submissions',
      details: error.message
    });
  }
});

module.exports = router;