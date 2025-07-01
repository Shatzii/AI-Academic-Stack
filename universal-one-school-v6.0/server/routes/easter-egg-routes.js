/**
 * Easter Egg Routes
 * 
 * These routes handle all Easter egg functionality, including checking for 
 * Easter eggs at specific paths, tracking user discoveries, and completing Easter eggs.
 */

import express from 'express';
const router = express.Router();

// Initialize with some sample Easter eggs
const sampleEasterEggs = [
  {
    id: 'egg1',
    name: 'Hidden Learning Fact',
    description: 'You discovered a hidden neuroscience fact about learning!',
    type: 'fact',
    path: '/superhero-school/dashboard',
    action: null, // Triggered by just visiting the page
    difficulty: 'easy',
    content: {
      title: 'Neuroscience of Learning',
      facts: [
        'The brain forms new neural connections when learning new information, a process called neuroplasticity.',
        'Taking short breaks during study sessions can improve long-term memory retention by up to 30%.',
        'Learning a musical instrument can enhance mathematical and spatial-temporal reasoning skills.'
      ],
      source: 'Journal of Cognitive Neuroscience'
    },
    reward: {
      xp: 50,
      badge: { name: 'Brain Explorer' }
    }
  },
  {
    id: 'egg2',
    name: 'Law School Challenge',
    description: 'You found a hidden legal challenge!',
    type: 'quiz',
    path: '/law-school/courses',
    action: 'click-books',
    difficulty: 'medium',
    content: {
      introduction: 'Test your knowledge of legal principles with this pop quiz!',
      questions: [
        {
          question: 'What legal principle states that a person is innocent until proven guilty?',
          options: ['Habeas corpus', 'Presumption of innocence', 'Double jeopardy', 'Burden of proof'],
          correctIndex: 1
        },
        {
          question: 'In contract law, what is consideration?',
          options: ['The act of thinking about an offer', 'Something of value exchanged in a contract', 'The physical location where a contract is signed', 'The amount of time given to accept an offer'],
          correctIndex: 1
        }
      ]
    },
    reward: {
      xp: 100,
      badge: { name: 'Legal Eagle' }
    }
  },
  {
    id: 'egg3',
    name: 'Language Master Konami',
    description: 'You activated the Konami code on a language learning page!',
    type: 'mini_game',
    path: '/language-school',
    action: 'konami-code',
    difficulty: 'hard',
    content: {
      title: 'Speed Vocabulary Challenge',
      instructions: 'Match as many words as possible with their translations in 60 seconds!'
    },
    reward: {
      xp: 200,
      badge: { name: 'Code Linguist' },
      unlocks: { name: 'Bonus vocabulary lists' }
    }
  },
  {
    id: 'egg4',
    name: 'Secret Developer Message',
    description: 'You found a secret message from the developers!',
    type: 'hidden_message',
    path: '/about',
    action: 'click-logo-5-times',
    difficulty: 'medium',
    content: {
      title: 'A Message from the ShotziOS Team',
      message: 'Thank you for exploring our platform so thoroughly! We built ShotziOS with love and dedication to create an inclusive educational experience for all learners. Keep exploring, and you might find more surprises!'
    },
    reward: {
      xp: 75,
      specialMessage: 'The developers appreciate your curiosity!'
    }
  }
];

// In-memory storage for Easter eggs and user discoveries
// This would be replaced with database storage in production
let easterEggs = [...sampleEasterEggs];
const userDiscoveries = {};

/**
 * Get all Easter eggs (admin only)
 */
router.get('/all', (req, res) => {
  // In a real app, check if user is admin
  res.json({
    success: true,
    data: easterEggs
  });
});

/**
 * Check for Easter eggs at a specific path and with a specific action
 */
router.post('/check', (req, res) => {
  const { path, action, userId } = req.body;
  
  if (!path || !userId) {
    return res.status(400).json({
      success: false,
      error: 'Path and userId are required'
    });
  }
  
  // Find a matching Easter egg
  const easterEgg = easterEggs.find(egg => 
    egg.path === path && 
    (egg.action === null || egg.action === action)
  );
  
  if (!easterEgg) {
    return res.json({
      success: true,
      found: false
    });
  }
  
  // Check if this is a new discovery for the user
  if (!userDiscoveries[userId]) {
    userDiscoveries[userId] = [];
  }
  
  const isNewDiscovery = !userDiscoveries[userId].some(
    discovery => discovery.easterEggId === easterEgg.id
  );
  
  // If it's a new discovery, add it to the user's discoveries
  if (isNewDiscovery) {
    userDiscoveries[userId].push({
      easterEggId: easterEgg.id,
      easterEggName: easterEgg.name,
      discoveredAt: new Date().toISOString(),
      completed: false
    });
  }
  
  res.json({
    success: true,
    found: true,
    easterEgg,
    isNewDiscovery
  });
});

/**
 * Complete an Easter egg and earn rewards
 */
router.post('/complete', (req, res) => {
  const { userId, easterEggId, earnedReward } = req.body;
  
  if (!userId || !easterEggId) {
    return res.status(400).json({
      success: false,
      error: 'userId and easterEggId are required'
    });
  }
  
  // Find the Easter egg
  const easterEgg = easterEggs.find(egg => egg.id === easterEggId);
  
  if (!easterEgg) {
    return res.status(404).json({
      success: false,
      error: 'Easter egg not found'
    });
  }
  
  // Find the user's discovery
  if (!userDiscoveries[userId]) {
    userDiscoveries[userId] = [];
  }
  
  const discoveryIndex = userDiscoveries[userId].findIndex(
    discovery => discovery.easterEggId === easterEggId
  );
  
  if (discoveryIndex === -1) {
    // If the user hasn't discovered this Easter egg yet, add it
    userDiscoveries[userId].push({
      easterEggId: easterEgg.id,
      easterEggName: easterEgg.name,
      discoveredAt: new Date().toISOString(),
      completed: true,
      earnedReward: earnedReward
    });
  } else {
    // Update the existing discovery
    userDiscoveries[userId][discoveryIndex].completed = true;
    userDiscoveries[userId][discoveryIndex].earnedReward = earnedReward;
  }
  
  // In a real app, we would also update the user's XP, badges, etc.
  
  res.json({
    success: true,
    message: 'Easter egg completed successfully',
    reward: earnedReward ? easterEgg.reward : null
  });
});

/**
 * Get Easter egg stats for a user
 */
router.get('/stats/:userId', (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'userId is required'
    });
  }
  
  // Get the user's discoveries
  const userStats = {
    discoveredCount: 0,
    completedCount: 0,
    totalEasterEggs: easterEggs.length,
    percentageFound: 0,
    byDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    byType: {
      quiz: 0,
      fact: 0,
      challenge: 0,
      mini_game: 0,
      hidden_message: 0,
      achievement: 0
    },
    recentDiscoveries: []
  };
  
  if (userDiscoveries[userId]) {
    const discoveries = userDiscoveries[userId];
    userStats.discoveredCount = discoveries.length;
    userStats.completedCount = discoveries.filter(d => d.completed).length;
    userStats.percentageFound = Math.round((discoveries.length / easterEggs.length) * 100);
    
    // Get recent discoveries
    userStats.recentDiscoveries = discoveries
      .sort((a, b) => new Date(b.discoveredAt) - new Date(a.discoveredAt))
      .slice(0, 5)
      .map(d => ({
        id: d.easterEggId,
        easterEggName: d.easterEggName,
        discoveredAt: d.discoveredAt,
        completed: d.completed
      }));
    
    // Count by difficulty and type
    discoveries.forEach(discovery => {
      const egg = easterEggs.find(e => e.id === discovery.easterEggId);
      if (egg) {
        if (egg.difficulty) {
          userStats.byDifficulty[egg.difficulty]++;
        }
        if (egg.type) {
          userStats.byType[egg.type]++;
        }
      }
    });
  }
  
  res.json({
    success: true,
    data: userStats
  });
});

/**
 * Create a new Easter egg (admin only)
 */
router.post('/create', (req, res) => {
  // In a real app, check if user is admin
  const newEasterEgg = req.body;
  
  if (!newEasterEgg.id || !newEasterEgg.name || !newEasterEgg.path) {
    return res.status(400).json({
      success: false,
      error: 'id, name, and path are required'
    });
  }
  
  // Check if an Easter egg with this ID already exists
  if (easterEggs.some(egg => egg.id === newEasterEgg.id)) {
    return res.status(400).json({
      success: false,
      error: 'An Easter egg with this ID already exists'
    });
  }
  
  // Add the Easter egg
  easterEggs.push(newEasterEgg);
  
  res.json({
    success: true,
    message: 'Easter egg created successfully',
    data: newEasterEgg
  });
});

export default router;