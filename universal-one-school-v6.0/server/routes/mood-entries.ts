import express from 'express';
import { z } from 'zod';
import { MemStorage } from '../storage';
import { insertMoodEntrySchema } from '../../shared/schema';

const router = express.Router();
const storage = new MemStorage();

// Get all mood entries
router.get('/', async (req, res) => {
  try {
    const entries = await storage.getMoodEntries();
    res.json(entries);
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

// Get mood entry by id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entry = await storage.getMoodEntry(id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching mood entry:', error);
    res.status(500).json({ error: 'Failed to fetch mood entry' });
  }
});

// Get mood entries by user id
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const entries = await storage.getUserMoodEntries(userId);
    
    res.json(entries);
  } catch (error) {
    console.error('Error fetching user mood entries:', error);
    res.status(500).json({ error: 'Failed to fetch user mood entries' });
  }
});

// Create a new mood entry
router.post('/', async (req, res) => {
  try {
    const moodData = insertMoodEntrySchema.parse(req.body);
    const newEntry = await storage.createMoodEntry(moodData);
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error creating mood entry:', error);
    res.status(400).json({ error: 'Failed to create mood entry' });
  }
});

// Update a mood entry
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const moodData = insertMoodEntrySchema.partial().parse(req.body);
    
    const updatedEntry = await storage.updateMoodEntry(id, moodData);
    
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.json(updatedEntry);
  } catch (error) {
    console.error('Error updating mood entry:', error);
    res.status(400).json({ error: 'Failed to update mood entry' });
  }
});

// Delete a mood entry
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await storage.deleteMoodEntry(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    res.status(500).json({ error: 'Failed to delete mood entry' });
  }
});

export default router;