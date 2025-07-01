import {
  LearningMiniGame,
  InsertLearningMiniGame,
  MiniGameContent,
  InsertMiniGameContent,
  UserMiniGameProgress,
  InsertUserMiniGameProgress,
  UserMiniGameActivity,
  InsertUserMiniGameActivity,
  MiniGameStats,
  MiniGameRecommendation,
  miniGameTypes
} from '../../shared/learning-minigame-types';

// Storage interface for learning mini-games module
export interface ILearningMiniGameStorage {
  // Game operations
  getMiniGames(): Promise<LearningMiniGame[]>;
  getMiniGame(id: number): Promise<LearningMiniGame | undefined>;
  getMiniGamesByType(gameType: string): Promise<LearningMiniGame[]>;
  getMiniGamesBySubject(subject: string): Promise<LearningMiniGame[]>;
  getMiniGamesByGradeLevel(gradeLevel: string): Promise<LearningMiniGame[]>;
  getMiniGamesByDifficulty(difficulty: number): Promise<LearningMiniGame[]>;
  createMiniGame(game: InsertLearningMiniGame): Promise<LearningMiniGame>;
  updateMiniGame(id: number, game: Partial<InsertLearningMiniGame>): Promise<LearningMiniGame | undefined>;
  deleteMiniGame(id: number): Promise<boolean>;
  
  // Game content operations
  getMiniGameContents(gameId: number): Promise<MiniGameContent[]>;
  getMiniGameContent(id: number): Promise<MiniGameContent | undefined>;
  createMiniGameContent(content: InsertMiniGameContent): Promise<MiniGameContent>;
  updateMiniGameContent(id: number, content: Partial<InsertMiniGameContent>): Promise<MiniGameContent | undefined>;
  deleteMiniGameContent(id: number): Promise<boolean>;
  
  // User progress operations
  getUserMiniGameProgress(userId: number): Promise<UserMiniGameProgress[]>;
  getUserMiniGameProgressByGame(userId: number, gameId: number): Promise<UserMiniGameProgress | undefined>;
  createUserMiniGameProgress(progress: InsertUserMiniGameProgress): Promise<UserMiniGameProgress>;
  updateUserMiniGameProgress(id: number, progress: Partial<InsertUserMiniGameProgress>): Promise<UserMiniGameProgress | undefined>;
  completeMiniGame(userId: number, gameId: number, score: number, timeSpent: number): Promise<UserMiniGameProgress>;
  
  // Activity tracking
  recordUserMiniGameActivity(activity: InsertUserMiniGameActivity): Promise<UserMiniGameActivity>;
  getUserMiniGameActivities(userId: number, gameId: number): Promise<UserMiniGameActivity[]>;
  
  // Analytics
  getMiniGameStats(userId: number): Promise<MiniGameStats>;
  getTopPerformingMiniGames(limit?: number): Promise<{gameId: number, title: string, averageScore: number, timesPlayed: number}[]>;
  getMiniGameRecommendations(userId: number): Promise<MiniGameRecommendation[]>;
}

// Implementation of learning mini-games module for in-memory storage
export class LearningMiniGameMemStorage implements ILearningMiniGameStorage {
  private miniGames: Map<number, LearningMiniGame>;
  private miniGameContents: Map<number, MiniGameContent>;
  private userMiniGameProgress: Map<number, UserMiniGameProgress>;
  private userMiniGameActivities: Map<number, UserMiniGameActivity>;
  private nextGameId: number;
  private nextContentId: number;
  private nextProgressId: number;
  private nextActivityId: number;
  
  constructor() {
    this.miniGames = new Map();
    this.miniGameContents = new Map();
    this.userMiniGameProgress = new Map();
    this.userMiniGameActivities = new Map();
    this.nextGameId = 1;
    this.nextContentId = 1;
    this.nextProgressId = 1;
    this.nextActivityId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }
  
  private initializeSampleData() {
    // Generate a few sample mini-games for testing
    const sampleGames: InsertLearningMiniGame[] = [
      {
        title: "Math Facts Flashcards",
        description: "Practice basic math facts with these interactive flashcards",
        gameType: "flashcard",
        difficulty: 2,
        subject: "math",
        gradeLevel: "elementary",
        timeLimit: 120,
        instructions: "Flip through the flashcards and answer as many as you can within the time limit!",
        rewardXp: 15,
        active: true,
        metadata: {
          operationType: "mixed", // addition, subtraction, multiplication, division, mixed
          maxNumber: 12,
          cardCount: 20
        }
      },
      {
        title: "Science Vocabulary Matching",
        description: "Match science terms with their correct definitions",
        gameType: "matching",
        difficulty: 3,
        subject: "science",
        gradeLevel: "middle",
        timeLimit: 180,
        instructions: "Drag each term to its matching definition. Complete all matches before time runs out!",
        rewardXp: 20,
        active: true,
        metadata: {
          pairs: 10,
          category: "biology"
        }
      },
      {
        title: "Grammar Challenge Quiz",
        description: "Test your knowledge of grammar rules",
        gameType: "quiz",
        difficulty: 3,
        subject: "language",
        gradeLevel: "middle",
        timeLimit: 240,
        instructions: "Select the correct answer for each grammar question. Get as many right as possible!",
        rewardXp: 25,
        active: true,
        metadata: {
          questionCount: 10,
          categories: ["punctuation", "parts of speech", "sentence structure"]
        }
      },
      {
        title: "Historical Timeline Sorting",
        description: "Sort historical events in chronological order",
        gameType: "sorting",
        difficulty: 4,
        subject: "history",
        gradeLevel: "high",
        timeLimit: 180,
        instructions: "Drag and drop the events to arrange them in the correct chronological order.",
        rewardXp: 30,
        active: true,
        metadata: {
          era: "World War II",
          eventCount: 8
        }
      }
    ];
    
    // Add sample games to storage
    sampleGames.forEach(game => {
      const id = this.nextGameId++;
      this.miniGames.set(id, {
        ...game,
        id,
        createdAt: new Date()
      });
    });
    
    // Add sample content for the first game (Math Flashcards)
    const flashcardGame = Array.from(this.miniGames.values()).find(g => g.gameType === "flashcard");
    if (flashcardGame) {
      const operations = ['+', '-', '×', '÷'];
      
      for (let i = 0; i < 20; i++) {
        const opIndex = Math.floor(Math.random() * 4);
        const operation = operations[opIndex];
        let num1, num2, answer;
        
        switch(operation) {
          case '+':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 + num2;
            break;
          case '-':
            num1 = Math.floor(Math.random() * 10) + 5;
            num2 = Math.floor(Math.random() * 5) + 1;
            answer = num1 - num2;
            break;
          case '×':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;
          case '÷':
            num2 = Math.floor(Math.random() * 9) + 1;
            answer = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * answer;
            break;
          default:
            num1 = 1;
            num2 = 1;
            answer = 2;
        }
        
        this.miniGameContents.set(this.nextContentId++, {
          id: this.nextContentId,
          gameId: flashcardGame.id,
          contentType: "flashcard",
          contentData: {
            front: `${num1} ${operation} ${num2} = ?`,
            back: `${answer}`,
            explanation: null
          },
          order: i,
          difficulty: Math.ceil((num1 + num2) / 6), // Simple difficulty scaling
          metadata: {
            operation: operation,
            num1: num1,
            num2: num2
          }
        });
      }
    }
    
    // Add sample content for the quiz game
    const quizGame = Array.from(this.miniGames.values()).find(g => g.gameType === "quiz");
    if (quizGame) {
      const grammarQuestions = [
        {
          question: "Which sentence uses correct punctuation?",
          options: [
            "She went to the store, and bought apples, oranges and bread.",
            "She went to the store and bought apples, oranges, and bread.",
            "She went to the store and bought apples oranges and bread.",
            "She went to the store, and bought apples, oranges, and bread."
          ],
          correctIndex: 1,
          explanation: "The second option correctly uses commas to separate items in a list, including the Oxford comma before 'and'."
        },
        {
          question: "Which word is an adverb in the sentence: 'She quickly ran to the store.'?",
          options: [
            "She",
            "quickly",
            "ran",
            "store"
          ],
          correctIndex: 1,
          explanation: "Adverbs modify verbs, adjectives, or other adverbs. 'Quickly' modifies how she ran."
        },
        {
          question: "Which is a complex sentence?",
          options: [
            "She went to the store.",
            "She went to the store and bought some milk.",
            "Although it was raining, she went to the store.",
            "She went to the store; she bought some milk."
          ],
          correctIndex: 2,
          explanation: "A complex sentence has an independent clause and at least one dependent clause."
        }
      ];
      
      for (let i = 0; i < grammarQuestions.length; i++) {
        this.miniGameContents.set(this.nextContentId++, {
          id: this.nextContentId,
          gameId: quizGame.id,
          contentType: "question",
          contentData: grammarQuestions[i],
          order: i,
          difficulty: 3,
          metadata: {
            category: "grammar",
            subtype: "multiple-choice"
          }
        });
      }
    }
  }
  
  // Game operations
  async getMiniGames(): Promise<LearningMiniGame[]> {
    return Array.from(this.miniGames.values());
  }
  
  async getMiniGame(id: number): Promise<LearningMiniGame | undefined> {
    return this.miniGames.get(id);
  }
  
  async getMiniGamesByType(gameType: string): Promise<LearningMiniGame[]> {
    return Array.from(this.miniGames.values()).filter(game => game.gameType === gameType);
  }
  
  async getMiniGamesBySubject(subject: string): Promise<LearningMiniGame[]> {
    return Array.from(this.miniGames.values()).filter(game => game.subject === subject);
  }
  
  async getMiniGamesByGradeLevel(gradeLevel: string): Promise<LearningMiniGame[]> {
    return Array.from(this.miniGames.values()).filter(game => game.gradeLevel === gradeLevel);
  }
  
  async getMiniGamesByDifficulty(difficulty: number): Promise<LearningMiniGame[]> {
    return Array.from(this.miniGames.values()).filter(game => game.difficulty === difficulty);
  }
  
  async createMiniGame(game: InsertLearningMiniGame): Promise<LearningMiniGame> {
    const id = this.nextGameId++;
    const newGame: LearningMiniGame = {
      ...game,
      id,
      createdAt: new Date()
    };
    
    this.miniGames.set(id, newGame);
    return newGame;
  }
  
  async updateMiniGame(id: number, game: Partial<InsertLearningMiniGame>): Promise<LearningMiniGame | undefined> {
    const existingGame = this.miniGames.get(id);
    
    if (!existingGame) {
      return undefined;
    }
    
    const updatedGame: LearningMiniGame = {
      ...existingGame,
      ...game
    };
    
    this.miniGames.set(id, updatedGame);
    return updatedGame;
  }
  
  async deleteMiniGame(id: number): Promise<boolean> {
    return this.miniGames.delete(id);
  }
  
  // Game content operations
  async getMiniGameContents(gameId: number): Promise<MiniGameContent[]> {
    return Array.from(this.miniGameContents.values())
      .filter(content => content.gameId === gameId)
      .sort((a, b) => a.order - b.order);
  }
  
  async getMiniGameContent(id: number): Promise<MiniGameContent | undefined> {
    return this.miniGameContents.get(id);
  }
  
  async createMiniGameContent(content: InsertMiniGameContent): Promise<MiniGameContent> {
    const id = this.nextContentId++;
    const newContent: MiniGameContent = {
      ...content,
      id
    };
    
    this.miniGameContents.set(id, newContent);
    return newContent;
  }
  
  async updateMiniGameContent(id: number, content: Partial<InsertMiniGameContent>): Promise<MiniGameContent | undefined> {
    const existingContent = this.miniGameContents.get(id);
    
    if (!existingContent) {
      return undefined;
    }
    
    const updatedContent: MiniGameContent = {
      ...existingContent,
      ...content
    };
    
    this.miniGameContents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteMiniGameContent(id: number): Promise<boolean> {
    return this.miniGameContents.delete(id);
  }
  
  // User progress operations
  async getUserMiniGameProgress(userId: number): Promise<UserMiniGameProgress[]> {
    return Array.from(this.userMiniGameProgress.values())
      .filter(progress => progress.userId === userId);
  }
  
  async getUserMiniGameProgressByGame(userId: number, gameId: number): Promise<UserMiniGameProgress | undefined> {
    const userProgress = Array.from(this.userMiniGameProgress.values())
      .filter(progress => progress.userId === userId && progress.gameId === gameId);
    
    if (userProgress.length === 0) {
      return undefined;
    }
    
    // Return the most recent progress entry
    return userProgress.sort((a, b) => 
      new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
    )[0];
  }
  
  async createUserMiniGameProgress(progress: InsertUserMiniGameProgress): Promise<UserMiniGameProgress> {
    const id = this.nextProgressId++;
    const newProgress: UserMiniGameProgress = {
      ...progress,
      id,
      lastPlayed: new Date(),
      completedAt: progress.completed ? new Date() : null
    };
    
    this.userMiniGameProgress.set(id, newProgress);
    return newProgress;
  }
  
  async updateUserMiniGameProgress(id: number, progress: Partial<InsertUserMiniGameProgress>): Promise<UserMiniGameProgress | undefined> {
    const existingProgress = this.userMiniGameProgress.get(id);
    
    if (!existingProgress) {
      return undefined;
    }
    
    // Update completion time if newly completed
    let completedAt = existingProgress.completedAt;
    if (progress.completed && !existingProgress.completed) {
      completedAt = new Date();
    }
    
    const updatedProgress: UserMiniGameProgress = {
      ...existingProgress,
      ...progress,
      lastPlayed: new Date(),
      completedAt
    };
    
    this.userMiniGameProgress.set(id, updatedProgress);
    return updatedProgress;
  }
  
  async completeMiniGame(userId: number, gameId: number, score: number, timeSpent: number): Promise<UserMiniGameProgress> {
    // Check for existing progress record
    const existingProgress = await this.getUserMiniGameProgressByGame(userId, gameId);
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress = await this.updateUserMiniGameProgress(existingProgress.id, {
        completed: true,
        score,
        timeSpent,
        attempts: existingProgress.attempts + 1
      });
      
      // Add completion activity
      await this.recordUserMiniGameActivity({
        userId,
        gameId,
        activityType: 'complete',
        data: {
          score,
          timeSpent,
          attemptNumber: existingProgress.attempts + 1
        }
      });
      
      return updatedProgress;
    } else {
      // Create new progress record
      const newProgress = await this.createUserMiniGameProgress({
        userId,
        gameId,
        completed: true,
        score,
        timeSpent,
        attempts: 1,
        gameData: {}
      });
      
      // Add completion activity
      await this.recordUserMiniGameActivity({
        userId,
        gameId,
        activityType: 'complete',
        data: {
          score,
          timeSpent,
          attemptNumber: 1
        }
      });
      
      return newProgress;
    }
  }
  
  // Activity tracking
  async recordUserMiniGameActivity(activity: InsertUserMiniGameActivity): Promise<UserMiniGameActivity> {
    const id = this.nextActivityId++;
    const newActivity: UserMiniGameActivity = {
      ...activity,
      id,
      timestamp: new Date()
    };
    
    this.userMiniGameActivities.set(id, newActivity);
    return newActivity;
  }
  
  async getUserMiniGameActivities(userId: number, gameId: number): Promise<UserMiniGameActivity[]> {
    return Array.from(this.userMiniGameActivities.values())
      .filter(activity => activity.userId === userId && activity.gameId === gameId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Analytics
  async getMiniGameStats(userId: number): Promise<MiniGameStats> {
    const userProgress = await this.getUserMiniGameProgress(userId);
    
    // Calculate basic stats
    const gamesPlayed = userProgress.length;
    const gamesCompleted = userProgress.filter(p => p.completed).length;
    const totalScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0);
    const averageScore = gamesPlayed > 0 ? totalScore / gamesPlayed : 0;
    const totalTimeSpent = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    // Game type breakdown
    const gameTypeMap = new Map<string, { count: number, totalScore: number }>();
    
    // Subject breakdown
    const subjectMap = new Map<string, { count: number, totalScore: number }>();
    
    // Populate the breakdowns
    for (const progress of userProgress) {
      const game = await this.getMiniGame(progress.gameId);
      if (game) {
        // Game type stats
        const typeStats = gameTypeMap.get(game.gameType) || { count: 0, totalScore: 0 };
        typeStats.count += 1;
        typeStats.totalScore += progress.score || 0;
        gameTypeMap.set(game.gameType, typeStats);
        
        // Subject stats
        const subjectStats = subjectMap.get(game.subject) || { count: 0, totalScore: 0 };
        subjectStats.count += 1;
        subjectStats.totalScore += progress.score || 0;
        subjectMap.set(game.subject, subjectStats);
      }
    }
    
    // Format the breakdown data
    const gameTypeBreakdown = Array.from(gameTypeMap.entries()).map(([gameType, stats]) => ({
      gameType,
      count: stats.count,
      averageScore: stats.count > 0 ? stats.totalScore / stats.count : 0
    }));
    
    const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, stats]) => ({
      subject,
      count: stats.count,
      averageScore: stats.count > 0 ? stats.totalScore / stats.count : 0
    }));
    
    // Get recent games
    const recentGames = [...userProgress]
      .sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime())
      .slice(0, 5);
    
    return {
      gamesPlayed,
      gamesCompleted,
      totalScore,
      averageScore,
      totalTimeSpent,
      gameTypeBreakdown,
      subjectBreakdown,
      recentGames
    };
  }
  
  async getTopPerformingMiniGames(limit: number = 5): Promise<{gameId: number, title: string, averageScore: number, timesPlayed: number}[]> {
    // Group progress by game
    const gameStats = new Map<number, { totalScore: number, count: number }>();
    
    for (const progress of this.userMiniGameProgress.values()) {
      const stats = gameStats.get(progress.gameId) || { totalScore: 0, count: 0 };
      stats.totalScore += progress.score || 0;
      stats.count += 1;
      gameStats.set(progress.gameId, stats);
    }
    
    // Calculate average scores and format results
    const results = [];
    
    for (const [gameId, stats] of gameStats.entries()) {
      const game = this.miniGames.get(gameId);
      if (game && stats.count > 0) {
        results.push({
          gameId,
          title: game.title,
          averageScore: stats.totalScore / stats.count,
          timesPlayed: stats.count
        });
      }
    }
    
    // Sort by average score and return top N
    return results
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, limit);
  }
  
  async getMiniGameRecommendations(userId: number): Promise<MiniGameRecommendation[]> {
    const userProgress = await this.getUserMiniGameProgress(userId);
    const allGames = await this.getMiniGames();
    const recommendations: MiniGameRecommendation[] = [];
    
    // Get played game IDs
    const playedGameIds = new Set(userProgress.map(p => p.gameId));
    
    // Find games the user hasn't played yet
    const unplayedGames = allGames.filter(game => !playedGameIds.has(game.id));
    
    // If user has played games, find ones in similar subjects/types
    if (userProgress.length > 0) {
      // Find preferred subjects and game types
      const subjectFrequency = new Map<string, number>();
      const typeFrequency = new Map<string, number>();
      
      for (const progress of userProgress) {
        const game = await this.getMiniGame(progress.gameId);
        if (game) {
          subjectFrequency.set(game.subject, (subjectFrequency.get(game.subject) || 0) + 1);
          typeFrequency.set(game.gameType, (typeFrequency.get(game.gameType) || 0) + 1);
        }
      }
      
      // Sort by frequency to find favorites
      const favoriteSubjects = [...subjectFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      const favoriteTypes = [...typeFrequency.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      // Recommend games with favorite subjects
      if (favoriteSubjects.length > 0) {
        const subjectRecommendations = unplayedGames
          .filter(game => game.subject === favoriteSubjects[0])
          .slice(0, 2);
        
        for (const game of subjectRecommendations) {
          recommendations.push({
            gameId: game.id,
            title: game.title,
            gameType: game.gameType,
            description: game.description,
            difficulty: game.difficulty,
            subject: game.subject,
            reasonForRecommendation: `Based on your interest in ${game.subject}`
          });
        }
      }
      
      // Recommend games with favorite types
      if (favoriteTypes.length > 0) {
        const typeRecommendations = unplayedGames
          .filter(game => game.gameType === favoriteTypes[0] && 
                         !recommendations.some(r => r.gameId === game.id))
          .slice(0, 2);
        
        for (const game of typeRecommendations) {
          recommendations.push({
            gameId: game.id,
            title: game.title,
            gameType: game.gameType,
            description: game.description,
            difficulty: game.difficulty,
            subject: game.subject,
            reasonForRecommendation: `Based on your preference for ${game.gameType} games`
          });
        }
      }
    }
    
    // If we still need more recommendations, add random unplayed games
    if (recommendations.length < 4 && unplayedGames.length > 0) {
      const remainingCount = Math.min(4 - recommendations.length, unplayedGames.length);
      const shuffledGames = [...unplayedGames]
        .filter(game => !recommendations.some(r => r.gameId === game.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingCount);
      
      for (const game of shuffledGames) {
        recommendations.push({
          gameId: game.id,
          title: game.title,
          gameType: game.gameType,
          description: game.description,
          difficulty: game.difficulty,
          subject: game.subject,
          reasonForRecommendation: "Try something new!"
        });
      }
    }
    
    return recommendations;
  }
}