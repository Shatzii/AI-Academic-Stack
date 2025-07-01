/**
 * CMS Data Initialization
 * 
 * This file contains logic to initialize the CMS with default data for the three
 * school types: Neurodivergent, Law, and Language Schools.
 */

import { IStorage } from '../storage';
import { 
  InsertSchool, 
  InsertNeurodivergentSchool,
  InsertLawSchool,
  InsertLanguageSchool,
  InsertPage,
  InsertAiTeacher,
  InsertResource
} from '../../shared/cms-schema';

/**
 * Initialize default CMS data for all schools
 */
export async function initializeCMSData(storage: IStorage): Promise<void> {
  console.log('🏫 Initializing CMS data...');
  
  try {
    // Check if we already have schools
    const existingSchools = await storage.getSchools();
    
    if (existingSchools && existingSchools.length > 0) {
      console.log('✅ CMS data already initialized, skipping');
      return;
    }
    
    console.log('⏳ Creating default CMS data...');
    
    // Create the elementary neurodivergent school
    await initializeElementarySchool(storage);
    
    // Create middle/high neurodivergent schools
    await initializeMiddleHighSchools(storage);
    
    // Create law school
    await initializeLawSchool(storage);
    
    // Create language school
    await initializeLanguageSchool(storage);
    
    console.log('✅ CMS data initialization complete');
  } catch (error) {
    console.error('❌ Error initializing CMS data:', error);
  }
}

/**
 * Initialize the elementary neurodivergent school
 */
async function initializeElementarySchool(storage: IStorage): Promise<void> {
  console.log('Creating Elementary Neurodivergent School...');
  
  try {
    // Create the base school
    const schoolData: InsertSchool = {
      name: 'Starworld Elementary',
      slug: 'starworld-elementary',
      description: 'A specialized elementary school for neurodivergent learners from preschool through 6th grade, featuring a superhero-themed curriculum and personalized learning approaches.',
      type: 'elementary',
      gradeRange: 'Preschool-6',
      logoUrl: '/assets/images/starworld-elementary-logo.svg',
      headerColor: '#6A0DAD', // Purple
      website: 'https://starworld-elementary.shatzios.edu',
      location: 'Virtual',
      specialties: ['ADHD', 'Autism', 'Dyslexia', 'Dyscalculia'],
      studentCount: 850,
      academicYear: 2025,
      studentSatisfaction: 94,
      completionRate: 97,
      knowledgeRetention: 92
    };
    
    const school = await storage.createSchool(schoolData);
    
    if (!school) {
      throw new Error('Failed to create elementary school');
    }
    
    // Add neurodivergent-specific data
    const ndSchoolData: InsertNeurodivergentSchool = {
      schoolId: school.id,
      supportedNeurotypes: ['ADHD', 'Autism', 'Dyslexia', 'Dyscalculia', 'Dysgraphia', 'Sensory Processing'],
      accommodations: [
        'Visual Schedules',
        'Sensory Breaks',
        'Text-to-Speech',
        'Speech-to-Text',
        'Extended Time',
        'Movement Breaks'
      ],
      specializedPrograms: [
        'Sensory Integration',
        'Executive Function Training',
        'Social Skills Coaching',
        'Reading Interventions'
      ],
      assistiveTechnologies: [
        'Speech Recognition',
        'Screen Readers',
        'Visual Timers',
        'Graphic Organizers',
        'Reading Assistants'
      ],
      inclusionLevel: 5,
      parentSupportResources: true,
      individualizedPlans: true
    };
    
    await storage.createNeurodivergentSchool(ndSchoolData);
    
    // Create default pages
    const homePageData: InsertPage = {
      title: 'Welcome to Starworld Elementary',
      slug: 'home',
      content: '<h1>Welcome to Starworld Elementary!</h1><p>Where every student is a superhero discovering their unique powers and talents. Our school specializes in neurodivergent education from preschool through 6th grade with personalized learning paths designed specifically for your child\'s neurotype and learning style.</p><div class="hero-banner">Join our community of young superheroes today!</div>',
      schoolId: school.id,
      type: 'home',
      isPublished: true,
      publishedAt: new Date(),
      featuredImage: '/assets/images/starworld-elementary-hero.jpg',
      metaDescription: 'Starworld Elementary provides specialized education for neurodivergent learners from preschool through 6th grade.',
      metaKeywords: 'neurodivergent, elementary school, ADHD, autism, dyslexia, personalized learning',
      layout: 'superhero',
      order: 1
    };
    
    await storage.createPage(homePageData);
    
    // Create AI teachers
    const aiTeacherData: InsertAiTeacher = {
      name: 'Professor Starbright',
      subject: 'Science',
      description: 'A friendly and energetic science teacher who specializes in making complex concepts visual and interactive. Professor Starbright uses cosmic themes and space adventures to teach science.',
      avatarUrl: '/assets/images/prof-starbright.svg',
      teachingStyle: 'Visual, hands-on learning with lots of movement breaks and interactive demonstrations. Uses cosmic themes and superhero analogies to explain scientific concepts.',
      specialties: 'ADHD, Sensory Processing, Visual Learning',
      neurotypeTailoring: 'Provides frequent movement breaks, uses visual aids and demonstrations, offers sensory-friendly explanations with tangible examples.',
      gradeLevel: 'Elementary',
      schoolId: school.id,
      aiModel: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      systemPrompt: 'You are Professor Starbright, an energetic elementary school science teacher who specializes in teaching neurodivergent students. You use cosmic themes, superhero analogies, and lots of visual descriptions to make science exciting and accessible. You provide frequent movement breaks and sensory-friendly explanations with concrete examples. Keep explanations concise, use simple language, and ask frequent comprehension check questions.',
      personalityPrompt: 'Enthusiastic, positive, patient, and encouraging. You get excited about scientific discoveries and help students see themselves as young scientists with special powers of observation and curiosity. You are playful and incorporate cosmic themes and space adventures in your teaching.',
      active: true
    };
    
    await storage.createAiTeacher(aiTeacherData);
    
    // Create resources
    const resourceData: InsertResource = {
      title: 'Visual Schedule Templates',
      description: 'Customizable visual schedule templates designed for elementary students with ADHD, autism, and executive functioning challenges.',
      type: 'download',
      url: '/resources/visual-schedules.pdf',
      schoolType: 'elementary',
      subject: 'Organization',
      gradeLevel: 'Elementary',
      format: 'PDF',
      author: 'Starworld Educational Support Team',
      publishedAt: new Date(),
      schoolId: school.id
    };
    
    await storage.createResource(resourceData);
    
    console.log('✅ Elementary school data created successfully');
  } catch (error) {
    console.error('❌ Error creating elementary school data:', error);
  }
}

/**
 * Initialize the middle and high neurodivergent schools
 */
async function initializeMiddleHighSchools(storage: IStorage): Promise<void> {
  console.log('Creating Middle and High Neurodivergent Schools...');
  
  try {
    // Middle School
    const middleSchoolData: InsertSchool = {
      name: 'Neurodivergent Academy Middle School',
      slug: 'neurodivergent-middle',
      description: 'A supportive middle school environment for neurodivergent students in grades 7-8, emphasizing academic growth while developing executive functioning and social skills.',
      type: 'middle',
      gradeRange: '7-8',
      logoUrl: '/assets/images/neurodivergent-middle-logo.svg',
      headerColor: '#0056b3', // Deep Blue
      website: 'https://middle.neurodivergent-academy.shatzios.edu',
      location: 'Virtual',
      specialties: ['ADHD', 'Autism', 'Dyslexia', 'Executive Functioning'],
      studentCount: 420,
      academicYear: 2025,
      studentSatisfaction: 91,
      completionRate: 95,
      knowledgeRetention: 89
    };
    
    const middleSchool = await storage.createSchool(middleSchoolData);
    
    if (middleSchool) {
      // Add neurodivergent-specific data
      const ndMiddleSchoolData: InsertNeurodivergentSchool = {
        schoolId: middleSchool.id,
        supportedNeurotypes: ['ADHD', 'Autism', 'Dyslexia', 'Executive Functioning', 'Anxiety', 'Giftedness'],
        accommodations: [
          'Extended Time',
          'Organizational Support',
          'Note-Taking Assistance',
          'Text-to-Speech',
          'Anxiety Management Tools',
          'Flexible Seating'
        ],
        specializedPrograms: [
          'Executive Function Coaching',
          'Social Skills Development',
          'Study Strategy Instruction',
          'Mindfulness & Regulation'
        ],
        assistiveTechnologies: [
          'Digital Organization Systems',
          'Dictation Software',
          'Reading Assistants',
          'Mind-Mapping Tools'
        ],
        inclusionLevel: 5,
        parentSupportResources: true,
        individualizedPlans: true
      };
      
      await storage.createNeurodivergentSchool(ndMiddleSchoolData);
      console.log('✅ Middle school data created successfully');
    }
    
    // High School
    const highSchoolData: InsertSchool = {
      name: 'Neurodivergent Academy High School',
      slug: 'neurodivergent-high',
      description: 'A comprehensive high school designed for neurodivergent students in grades 9-12, providing rigorous academics with appropriate accommodations and transition planning.',
      type: 'high',
      gradeRange: '9-12',
      logoUrl: '/assets/images/neurodivergent-high-logo.svg',
      headerColor: '#205072', // Deep Teal
      website: 'https://high.neurodivergent-academy.shatzios.edu',
      location: 'Virtual',
      specialties: ['ADHD', 'Autism', 'Dyslexia', 'Gifted/2e', 'Executive Functioning'],
      studentCount: 580,
      academicYear: 2025,
      studentSatisfaction: 92,
      completionRate: 94,
      knowledgeRetention: 90
    };
    
    const highSchool = await storage.createSchool(highSchoolData);
    
    if (highSchool) {
      // Add neurodivergent-specific data
      const ndHighSchoolData: InsertNeurodivergentSchool = {
        schoolId: highSchool.id,
        supportedNeurotypes: ['ADHD', 'Autism', 'Dyslexia', 'Executive Functioning', 'Anxiety', 'Giftedness', '2e'],
        accommodations: [
          'Extended Time',
          'Organization Systems',
          'Assistive Technology',
          'Alternative Assessments',
          'Study Skills Support',
          'Reduced Sensory Stimulation'
        ],
        specializedPrograms: [
          'College Transition Planning',
          'Career Exploration',
          'Self-Advocacy Training',
          'Executive Function Coaching',
          'Advanced Placement with Support'
        ],
        assistiveTechnologies: [
          'Digital Planners',
          'Speech-to-Text',
          'Text-to-Speech',
          'Note-Taking Systems',
          'Assignment Trackers'
        ],
        inclusionLevel: 5,
        parentSupportResources: true,
        individualizedPlans: true
      };
      
      await storage.createNeurodivergentSchool(ndHighSchoolData);
      console.log('✅ High school data created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating middle/high school data:', error);
  }
}

/**
 * Initialize the law school
 */
async function initializeLawSchool(storage: IStorage): Promise<void> {
  console.log('Creating Law School...');
  
  try {
    // Create the base school
    const schoolData: InsertSchool = {
      name: 'Shatzii School of Law',
      slug: 'shatzii-law',
      description: 'A specialized law school designed for neurodivergent students, offering comprehensive legal education with UAE Bar Exam preparation and accommodations for diverse learning styles.',
      type: 'law',
      gradeRange: 'Professional',
      logoUrl: '/assets/images/shatzii-law-logo.svg',
      headerColor: '#8B0000', // Dark Red
      website: 'https://law.shatzios.edu',
      location: 'Virtual (UAE focus)',
      specialties: ['UAE Law', 'Bar Exam Preparation', 'Legal Research', 'Legal Writing'],
      studentCount: 350,
      academicYear: 2025,
      studentSatisfaction: 95,
      completionRate: 92,
      knowledgeRetention: 96
    };
    
    const school = await storage.createSchool(schoolData);
    
    if (!school) {
      throw new Error('Failed to create law school');
    }
    
    // Add law school-specific data
    const lawSchoolData: InsertLawSchool = {
      schoolId: school.id,
      barPassRate: 92,
      jurisdiction: 'United Arab Emirates',
      specializations: ['Commercial Law', 'International Law', 'Constitutional Law', 'Criminal Law', 'Civil Procedure'],
      clinics: ['Legal Aid Clinic', 'Business Law Clinic', 'Human Rights Clinic'],
      moots: ['UAE National Moot Court', 'International Commercial Arbitration Moot', 'Human Rights Moot Court'],
      facultySize: 24,
      isAccredited: true,
      hasBarPrep: true
    };
    
    await storage.createLawSchool(lawSchoolData);
    
    // Create home page
    const homePageData: InsertPage = {
      title: 'Welcome to Shatzii School of Law',
      slug: 'home',
      content: '<h1>Welcome to Shatzii School of Law</h1><p>A legal education designed for all minds. Our school specializes in UAE legal education with specific accommodations for neurodivergent learning styles, offering comprehensive preparation for the UAE Bar Exam and specialized legal concentrations.</p><div class="cta-banner">Begin your legal journey today</div>',
      schoolId: school.id,
      type: 'home',
      isPublished: true,
      publishedAt: new Date(),
      featuredImage: '/assets/images/shatzii-law-hero.jpg',
      metaDescription: 'Shatzii School of Law provides specialized legal education for neurodivergent students with UAE Bar Exam preparation.',
      metaKeywords: 'law school, neurodivergent, UAE law, bar exam, legal education',
      layout: 'professional',
      order: 1
    };
    
    await storage.createPage(homePageData);
    
    // Create AI teacher
    const aiTeacherData: InsertAiTeacher = {
      name: 'Professor Aliyah Justice',
      subject: 'Constitutional Law',
      description: 'A thorough and methodical Constitutional Law professor who specializes in making complex legal frameworks accessible through clear structures and visual frameworks.',
      avatarUrl: '/assets/images/prof-justice.svg',
      teachingStyle: 'Structured, systematic approach with visual frameworks, case breakdowns, and comprehensive outlines. Uses analogies and real-world examples to connect abstract concepts.',
      specialties: 'ADHD, Dyslexia, Visual Learning',
      neurotypeTailoring: 'Provides structured outlines, visual frameworks, and clear organization. Breaks complex topics into manageable components with frequent comprehension checks.',
      gradeLevel: 'Professional',
      schoolId: school.id,
      aiModel: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      systemPrompt: 'You are Professor Aliyah Justice, a Constitutional Law professor at Shatzii School of Law specializing in teaching neurodivergent students. You have expertise in UAE Constitutional Law and make complex legal frameworks accessible through clear structure and visual frameworks. You break down complex topics into manageable components and use practical examples to illustrate abstract concepts. Keep explanations clear, structured, and provide frequent comprehension checks.',
      personalityPrompt: 'Methodical, precise, and patient. You have a strong commitment to justice and helping students understand the foundational principles of constitutional law. While thorough and detailed, you ensure information is presented in a structured, accessible way that supports different learning styles.',
      active: true
    };
    
    await storage.createAiTeacher(aiTeacherData);
    
    console.log('✅ Law school data created successfully');
  } catch (error) {
    console.error('❌ Error creating law school data:', error);
  }
}

/**
 * Initialize the language school
 */
async function initializeLanguageSchool(storage: IStorage): Promise<void> {
  console.log('Creating Language School...');
  
  try {
    // Create the base school
    const schoolData: InsertSchool = {
      name: 'Polyglot Language Institute',
      slug: 'polyglot-institute',
      description: 'A specialized language school that adapts to neurodivergent learning styles, offering multi-language acquisition programs with an emphasis on practical communication skills.',
      type: 'language',
      gradeRange: 'All Ages',
      logoUrl: '/assets/images/polyglot-logo.svg',
      headerColor: '#006400', // Dark Green
      website: 'https://language.shatzios.edu',
      location: 'Virtual',
      specialties: ['Spanish', 'French', 'Arabic', 'Mandarin', 'German'],
      studentCount: 620,
      academicYear: 2025,
      studentSatisfaction: 93,
      completionRate: 91,
      knowledgeRetention: 90
    };
    
    const school = await storage.createSchool(schoolData);
    
    if (!school) {
      throw new Error('Failed to create language school');
    }
    
    // Add language school-specific data
    const languageSchoolData: InsertLanguageSchool = {
      schoolId: school.id,
      languages: ['Spanish', 'French', 'Arabic', 'Mandarin', 'German', 'Japanese', 'Italian', 'Russian'],
      proficiencyLevels: ['Beginner', 'Intermediate', 'Advanced', 'Fluent'],
      teachingMethodologies: ['Immersion', 'Communicative Approach', 'Task-Based Learning', 'Visual-Spatial Methods', 'Multisensory Learning'],
      culturalPrograms: ['Cultural Exchange', 'Cooking Classes', 'Film Studies', 'Literature Appreciation', 'Virtual Travel'],
      certifications: ['Language Proficiency Certificate', 'Teaching Qualification', 'Translation Certificate'],
      conversationPractice: true,
      immersionExperiences: true
    };
    
    await storage.createLanguageSchool(languageSchoolData);
    
    // Create home page
    const homePageData: InsertPage = {
      title: 'Welcome to Polyglot Language Institute',
      slug: 'home',
      content: '<h1>Welcome to Polyglot Language Institute</h1><p>Where language learning adapts to your unique thinking style. Our institute offers multi-language acquisition programs specifically designed for neurodivergent learners with an emphasis on practical communication skills and cultural understanding.</p><div class="language-banner">Begin your language journey today in Spanish, French, Arabic, Mandarin, German, Japanese, Italian, or Russian</div>',
      schoolId: school.id,
      type: 'home',
      isPublished: true,
      publishedAt: new Date(),
      featuredImage: '/assets/images/polyglot-hero.jpg',
      metaDescription: 'Polyglot Language Institute provides specialized language learning for neurodivergent students across multiple languages.',
      metaKeywords: 'language learning, neurodivergent, Spanish, French, Arabic, adaptive learning',
      layout: 'language',
      order: 1
    };
    
    await storage.createPage(homePageData);
    
    // Create AI teacher
    const aiTeacherData: InsertAiTeacher = {
      name: 'Profesora Carmen Flores',
      subject: 'Spanish',
      description: 'A vibrant and engaging Spanish teacher who specializes in multisensory language learning techniques. Profesora Flores makes language acquisition fun and accessible through immersive techniques.',
      avatarUrl: '/assets/images/prof-flores.svg',
      teachingStyle: 'Multisensory approach combining visual aids, movement, music, and storytelling. Emphasizes practical conversation skills through immersive scenarios and real-world contexts.',
      specialties: 'ADHD, Dyslexia, Auditory Processing',
      neurotypeTailoring: 'Uses visual vocabulary supports, incorporates movement and rhythm for memory retention, provides multiple pathways to learn grammar concepts, and offers flexible practice options.',
      gradeLevel: 'All Levels',
      schoolId: school.id,
      aiModel: 'claude-3-7-sonnet-20250219', // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      systemPrompt: 'You are Profesora Carmen Flores, a Spanish language teacher at Polyglot Language Institute specializing in teaching neurodivergent students. You use multisensory techniques combining visual supports, movement, music, and storytelling to make language acquisition accessible and engaging. You emphasize practical conversation skills and cultural context. Keep explanations clear and concise, with frequent practice opportunities and positive reinforcement.',
      personalityPrompt: 'Warm, energetic, and enthusiastic about Spanish language and culture. You are encouraging and create a positive, supportive learning environment. You use humor appropriately and celebrate students progress. Your passion for language learning is contagious.',
      active: true
    };
    
    await storage.createAiTeacher(aiTeacherData);
    
    console.log('✅ Language school data created successfully');
  } catch (error) {
    console.error('❌ Error creating language school data:', error);
  }
}