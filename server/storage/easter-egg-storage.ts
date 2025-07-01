/**
 * Easter Egg Storage Implementation
 * 
 * This file implements the storage interface for the Easter egg feature
 * using an in-memory approach for development.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  EasterEgg,
  EasterEggDiscovery,
  EasterEggStats,
  EasterEggStorage
} from '../../shared/easter-egg-types';

// Sample Easter eggs for testing
const sampleEasterEggs: EasterEgg[] = [
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
      title: 'Legal Pop Quiz',
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
      unlocks: { 
        name: 'Bonus vocabulary lists',
        type: 'content'
      }
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
  },
  {
    id: 'egg5',
    name: 'Accessibility Champion',
    description: 'You enabled 5 different accessibility features!',
    type: 'achievement',
    path: '/settings/accessibility',
    action: 'enable-5-features',
    difficulty: 'medium',
    content: {
      title: 'Accessibility Champion',
      description: 'You have explored and enabled multiple accessibility features, showing your commitment to inclusive learning.',
      badgeImageUrl: '/badges/accessibility-champion.svg',
      unlockedMessage: 'You have unlocked the Accessibility Champion badge for your profile!'
    },
    reward: {
      xp: 150,
      badge: { 
        name: 'Accessibility Champion',
        imageUrl: '/badges/accessibility-champion.svg'
      }
    }
  }
];

/**
 * In-memory storage implementation for Easter eggs
 */
export class EasterEggMemStorage implements EasterEggStorage {
  private easterEggs: EasterEgg[] = [...sampleEasterEggs];
  private discoveries: EasterEggDiscovery[] = [];

  constructor() {
    console.log('Easter Egg Memory Storage initialized with sample data');
  }

  // Easter Egg Methods
  async getAllEasterEggs(): Promise<EasterEgg[]> {
    return this.easterEggs;
  }

  async getEasterEggById(id: string): Promise<EasterEgg | null> {
    const easterEgg = this.easterEggs.find(egg => egg.id === id);
    return easterEgg || null;
  }

  async getEasterEggsByPath(path: string): Promise<EasterEgg[]> {
    return this.easterEggs.filter(egg => egg.path === path);
  }

  async checkForEasterEgg(path: string, action: string | null): Promise<EasterEgg | null> {
    const easterEgg = this.easterEggs.find(egg => 
      egg.path === path && 
      (egg.action === null || egg.action === action)
    );
    return easterEgg || null;
  }

  async createEasterEgg(easterEgg: EasterEgg): Promise<EasterEgg> {
    const newEasterEgg = {
      ...easterEgg,
      id: easterEgg.id || uuidv4()
    };
    this.easterEggs.push(newEasterEgg);
    return newEasterEgg;
  }

  async updateEasterEgg(id: string, easterEgg: Partial<EasterEgg>): Promise<EasterEgg | null> {
    const index = this.easterEggs.findIndex(egg => egg.id === id);
    if (index === -1) return null;

    this.easterEggs[index] = { ...this.easterEggs[index], ...easterEgg };
    return this.easterEggs[index];
  }

  async deleteEasterEgg(id: string): Promise<boolean> {
    const index = this.easterEggs.findIndex(egg => egg.id === id);
    if (index === -1) return false;

    this.easterEggs.splice(index, 1);
    return true;
  }

  // User Discovery Methods
  async getUserDiscoveries(userId: string): Promise<EasterEggDiscovery[]> {
    return this.discoveries.filter(d => d.userId === userId);
  }

  async addUserDiscovery(discovery: Omit<EasterEggDiscovery, 'id'>): Promise<EasterEggDiscovery> {
    const newDiscovery: EasterEggDiscovery = {
      ...discovery,
      id: uuidv4()
    };
    this.discoveries.push(newDiscovery);
    return newDiscovery;
  }

  async updateUserDiscovery(id: string, update: Partial<EasterEggDiscovery>): Promise<EasterEggDiscovery | null> {
    const index = this.discoveries.findIndex(d => d.id === id);
    if (index === -1) return null;

    this.discoveries[index] = { ...this.discoveries[index], ...update };
    return this.discoveries[index];
  }

  async getUserStats(userId: string): Promise<EasterEggStats> {
    const userDiscoveries = await this.getUserDiscoveries(userId);
    
    const stats: EasterEggStats = {
      userId,
      discoveredCount: userDiscoveries.length,
      completedCount: userDiscoveries.filter(d => d.completed).length,
      totalEasterEggs: this.easterEggs.length,
      percentageFound: Math.round((userDiscoveries.length / this.easterEggs.length) * 100),
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
    
    // Get recent discoveries
    stats.recentDiscoveries = userDiscoveries
      .sort((a, b) => new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime())
      .slice(0, 5)
      .map(d => ({
        id: d.id,
        easterEggName: d.easterEggName,
        discoveredAt: d.discoveredAt,
        completed: d.completed
      }));
    
    // Count by difficulty and type
    userDiscoveries.forEach(discovery => {
      const egg = this.easterEggs.find(e => e.id === discovery.easterEggId);
      if (egg) {
        if (egg.difficulty) {
          stats.byDifficulty[egg.difficulty]++;
        }
        if (egg.type) {
          stats.byType[egg.type]++;
        }
      }
    });
    
    return stats;
  }
}

// Create and export a singleton instance
export const easterEggStorage = new EasterEggMemStorage();