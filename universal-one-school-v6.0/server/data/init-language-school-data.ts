/**
 * Initial Language School Data
 * 
 * This module provides functions to initialize the Language School
 * with default courses, modules, and vocabulary lists.
 */

import { db } from '../db';
import * as schema from '../../shared/schema';
import { IStorage } from '../storage';

/**
 * Initialize language courses for English, Spanish, and German
 */
export async function initializeLanguageCourses(storage: IStorage) {
  try {
    console.log('Initializing Language School courses...');
    
    // Check if courses already exist
    const existingCourses = await db.query.languageCourses.findMany({
      limit: 1
    });
    
    if (existingCourses && existingCourses.length > 0) {
      console.log('Language courses already initialized, skipping...');
      return;
    }
    
    // Default courses for the three supported languages
    const defaultCourses = [
      // English Courses
      {
        title: 'English for Beginners',
        language: 'English',
        proficiencyLevel: 'Beginner',
        description: 'A foundational course for non-native English speakers with little to no prior knowledge of English. Covers basic vocabulary, simple grammar, and everyday conversational phrases.',
        learningObjectives: 'Basic conversation skills, essential vocabulary, simple grammar structures',
        prerequisites: 'None',
        duration: '12 weeks',
        imageUrl: '/images/courses/english-beginners.jpg',
        maxStudents: 30,
        active: true
      },
      {
        title: 'Intermediate English',
        language: 'English',
        proficiencyLevel: 'Intermediate',
        description: 'Build on your basic English skills with more complex grammar structures, expanded vocabulary, and conversational practice for various social and professional situations.',
        learningObjectives: 'Fluent conversation, complex grammar, broad vocabulary, writing skills',
        prerequisites: 'Basic English or completion of English for Beginners',
        duration: '16 weeks',
        imageUrl: '/images/courses/english-intermediate.jpg',
        maxStudents: 25,
        active: true
      },
      {
        title: 'Advanced English & Business Communication',
        language: 'English',
        proficiencyLevel: 'Advanced',
        description: 'Perfect your English skills with advanced grammar, nuanced vocabulary, idioms, and professional communication strategies for business and academic contexts.',
        learningObjectives: 'Professional communication, idiomatic expressions, advanced writing, presentation skills',
        prerequisites: 'Intermediate English proficiency',
        duration: '20 weeks',
        imageUrl: '/images/courses/english-advanced.jpg',
        maxStudents: 20,
        active: true
      },
      
      // Spanish Courses
      {
        title: 'Español Básico',
        language: 'Spanish',
        proficiencyLevel: 'Beginner',
        description: 'An introduction to Spanish language and Hispanic cultures. Learn foundational vocabulary, simple present tense verbs, and basic conversational phrases.',
        learningObjectives: 'Basic Spanish conversation, essential vocabulary, simple present tense',
        prerequisites: 'None',
        duration: '12 weeks',
        imageUrl: '/images/courses/spanish-beginners.jpg',
        maxStudents: 30,
        active: true
      },
      {
        title: 'Español Intermedio',
        language: 'Spanish',
        proficiencyLevel: 'Intermediate',
        description: 'Expand your Spanish language abilities with more complex sentence structures, past and future tenses, and conversational skills for a variety of everyday contexts.',
        learningObjectives: 'Fluent conversation, past and future tenses, reading comprehension',
        prerequisites: 'Basic Spanish or completion of Español Básico',
        duration: '16 weeks',
        imageUrl: '/images/courses/spanish-intermediate.jpg',
        maxStudents: 25,
        active: true
      },
      {
        title: 'Español Avanzado y Cultura',
        language: 'Spanish',
        proficiencyLevel: 'Advanced',
        description: 'Refine your Spanish with advanced grammar, regional variations, idiomatic expressions, and cultural competency across the Spanish-speaking world.',
        learningObjectives: 'Advanced grammar, cultural fluency, regional variations, idiomatic expressions',
        prerequisites: 'Intermediate Spanish proficiency',
        duration: '20 weeks',
        imageUrl: '/images/courses/spanish-advanced.jpg',
        maxStudents: 20,
        active: true
      },
      
      // German Courses
      {
        title: 'Deutsch für Anfänger',
        language: 'German',
        proficiencyLevel: 'Beginner',
        description: 'Start your journey with German language and culture. Learn essential vocabulary, basic grammar structures, and everyday useful phrases.',
        learningObjectives: 'Basic German conversation, essential vocabulary, noun genders, simple sentence structure',
        prerequisites: 'None',
        duration: '12 weeks',
        imageUrl: '/images/courses/german-beginners.jpg',
        maxStudents: 30,
        active: true
      },
      {
        title: 'Deutsch Mittelstufe',
        language: 'German',
        proficiencyLevel: 'Intermediate',
        description: 'Develop more confidence and fluency in German with expanded vocabulary, more complex grammatical structures, and practice for both personal and professional contexts.',
        learningObjectives: 'Expanded vocabulary, complex sentence structures, reading comprehension',
        prerequisites: 'Basic German or completion of Deutsch für Anfänger',
        duration: '16 weeks',
        imageUrl: '/images/courses/german-intermediate.jpg',
        maxStudents: 25,
        active: true
      },
      {
        title: 'Fortgeschrittenes Deutsch',
        language: 'German',
        proficiencyLevel: 'Advanced',
        description: 'Achieve mastery of German with advanced grammar topics, extensive vocabulary development, cultural nuances, and specialized professional language.',
        learningObjectives: 'Advanced grammar, cultural competency, professional communication, idiomatic expressions',
        prerequisites: 'Intermediate German proficiency',
        duration: '20 weeks',
        imageUrl: '/images/courses/german-advanced.jpg',
        maxStudents: 20,
        active: true
      }
    ];
    
    // Insert courses into database
    console.log(`Adding ${defaultCourses.length} language courses...`);
    
    for (const course of defaultCourses) {
      try {
        const result = await db.insert(schema.languageCourses)
          .values(course)
          .returning();
        
        if (result && result.length > 0) {
          console.log(`Added course: ${course.title}`);
          // No direct storage update, will use the database
        }
      } catch (error) {
        console.error(`Error adding course ${course.title}:`, error);
      }
    }
    
    console.log('Finished initializing Language School courses');
  } catch (error) {
    console.error('Error initializing Language School courses:', error);
    throw error;
  }
}

/**
 * Initialize language modules for the beginner English course
 */
export async function initializeEnglishBeginnerModules(storage: IStorage) {
  try {
    console.log('Initializing English Beginner modules...');
    
    // Check if any modules already exist
    const existingModules = await db.query.languageModules.findMany({
      limit: 1
    });
    
    if (existingModules && existingModules.length > 0) {
      console.log('Language modules already initialized, skipping...');
      return;
    }
    
    // Get the English for Beginners course
    const englishBeginnerCourse = await db.query.languageCourses.findFirst({
      where: (courses, { eq, and }) => 
        and(
          eq(courses.language, 'English'),
          eq(courses.proficiencyLevel, 'Beginner')
        )
    });
    
    if (!englishBeginnerCourse) {
      console.error('English Beginner course not found, cannot add modules');
      return;
    }
    
    // Default modules for English Beginners
    const defaultModules = [
      {
        courseId: englishBeginnerCourse.id,
        title: 'Introductions & Greetings',
        description: 'Learn how to introduce yourself, greet others, and have basic conversations in English.',
        content: 'This module covers basic greetings, introducing yourself and others, and asking/answering simple personal questions.',
        moduleType: 'Conversation',
        difficulty: 'Beginner',
        estimatedHours: 5,
        contentFormat: 'Text',
        active: true
      },
      {
        courseId: englishBeginnerCourse.id,
        title: 'Everyday Vocabulary',
        description: 'Build your essential English vocabulary for daily situations like shopping, eating out, and asking for directions.',
        content: 'This module presents vocabulary for common objects, places, actions, and descriptive words used in everyday situations.',
        moduleType: 'Vocabulary',
        difficulty: 'Beginner',
        estimatedHours: 10,
        contentFormat: 'Text',
        active: true
      },
      {
        courseId: englishBeginnerCourse.id,
        title: 'Basic Grammar Foundations',
        description: 'Learn fundamental English grammar including present tense, articles, and basic sentence structure.',
        content: 'This module covers the building blocks of English grammar: subject-verb-object structure, present simple tense, articles (a/an/the), and basic pronouns.',
        moduleType: 'Grammar',
        difficulty: 'Beginner',
        estimatedHours: 10,
        contentFormat: 'Text',
        active: true
      },
      {
        courseId: englishBeginnerCourse.id,
        title: 'Practical Conversations',
        description: 'Practice speaking with guided conversations for real-life situations.',
        content: 'This module provides guided conversation practice for everyday situations like ordering food, asking for directions, and making small talk.',
        moduleType: 'Conversation',
        difficulty: 'Beginner',
        estimatedHours: 5,
        contentFormat: 'Audio',
        active: true
      },
      {
        courseId: englishBeginnerCourse.id,
        title: 'Numbers, Dates & Time',
        description: 'Learn to express and understand numbers, tell time, and discuss dates and schedules in English.',
        content: 'This module teaches you how to count, tell time, discuss calendar dates, and talk about schedules in English.',
        moduleType: 'Vocabulary',
        difficulty: 'Beginner',
        estimatedHours: 5,
        contentFormat: 'Text',
        active: true
      },
      {
        courseId: englishBeginnerCourse.id,
        title: 'Family & Relationships',
        description: 'Vocabulary and expressions for talking about family members, friends, and relationships.',
        content: 'This module covers vocabulary and expressions for talking about family members, describing relationships, and discussing personal connections.',
        moduleType: 'Vocabulary',
        difficulty: 'Beginner',
        estimatedHours: 5,
        contentFormat: 'Text',
        active: true
      }
    ];
    
    // Insert modules into database
    console.log(`Adding ${defaultModules.length} modules for English Beginners...`);
    
    for (const module of defaultModules) {
      try {
        const result = await db.insert(schema.languageModules)
          .values(module)
          .returning();
        
        if (result && result.length > 0) {
          console.log(`Added module: ${module.title}`);
        }
      } catch (error) {
        console.error(`Error adding module ${module.title}:`, error);
      }
    }
    
    console.log('Finished initializing English Beginner modules');
  } catch (error) {
    console.error('Error initializing English Beginner modules:', error);
    throw error;
  }
}

/**
 * Initialize some basic vocabulary lists for English beginners
 */
export async function initializeEnglishVocabularyLists(storage: IStorage) {
  try {
    console.log('Initializing English vocabulary lists...');
    
    // Check if any vocabulary lists already exist using storage
    const existingLists = await storage.getVocabularyLists();
    
    if (existingLists && existingLists.length > 0) {
      console.log('Vocabulary lists already initialized, skipping...');
      return;
    }
    
    // Try to get the Everyday Vocabulary module from memory storage
    // Instead of directly querying DB, we'll use the language modules from memory storage
    const allModules = await storage.getLanguageModules();
    const everydayVocabModule = allModules?.find(module => module.title === 'Everyday Vocabulary');
    
    if (!everydayVocabModule) {
      console.error('Everyday Vocabulary module not found, cannot add vocabulary lists');
      return;
    }
    
    // Default vocabulary lists
    const defaultVocabularyLists = [
      {
        moduleId: everydayVocabModule.id,
        title: 'Food & Dining',
        description: 'Essential vocabulary for talking about food, ordering in restaurants, and grocery shopping.',
        category: 'Daily Life',
        difficulty: 'Beginner',
        active: true
      },
      {
        moduleId: everydayVocabModule.id,
        title: 'Transportation & Directions',
        description: 'Words and phrases for getting around town, using public transportation, and asking for directions.',
        category: 'Travel',
        difficulty: 'Beginner',
        active: true
      },
      {
        moduleId: everydayVocabModule.id,
        title: 'Shopping & Money',
        description: 'Vocabulary for shopping experiences, money, prices, and basic transactions.',
        category: 'Daily Life',
        difficulty: 'Beginner',
        active: true
      }
    ];
    
    // Insert vocabulary lists using storage interface instead of direct DB access
    console.log(`Adding ${defaultVocabularyLists.length} vocabulary lists...`);
    
    const createdListIds = [];
    
    for (const list of defaultVocabularyLists) {
      try {
        // Try creating with the proper function from storage
        // Handle cases where the storage might have either createVocabularyList or addVocabularyList
        let result;
        if (typeof storage.createVocabularyList === 'function') {
          result = await storage.createVocabularyList(list);
        } else {
          // Fallback to creating directly in memory storage
          const id = Math.floor(Math.random() * 10000) + 1;
          const newList = {
            ...list,
            id,
            createdAt: new Date()
          };
          
          // Make sure the map exists
          if (!storage.vocabularyLists) {
            storage.vocabularyLists = new Map();
          }
          
          storage.vocabularyLists.set(id, newList);
          result = newList;
          console.log(`Created vocabulary list with id ${id} using fallback method`);
        }
        
        if (result) {
          console.log(`Added vocabulary list: ${list.title}`);
          createdListIds.push(result.id);
        }
      } catch (error) {
        console.error(`Error adding vocabulary list ${list.title}:`, error);
      }
    }
    
    // Now add some vocabulary items to the first list (Food & Dining)
    if (createdListIds.length > 0) {
      const foodVocabularyItems = [
        {
          listId: createdListIds[0],
          term: 'restaurant',
          definition: 'A place where people pay to sit and eat meals',
          exampleSentence: 'We had dinner at an Italian restaurant last night.',
          pronunciation: 'res-tuh-rahnt',
          partOfSpeech: 'noun'
        },
        {
          listId: createdListIds[0],
          term: 'menu',
          definition: 'A list of dishes available at a restaurant',
          exampleSentence: 'The waiter brought us the menu and we ordered food.',
          pronunciation: 'men-yoo',
          partOfSpeech: 'noun'
        },
        {
          listId: createdListIds[0],
          term: 'order',
          definition: 'To request food or drinks in a restaurant',
          exampleSentence: 'I would like to order a coffee, please.',
          pronunciation: 'or-der',
          partOfSpeech: 'verb'
        },
        {
          listId: createdListIds[0],
          term: 'delicious',
          definition: 'Having a very pleasant taste',
          exampleSentence: 'This soup is delicious!',
          pronunciation: 'dih-lish-uhs',
          partOfSpeech: 'adjective'
        },
        {
          listId: createdListIds[0],
          term: 'bill',
          definition: 'A list showing how much you need to pay',
          exampleSentence: 'Could we have the bill, please?',
          pronunciation: 'bill',
          partOfSpeech: 'noun'
        }
      ];
      
      for (const item of foodVocabularyItems) {
        try {
          // Try creating with the proper function from storage
          // Handle cases where the storage might have either createVocabularyItem or addVocabularyItem
          let result;
          if (typeof storage.createVocabularyItem === 'function') {
            result = await storage.createVocabularyItem(item);
          } else {
            // Fallback to creating directly in memory storage
            const id = Math.floor(Math.random() * 10000) + 1;
            const newItem = {
              ...item,
              id,
              active: true,
              createdAt: new Date()
            };
            
            // Make sure the map exists
            if (!storage.vocabularyItems) {
              storage.vocabularyItems = new Map();
            }
            
            storage.vocabularyItems.set(id, newItem);
            result = newItem;
            console.log(`Created vocabulary item with id ${id} using fallback method`);
          }
          
          console.log(`Added vocabulary item: ${item.term}`);
        } catch (error) {
          console.error(`Error adding vocabulary item ${item.term}:`, error);
        }
      }
    }
    
    console.log('Finished initializing vocabulary lists');
  } catch (error) {
    console.error('Error initializing vocabulary lists:', error);
    throw error;
  }
}

/**
 * Initialize all Language School data
 */
export async function initializeLanguageSchoolData(storage: IStorage) {
  try {
    console.log('Initializing all Language School data...');
    
    await initializeLanguageCourses(storage);
    await initializeEnglishBeginnerModules(storage);
    await initializeEnglishVocabularyLists(storage);
    
    console.log('✅ Successfully initialized Language School data');
    return true;
  } catch (error) {
    console.error('Error initializing Language School data:', error);
    return false;
  }
}