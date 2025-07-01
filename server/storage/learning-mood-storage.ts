import {
  LearningMood,
  InsertLearningMood,
  LearningMoodStats,
  LearningMoodFeedback,
  moodCategories
} from '../../shared/learning-mood-types';

// Storage interface for learning mood module
export interface ILearningMoodStorage {
  // Basic CRUD operations
  getLearningMoods(studentId?: number): Promise<LearningMood[]>;
  getLearningMoodsByCategory(category: string): Promise<LearningMood[]>;
  getLearningMoodsBySession(sessionId: number): Promise<LearningMood[]>;
  getLearningMood(id: number): Promise<LearningMood | undefined>;
  createLearningMood(mood: InsertLearningMood): Promise<LearningMood>;
  deleteLearningMood(id: number): Promise<boolean>;
  
  // Analytics and statistics
  getStudentMoodStats(studentId: number): Promise<LearningMoodStats>;
  getMoodTrendsOverTime(studentId: number, days: number): Promise<{ date: string; primaryMood: string; averageIntensity: number }[]>;
  
  // Feedback and suggestions
  generateMoodFeedback(moodCategory: string): Promise<LearningMoodFeedback>;
  
  // Counter methods
  incrementMoodCounter(category: string): Promise<number>;
  getMoodCounts(): Promise<Record<string, number>>;
}

// Implementation of learning mood module for in-memory storage
export class LearningMoodMemStorage implements ILearningMoodStorage {
  private learningMoods: Map<number, LearningMood>;
  private currentId: number;
  private moodCounters: Map<string, number>;
  
  constructor() {
    this.learningMoods = new Map();
    this.currentId = 1;
    this.moodCounters = new Map();
    
    // Initialize mood counters for all categories
    moodCategories.forEach(mood => {
      this.moodCounters.set(mood.category, 0);
    });
  }
  
  async getLearningMoods(studentId?: number): Promise<LearningMood[]> {
    const allMoods = Array.from(this.learningMoods.values());
    if (studentId) {
      return allMoods.filter(mood => mood.studentId === studentId);
    }
    return allMoods;
  }
  
  async getLearningMoodsByCategory(category: string): Promise<LearningMood[]> {
    return Array.from(this.learningMoods.values()).filter(
      mood => mood.moodCategory === category
    );
  }
  
  async getLearningMoodsBySession(sessionId: number): Promise<LearningMood[]> {
    return Array.from(this.learningMoods.values()).filter(
      mood => mood.sessionId === sessionId
    );
  }
  
  async getLearningMood(id: number): Promise<LearningMood | undefined> {
    return this.learningMoods.get(id);
  }
  
  async createLearningMood(mood: InsertLearningMood): Promise<LearningMood> {
    const id = this.currentId++;
    const newMood: LearningMood = {
      ...mood,
      id,
      timestamp: new Date(),
    };
    
    this.learningMoods.set(id, newMood);
    
    // Increment the counter for this mood category
    await this.incrementMoodCounter(mood.moodCategory);
    
    return newMood;
  }
  
  async deleteLearningMood(id: number): Promise<boolean> {
    return this.learningMoods.delete(id);
  }
  
  async getStudentMoodStats(studentId: number): Promise<LearningMoodStats> {
    const studentMoods = await this.getLearningMoods(studentId);
    
    if (studentMoods.length === 0) {
      return {
        mostCommonMood: '',
        averageIntensity: 0,
        moodTrends: [],
        recentMoods: [],
        totalEntries: 0
      };
    }
    
    // Count occurrences of each mood category
    const moodCounts: Record<string, { count: number, totalIntensity: number }> = {};
    
    studentMoods.forEach(mood => {
      if (!moodCounts[mood.moodCategory]) {
        moodCounts[mood.moodCategory] = { count: 0, totalIntensity: 0 };
      }
      moodCounts[mood.moodCategory].count += 1;
      moodCounts[mood.moodCategory].totalIntensity += mood.moodIntensity;
    });
    
    // Find the most common mood
    let mostCommonMood = '';
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([category, data]) => {
      if (data.count > highestCount) {
        mostCommonMood = category;
        highestCount = data.count;
      }
    });
    
    // Calculate the average intensity
    const totalIntensity = studentMoods.reduce((sum, mood) => sum + mood.moodIntensity, 0);
    const averageIntensity = totalIntensity / studentMoods.length;
    
    // Create mood trends data
    const moodTrends = Object.entries(moodCounts).map(([category, data]) => ({
      category,
      count: data.count,
      averageIntensity: data.totalIntensity / data.count
    }));
    
    // Get the most recent moods (up to 5)
    const recentMoods = [...studentMoods]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    return {
      mostCommonMood,
      averageIntensity,
      moodTrends,
      recentMoods,
      totalEntries: studentMoods.length
    };
  }
  
  async getMoodTrendsOverTime(studentId: number, days: number): Promise<{ date: string; primaryMood: string; averageIntensity: number }[]> {
    const studentMoods = await this.getLearningMoods(studentId);
    
    // Filter moods to just those within the requested time period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentMoods = studentMoods.filter(mood => 
      new Date(mood.timestamp).getTime() > cutoffDate.getTime()
    );
    
    // Group moods by date
    const moodsByDate: Record<string, LearningMood[]> = {};
    
    recentMoods.forEach(mood => {
      const dateStr = new Date(mood.timestamp).toISOString().split('T')[0];
      if (!moodsByDate[dateStr]) {
        moodsByDate[dateStr] = [];
      }
      moodsByDate[dateStr].push(mood);
    });
    
    // For each date, find the primary mood and average intensity
    return Object.entries(moodsByDate).map(([date, moods]) => {
      // Count occurrences of each mood
      const moodCounts: Record<string, number> = {};
      moods.forEach(mood => {
        moodCounts[mood.moodCategory] = (moodCounts[mood.moodCategory] || 0) + 1;
      });
      
      // Find the most common mood for this date
      let primaryMood = '';
      let highestCount = 0;
      
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > highestCount) {
          primaryMood = mood;
          highestCount = count;
        }
      });
      
      // Calculate average intensity
      const totalIntensity = moods.reduce((sum, mood) => sum + mood.moodIntensity, 0);
      const averageIntensity = totalIntensity / moods.length;
      
      return {
        date,
        primaryMood,
        averageIntensity
      };
    });
  }
  
  async generateMoodFeedback(moodCategory: string): Promise<LearningMoodFeedback> {
    // Define feedback based on mood category
    const feedbackMap: Record<string, LearningMoodFeedback> = {
      excited: {
        moodCategory: 'excited',
        suggestions: [
          'Channel your enthusiasm into challenging exercises',
          'Explore advanced topics related to what you\'re learning',
          'Share your excitement with peers to enhance collaborative learning'
        ],
        resources: [
          {
            title: 'Advanced Challenge Problems',
            description: 'Try these more difficult problems to stretch your abilities'
          },
          {
            title: 'Peer Learning Communities',
            description: 'Join a study group to share your enthusiasm and learn together'
          }
        ]
      },
      happy: {
        moodCategory: 'happy',
        suggestions: [
          'Reflect on what aspects of learning make you happy',
          'Use this positive state to tackle more challenging material',
          'Document your learning strategies that lead to this positive state'
        ],
        resources: [
          {
            title: 'Learning Journal Template',
            description: 'Track what works well for your learning style'
          },
          {
            title: 'Positive Learning Techniques',
            description: 'Strategies to maintain a positive learning mindset'
          }
        ]
      },
      calm: {
        moodCategory: 'calm',
        suggestions: [
          'This is an excellent state for deep focused work',
          'Try tackling complex problems requiring sustained attention',
          'Practice mindfulness to maintain this balanced state'
        ],
        resources: [
          {
            title: 'Deep Work Techniques',
            description: 'Methods to maximize productivity during calm, focused periods'
          },
          {
            title: 'Mindfulness for Learners',
            description: 'Practices to maintain calm focus during study sessions'
          }
        ]
      },
      confused: {
        moodCategory: 'confused',
        suggestions: [
          'Break down complex concepts into smaller parts',
          'Try a different learning approach or resource',
          'Don\'t hesitate to ask questions or seek help'
        ],
        resources: [
          {
            title: 'Concept Breakdown Tools',
            description: 'Visual mapping tools to simplify complex ideas'
          },
          {
            title: 'Alternative Explanations',
            description: 'Different approaches to understanding difficult topics'
          }
        ]
      },
      frustrated: {
        moodCategory: 'frustrated',
        suggestions: [
          'Take a short break to reset your mindset',
          'Revisit foundational concepts that may need strengthening',
          'Try a different problem-solving approach'
        ],
        resources: [
          {
            title: 'Stress Management Techniques',
            description: 'Quick methods to reduce learning frustration'
          },
          {
            title: 'Step-by-Step Problem Solving',
            description: 'Structured approaches to tackle difficult problems'
          }
        ]
      },
      bored: {
        moodCategory: 'bored',
        suggestions: [
          'Connect the material to your personal interests',
          'Challenge yourself with more difficult problems',
          'Try a different learning format (video, interactive, etc.)'
        ],
        resources: [
          {
            title: 'Interactive Learning Activities',
            description: 'Engaging ways to learn the same material'
          },
          {
            title: 'Real-World Applications',
            description: 'See how these concepts apply to interesting real-life situations'
          }
        ]
      },
      tired: {
        moodCategory: 'tired',
        suggestions: [
          'Take a break or switch to a less demanding task',
          'Try a quick physical activity to boost energy',
          'Consider scheduling learning during your peak energy times'
        ],
        resources: [
          {
            title: 'Energy Management for Learners',
            description: 'Techniques to optimize study sessions based on energy levels'
          },
          {
            title: 'Quick Energizing Activities',
            description: 'Short exercises to boost mental alertness'
          }
        ]
      },
      anxious: {
        moodCategory: 'anxious',
        suggestions: [
          'Break work into smaller, manageable tasks',
          'Practice relaxation techniques before studying',
          'Focus on progress rather than perfection'
        ],
        resources: [
          {
            title: 'Anxiety Reduction Techniques',
            description: 'Methods to calm anxiety during learning sessions'
          },
          {
            title: 'Progressive Learning Approach',
            description: 'Step-by-step methods to build confidence in difficult topics'
          }
        ]
      },
      proud: {
        moodCategory: 'proud',
        suggestions: [
          'Reflect on the strategies that led to your success',
          'Share your accomplishments to reinforce your learning',
          'Build on this success by setting new challenging goals'
        ],
        resources: [
          {
            title: 'Success Journal Template',
            description: 'Document your achievements and effective strategies'
          },
          {
            title: 'Progressive Goal Setting',
            description: 'Methods to build on your successes with new challenges'
          }
        ]
      },
      curious: {
        moodCategory: 'curious',
        suggestions: [
          'Explore related topics that spark your interest',
          'Ask deeper questions about the subject matter',
          'Connect this topic to other areas you\'re studying'
        ],
        resources: [
          {
            title: 'Inquiry-Based Learning Resources',
            description: 'Materials that encourage exploration and discovery'
          },
          {
            title: 'Interdisciplinary Connections',
            description: 'See how this topic connects to other fields of study'
          }
        ]
      }
    };
    
    // Return the appropriate feedback or a default if category not found
    return feedbackMap[moodCategory] || {
      moodCategory: moodCategory,
      suggestions: [
        'Reflect on why you\'re feeling this way during learning',
        'Consider what changes might improve your learning experience',
        'Try a different approach to the material'
      ],
      resources: [
        {
          title: 'Learning Style Assessment',
          description: 'Discover your optimal learning approaches'
        }
      ]
    };
  }
  
  async incrementMoodCounter(category: string): Promise<number> {
    const currentCount = this.moodCounters.get(category) || 0;
    const newCount = currentCount + 1;
    this.moodCounters.set(category, newCount);
    return newCount;
  }
  
  async getMoodCounts(): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    this.moodCounters.forEach((count, category) => {
      result[category] = count;
    });
    return result;
  }
}