/**
 * CMS Storage Implementation
 * 
 * This file implements the storage methods for the content management system
 * using either an in-memory store or database connection.
 */

import { IStorage } from '../storage';
import { ICMSStorage } from './cms-interface';
import { 
  School, InsertSchool,
  NeurodivergentSchool, InsertNeurodivergentSchool,
  LawSchool, InsertLawSchool,
  LanguageSchool, InsertLanguageSchool,
  Page, InsertPage,
  AiTeacher, InsertAiTeacher,
  Resource, InsertResource
} from '../../shared/cms-schema';
import { eq } from 'drizzle-orm';
import { 
  schools, 
  neurodivergentSchools, 
  lawSchools, 
  languageSchools, 
  pages, 
  aiTeachers, 
  resources 
} from '../../shared/cms-schema';
import { db } from '../db';

// In-memory data storage for environments without a database
interface CMSMemData {
  schools: School[];
  neurodivergentSchools: NeurodivergentSchool[];
  lawSchools: LawSchool[];
  languageSchools: LanguageSchool[];
  pages: Page[];
  aiTeachers: AiTeacher[];
  resources: Resource[];
  idCounters: {
    schools: number;
    neurodivergentSchools: number;
    lawSchools: number;
    languageSchools: number;
    pages: number;
    aiTeachers: number;
    resources: number;
  };
}

/**
 * Extends the storage interface with CMS-specific methods
 */
export function applyCMSMethods(storage: IStorage): IStorage {
  // Initialize memory storage if we're using in-memory mode
  const useMemory = !process.env.DATABASE_URL || process.env.USE_MEMORY_STORAGE === 'true';
  let memData: CMSMemData | undefined;
  
  if (useMemory) {
    memData = {
      schools: [],
      neurodivergentSchools: [],
      lawSchools: [],
      languageSchools: [],
      pages: [],
      aiTeachers: [],
      resources: [],
      idCounters: {
        schools: 1,
        neurodivergentSchools: 1,
        lawSchools: 1,
        languageSchools: 1,
        pages: 1,
        aiTeachers: 1,
        resources: 1
      }
    };
    
    // Initialize some demo data
    initializeMemoryData();
  }
  
  function initializeMemoryData() {
    if (!memData) return;
    
    // Add some example schools if the data is empty
    if (memData.schools.length === 0) {
      // Elementary School (Neurodivergent)
      const ndElementarySchool: School = {
        id: memData.idCounters.schools++,
        name: "SuperKids Elementary",
        slug: "superkids-elementary",
        description: "A superhero-themed elementary school for neurodivergent learners from preschool to 6th grade.",
        type: "elementary",
        gradeRange: "Preschool-6th",
        logoUrl: "/assets/logos/superkids.png",
        headerColor: "#FF5722",
        website: "https://shatzios.com/superkids",
        location: "Digital Campus",
        specialties: ["ADHD", "Autism", "Dyslexia", "Giftedness"],
        studentCount: 450,
        academicYear: 2025,
        studentSatisfaction: 95,
        completionRate: 98,
        knowledgeRetention: 92,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.schools.push(ndElementarySchool);
      
      // Add the neurodivergent specific data
      const ndElementaryDetails: NeurodivergentSchool = {
        id: memData.idCounters.neurodivergentSchools++,
        schoolId: ndElementarySchool.id,
        supportedNeurotypes: ["ADHD", "Autism", "Dyslexia", "Dyscalculia", "Giftedness"],
        accommodations: ["Visual Schedules", "Sensory Breaks", "Executive Function Support", "Reading Assistance"],
        specializedPrograms: ["Superhero Social Skills", "Multisensory Reading", "Math Without Tears"],
        assistiveTechnologies: ["Text-to-Speech", "Speech-to-Text", "Visual Timers", "Alternative Input Devices"],
        inclusionLevel: 5,
        parentSupportResources: true,
        individualizedPlans: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        school: ndElementarySchool
      };
      memData.neurodivergentSchools.push(ndElementaryDetails);
      
      // Middle/High School (Neurodivergent)
      const ndHighSchool: School = {
        id: memData.idCounters.schools++,
        name: "Divergent Academy",
        slug: "divergent-academy",
        description: "A cutting-edge middle and high school designed specifically for neurodivergent students.",
        type: "high",
        gradeRange: "7th-12th",
        logoUrl: "/assets/logos/divergent.png",
        headerColor: "#3F51B5",
        website: "https://shatzios.com/divergent",
        location: "Digital Campus",
        specialties: ["Self-advocacy", "Executive Function", "Career Readiness", "STEM Excellence"],
        studentCount: 325,
        academicYear: 2025,
        studentSatisfaction: 92,
        completionRate: 95,
        knowledgeRetention: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.schools.push(ndHighSchool);
      
      // Add the neurodivergent specific data
      const ndHighSchoolDetails: NeurodivergentSchool = {
        id: memData.idCounters.neurodivergentSchools++,
        schoolId: ndHighSchool.id,
        supportedNeurotypes: ["ADHD", "Autism", "Dyslexia", "Dyscalculia", "Twice Exceptional"],
        accommodations: ["Extended Time", "Note-taking Assistance", "Modified Assignments", "Anxiety Support"],
        specializedPrograms: ["Executive Function Coaching", "Social Navigation", "Career Pathways", "STEM Pathways"],
        assistiveTechnologies: ["Organization Apps", "Annotation Tools", "Graphic Organizers", "Mind Mapping Software"],
        inclusionLevel: 4,
        parentSupportResources: true,
        individualizedPlans: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        school: ndHighSchool
      };
      memData.neurodivergentSchools.push(ndHighSchoolDetails);
      
      // Law School
      const lawSchool: School = {
        id: memData.idCounters.schools++,
        name: "Shatzii School of Law",
        slug: "shatzii-law",
        description: "A comprehensive online law school offering UAE bar preparation and specialized legal education.",
        type: "law",
        gradeRange: "Graduate",
        logoUrl: "/assets/logos/law-school.png",
        headerColor: "#1A237E",
        website: "https://shatzios.com/law",
        location: "Digital Campus",
        specialties: ["UAE Bar Exam", "Commercial Law", "International Law", "Technology Law"],
        studentCount: 180,
        academicYear: 2025,
        studentSatisfaction: 90,
        completionRate: 93,
        knowledgeRetention: 94,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.schools.push(lawSchool);
      
      // Add law school specific data
      const lawSchoolDetails: LawSchool = {
        id: memData.idCounters.lawSchools++,
        schoolId: lawSchool.id,
        barPassRate: 92,
        jurisdiction: "UAE",
        specializations: ["Commercial Law", "International Law", "Technology Law", "Criminal Law", "Family Law"],
        clinics: ["Legal Aid Clinic", "Business Law Clinic", "Human Rights Clinic"],
        moots: ["International Moot Competition", "UAE National Moot Court"],
        facultySize: 25,
        isAccredited: true,
        hasBarPrep: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        school: lawSchool
      };
      memData.lawSchools.push(lawSchoolDetails);
      
      // Language School
      const languageSchool: School = {
        id: memData.idCounters.schools++,
        name: "Global Languages Academy",
        slug: "global-languages",
        description: "An immersive language learning school offering courses in multiple languages with AI conversation practice.",
        type: "language",
        gradeRange: "All Ages",
        logoUrl: "/assets/logos/language-school.png",
        headerColor: "#00695C",
        website: "https://shatzios.com/languages",
        location: "Digital Campus",
        specialties: ["Conversation Practice", "Cultural Immersion", "Business Language", "Travel Readiness"],
        studentCount: 720,
        academicYear: 2025,
        studentSatisfaction: 96,
        completionRate: 85,
        knowledgeRetention: 88,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.schools.push(languageSchool);
      
      // Add language school specific data
      const languageSchoolDetails: LanguageSchool = {
        id: memData.idCounters.languageSchools++,
        schoolId: languageSchool.id,
        languages: ["English", "Spanish", "French", "Arabic", "Mandarin", "Japanese", "German", "Italian"],
        proficiencyLevels: ["Beginner", "Intermediate", "Advanced", "Professional"],
        teachingMethodologies: ["Immersive", "Communicative", "Task-based", "Lexical Approach"],
        culturalPrograms: ["Virtual Cultural Tours", "Cooking Classes", "Film Festivals", "Cultural Workshops"],
        certifications: ["TOEFL Preparation", "IELTS Preparation", "DELF/DALF", "HSK"],
        conversationPractice: true,
        immersionExperiences: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        school: languageSchool
      };
      memData.languageSchools.push(languageSchoolDetails);
      
      // Add some pages
      const homePage: Page = {
        id: memData.idCounters.pages++,
        title: "Welcome to ShatziiOS",
        slug: "home",
        content: "<h1>Welcome to the Future of Education</h1><p>ShatziiOS is a revolutionary educational platform designed to provide personalized learning experiences for all students, with special focus on neurodivergent learners.</p>",
        schoolId: null,
        type: "home",
        isPublished: true,
        publishedAt: new Date(),
        featuredImage: "/assets/images/homepage-hero.jpg",
        metaDescription: "ShatziiOS - The future of personalized education",
        metaKeywords: "education, neurodivergent, personalized learning, AI teachers",
        authorId: 1,
        layout: "fullwidth",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.pages.push(homePage);
      
      // Add some AI teachers
      const elementaryTeacher: AiTeacher = {
        id: memData.idCounters.aiTeachers++,
        name: "Ms. Stellar",
        subject: "Science",
        description: "A bright and enthusiastic science teacher who specializes in making complex concepts simple and fun.",
        avatarUrl: "/assets/avatars/ms-stellar.png",
        teachingStyle: "Visual, hands-on, and experiment-based learning with lots of positive reinforcement.",
        specialties: "Astronomy, Biology, Environmental Science",
        neurotypeTailoring: "Provides extra visual aids for visual learners, breaks down concepts into manageable chunks for ADHD students, and uses special interest-based examples for autistic students.",
        gradeLevel: "Elementary",
        schoolId: 1,
        aiModel: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        systemPrompt: "You are Ms. Stellar, an enthusiastic elementary school science teacher who makes learning fun and accessible for all students.",
        personalityPrompt: "You are bright, encouraging, and excited about science. You meet students at their level and celebrate small victories. You explain concepts in simple terms with lots of visual examples.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.aiTeachers.push(elementaryTeacher);
      
      const lawTeacher: AiTeacher = {
        id: memData.idCounters.aiTeachers++,
        name: "Professor Chambers",
        subject: "Commercial Law",
        description: "A distinguished professor of commercial law with extensive practical experience in UAE commercial regulations.",
        avatarUrl: "/assets/avatars/prof-chambers.png",
        teachingStyle: "Case-based learning with Socratic method and practical application exercises.",
        specialties: "UAE Commercial Code, Contract Law, Corporate Governance",
        neurotypeTailoring: "Provides structured outlines for executive function support, records sessions for review, and offers flexible assessment options.",
        gradeLevel: "Graduate",
        schoolId: 3,
        aiModel: "claude-3-7-sonnet-20250219", // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        systemPrompt: "You are Professor Chambers, an expert in UAE Commercial Law with decades of experience in both academia and legal practice.",
        personalityPrompt: "You are precise, thoughtful, and methodical. You challenge students with complex scenarios but guide them through the reasoning process. You frequently reference practical applications of legal principles.",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.aiTeachers.push(lawTeacher);
      
      // Add some resources
      const elementaryResource: Resource = {
        id: memData.idCounters.resources++,
        title: "Superhero Science Lab Manual",
        description: "A collection of fun, superhero-themed science experiments that can be done at home with simple materials.",
        type: "document",
        url: "/assets/resources/superhero-science-lab.pdf",
        schoolType: "elementary",
        subject: "Science",
        gradeLevel: "Elementary",
        format: "PDF",
        author: "Ms. Stellar",
        publishedAt: new Date(),
        schoolId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.resources.push(elementaryResource);
      
      const lawResource: Resource = {
        id: memData.idCounters.resources++,
        title: "UAE Commercial Code Study Guide",
        description: "A comprehensive study guide for the commercial code section of the UAE Bar Exam.",
        type: "document",
        url: "/assets/resources/uae-commercial-code-guide.pdf",
        schoolType: "law",
        subject: "Commercial Law",
        gradeLevel: "Graduate",
        format: "PDF",
        author: "Professor Chambers",
        publishedAt: new Date(),
        schoolId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.resources.push(lawResource);
    }
  }
  
  // Schools
  storage.getSchools = async () => {
    if (memData) {
      return memData.schools;
    } else {
      return await db.select().from(schools);
    }
  };
  
  storage.getSchoolsByType = async (type: string) => {
    if (memData) {
      return memData.schools.filter(school => school.type === type);
    } else {
      return await db.select().from(schools).where(eq(schools.type, type));
    }
  };
  
  storage.getSchoolById = async (id: number) => {
    if (memData) {
      return memData.schools.find(school => school.id === id) || null;
    } else {
      const result = await db.select().from(schools).where(eq(schools.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.getSchoolBySlug = async (slug: string) => {
    if (memData) {
      return memData.schools.find(school => school.slug === slug) || null;
    } else {
      const result = await db.select().from(schools).where(eq(schools.slug, slug));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createSchool = async (data: InsertSchool) => {
    if (memData) {
      const newSchool: School = {
        id: memData.idCounters.schools++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.schools.push(newSchool);
      return newSchool;
    } else {
      const result = await db.insert(schools).values(data).returning();
      return result[0];
    }
  };
  
  storage.updateSchool = async (id: number, data: Partial<InsertSchool>) => {
    if (memData) {
      const index = memData.schools.findIndex(school => school.id === id);
      if (index === -1) return null;
      
      memData.schools[index] = {
        ...memData.schools[index],
        ...data,
        updatedAt: new Date()
      };
      return memData.schools[index];
    } else {
      const result = await db.update(schools)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schools.id, id))
        .returning();
      return result.length ? result[0] : null;
    }
  };
  
  storage.deleteSchool = async (id: number) => {
    if (memData) {
      const index = memData.schools.findIndex(school => school.id === id);
      if (index === -1) return false;
      
      memData.schools.splice(index, 1);
      return true;
    } else {
      const result = await db.delete(schools).where(eq(schools.id, id)).returning();
      return result.length > 0;
    }
  };
  
  // Neurodivergent Schools
  storage.getNeurodivergentSchools = async () => {
    if (memData) {
      return memData.neurodivergentSchools.map(ndSchool => {
        const school = memData!.schools.find(s => s.id === ndSchool.schoolId);
        return { ...ndSchool, school };
      });
    } else {
      // Join with schools table to get full data
      const result = await db.select({
        ...neurodivergentSchools,
        school: schools
      }).from(neurodivergentSchools)
        .leftJoin(schools, eq(neurodivergentSchools.schoolId, schools.id));
      return result;
    }
  };
  
  storage.getNeurodivergentSchoolById = async (id: number) => {
    if (memData) {
      const ndSchool = memData.neurodivergentSchools.find(school => school.id === id);
      if (!ndSchool) return null;
      
      const school = memData.schools.find(s => s.id === ndSchool.schoolId);
      return { ...ndSchool, school };
    } else {
      const result = await db.select({
        ...neurodivergentSchools,
        school: schools
      }).from(neurodivergentSchools)
        .leftJoin(schools, eq(neurodivergentSchools.schoolId, schools.id))
        .where(eq(neurodivergentSchools.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.getNeurodivergentSchoolBySchoolId = async (schoolId: number) => {
    if (memData) {
      const ndSchool = memData.neurodivergentSchools.find(school => school.schoolId === schoolId);
      if (!ndSchool) return null;
      
      const school = memData.schools.find(s => s.id === ndSchool.schoolId);
      return { ...ndSchool, school };
    } else {
      const result = await db.select({
        ...neurodivergentSchools,
        school: schools
      }).from(neurodivergentSchools)
        .leftJoin(schools, eq(neurodivergentSchools.schoolId, schools.id))
        .where(eq(neurodivergentSchools.schoolId, schoolId));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createNeurodivergentSchool = async (data: InsertNeurodivergentSchool) => {
    if (memData) {
      const newSchool: NeurodivergentSchool = {
        id: memData.idCounters.neurodivergentSchools++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the school reference
      const school = memData.schools.find(s => s.id === data.schoolId);
      memData.neurodivergentSchools.push(newSchool);
      
      return { ...newSchool, school };
    } else {
      const result = await db.insert(neurodivergentSchools).values(data).returning();
      if (result.length) {
        const school = await db.select().from(schools).where(eq(schools.id, data.schoolId));
        return { ...result[0], school: school[0] };
      }
      return result[0];
    }
  };
  
  storage.updateNeurodivergentSchool = async (id: number, data: Partial<InsertNeurodivergentSchool>) => {
    if (memData) {
      const index = memData.neurodivergentSchools.findIndex(school => school.id === id);
      if (index === -1) return null;
      
      memData.neurodivergentSchools[index] = {
        ...memData.neurodivergentSchools[index],
        ...data,
        updatedAt: new Date()
      };
      
      const school = memData.schools.find(s => s.id === memData.neurodivergentSchools[index].schoolId);
      return { ...memData.neurodivergentSchools[index], school };
    } else {
      const result = await db.update(neurodivergentSchools)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(neurodivergentSchools.id, id))
        .returning();
      
      if (result.length) {
        const school = await db.select().from(schools).where(eq(schools.id, result[0].schoolId));
        return { ...result[0], school: school[0] };
      }
      return null;
    }
  };
  
  // Law Schools
  storage.getLawSchools = async () => {
    if (memData) {
      return memData.lawSchools.map(lawSchool => {
        const school = memData!.schools.find(s => s.id === lawSchool.schoolId);
        return { ...lawSchool, school };
      });
    } else {
      const result = await db.select({
        ...lawSchools,
        school: schools
      }).from(lawSchools)
        .leftJoin(schools, eq(lawSchools.schoolId, schools.id));
      return result;
    }
  };
  
  storage.getLawSchoolById = async (id: number) => {
    if (memData) {
      const lawSchool = memData.lawSchools.find(school => school.id === id);
      if (!lawSchool) return null;
      
      const school = memData.schools.find(s => s.id === lawSchool.schoolId);
      return { ...lawSchool, school };
    } else {
      const result = await db.select({
        ...lawSchools,
        school: schools
      }).from(lawSchools)
        .leftJoin(schools, eq(lawSchools.schoolId, schools.id))
        .where(eq(lawSchools.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.getLawSchoolBySchoolId = async (schoolId: number) => {
    if (memData) {
      const lawSchool = memData.lawSchools.find(school => school.schoolId === schoolId);
      if (!lawSchool) return null;
      
      const school = memData.schools.find(s => s.id === lawSchool.schoolId);
      return { ...lawSchool, school };
    } else {
      const result = await db.select({
        ...lawSchools,
        school: schools
      }).from(lawSchools)
        .leftJoin(schools, eq(lawSchools.schoolId, schools.id))
        .where(eq(lawSchools.schoolId, schoolId));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createLawSchool = async (data: InsertLawSchool) => {
    if (memData) {
      const newSchool: LawSchool = {
        id: memData.idCounters.lawSchools++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the school reference
      const school = memData.schools.find(s => s.id === data.schoolId);
      memData.lawSchools.push(newSchool);
      
      return { ...newSchool, school };
    } else {
      const result = await db.insert(lawSchools).values(data).returning();
      if (result.length) {
        const school = await db.select().from(schools).where(eq(schools.id, data.schoolId));
        return { ...result[0], school: school[0] };
      }
      return result[0];
    }
  };
  
  storage.updateLawSchool = async (id: number, data: Partial<InsertLawSchool>) => {
    if (memData) {
      const index = memData.lawSchools.findIndex(school => school.id === id);
      if (index === -1) return null;
      
      memData.lawSchools[index] = {
        ...memData.lawSchools[index],
        ...data,
        updatedAt: new Date()
      };
      
      const school = memData.schools.find(s => s.id === memData.lawSchools[index].schoolId);
      return { ...memData.lawSchools[index], school };
    } else {
      const result = await db.update(lawSchools)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(lawSchools.id, id))
        .returning();
      
      if (result.length) {
        const school = await db.select().from(schools).where(eq(schools.id, result[0].schoolId));
        return { ...result[0], school: school[0] };
      }
      return null;
    }
  };
  
  // Language Schools
  storage.getLanguageSchools = async () => {
    if (memData) {
      return memData.languageSchools.map(langSchool => {
        const school = memData!.schools.find(s => s.id === langSchool.schoolId);
        return { ...langSchool, school };
      });
    } else {
      const result = await db.select({
        ...languageSchools,
        school: schools
      }).from(languageSchools)
        .leftJoin(schools, eq(languageSchools.schoolId, schools.id));
      return result;
    }
  };
  
  storage.getLanguageSchoolById = async (id: number) => {
    if (memData) {
      const langSchool = memData.languageSchools.find(school => school.id === id);
      if (!langSchool) return null;
      
      const school = memData.schools.find(s => s.id === langSchool.schoolId);
      return { ...langSchool, school };
    } else {
      const result = await db.select({
        ...languageSchools,
        school: schools
      }).from(languageSchools)
        .leftJoin(schools, eq(languageSchools.schoolId, schools.id))
        .where(eq(languageSchools.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.getLanguageSchoolBySchoolId = async (schoolId: number) => {
    if (memData) {
      const langSchool = memData.languageSchools.find(school => school.schoolId === schoolId);
      if (!langSchool) return null;
      
      const school = memData.schools.find(s => s.id === langSchool.schoolId);
      return { ...langSchool, school };
    } else {
      const result = await db.select({
        ...languageSchools,
        school: schools
      }).from(languageSchools)
        .leftJoin(schools, eq(languageSchools.schoolId, schools.id))
        .where(eq(languageSchools.schoolId, schoolId));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createLanguageSchool = async (data: InsertLanguageSchool) => {
    if (memData) {
      const newSchool: LanguageSchool = {
        id: memData.idCounters.languageSchools++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the school reference
      const school = memData.schools.find(s => s.id === data.schoolId);
      memData.languageSchools.push(newSchool);
      
      return { ...newSchool, school };
    } else {
      const result = await db.insert(languageSchools).values(data).returning();
      if (result.length) {
        const school = await db.select().from(schools).where(eq(schools.id, data.schoolId));
        return { ...result[0], school: school[0] };
      }
      return result[0];
    }
  };
  
  storage.updateLanguageSchool = async (id: number, data: Partial<InsertLanguageSchool>) => {
    if (memData) {
      const index = memData.languageSchools.findIndex(school => school.id === id);
      if (index === -1) return null;
      
      memData.languageSchools[index] = {
        ...memData.languageSchools[index],
        ...data,
        updatedAt: new Date()
      };
      
      const school = memData.schools.find(s => s.id === memData.languageSchools[index].schoolId);
      return { ...memData.languageSchools[index], school };
    } else {
      const result = await db.update(languageSchools)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(languageSchools.id, id))
        .returning();
      
      if (result.length) {
        const school = await db.select().from(schools).where(eq(schools.id, result[0].schoolId));
        return { ...result[0], school: school[0] };
      }
      return null;
    }
  };
  
  // Pages
  storage.getPages = async (filters?: { schoolId?: number, type?: string }) => {
    if (memData) {
      let filteredPages = [...memData.pages];
      
      if (filters?.schoolId) {
        filteredPages = filteredPages.filter(page => page.schoolId === filters.schoolId);
      }
      
      if (filters?.type) {
        filteredPages = filteredPages.filter(page => page.type === filters.type);
      }
      
      return filteredPages;
    } else {
      let query = db.select().from(pages);
      
      if (filters?.schoolId) {
        query = query.where(eq(pages.schoolId, filters.schoolId));
      }
      
      if (filters?.type) {
        query = query.where(eq(pages.type, filters.type));
      }
      
      return await query;
    }
  };
  
  storage.getPageById = async (id: number) => {
    if (memData) {
      return memData.pages.find(page => page.id === id) || null;
    } else {
      const result = await db.select().from(pages).where(eq(pages.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.getPageBySlug = async (slug: string) => {
    if (memData) {
      return memData.pages.find(page => page.slug === slug) || null;
    } else {
      const result = await db.select().from(pages).where(eq(pages.slug, slug));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createPage = async (data: InsertPage) => {
    if (memData) {
      const newPage: Page = {
        id: memData.idCounters.pages++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.pages.push(newPage);
      return newPage;
    } else {
      const result = await db.insert(pages).values(data).returning();
      return result[0];
    }
  };
  
  storage.updatePage = async (id: number, data: Partial<InsertPage>) => {
    if (memData) {
      const index = memData.pages.findIndex(page => page.id === id);
      if (index === -1) return null;
      
      memData.pages[index] = {
        ...memData.pages[index],
        ...data,
        updatedAt: new Date()
      };
      return memData.pages[index];
    } else {
      const result = await db.update(pages)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(pages.id, id))
        .returning();
      return result.length ? result[0] : null;
    }
  };
  
  storage.deletePage = async (id: number) => {
    if (memData) {
      const index = memData.pages.findIndex(page => page.id === id);
      if (index === -1) return false;
      
      memData.pages.splice(index, 1);
      return true;
    } else {
      const result = await db.delete(pages).where(eq(pages.id, id)).returning();
      return result.length > 0;
    }
  };
  
  // AI Teachers
  storage.getAiTeachers = async (filters?: { schoolId?: number }) => {
    if (memData) {
      let filteredTeachers = [...memData.aiTeachers];
      
      if (filters?.schoolId) {
        filteredTeachers = filteredTeachers.filter(teacher => teacher.schoolId === filters.schoolId);
      }
      
      return filteredTeachers;
    } else {
      let query = db.select().from(aiTeachers);
      
      if (filters?.schoolId) {
        query = query.where(eq(aiTeachers.schoolId, filters.schoolId));
      }
      
      return await query;
    }
  };
  
  storage.getAiTeacherById = async (id: number) => {
    if (memData) {
      return memData.aiTeachers.find(teacher => teacher.id === id) || null;
    } else {
      const result = await db.select().from(aiTeachers).where(eq(aiTeachers.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createAiTeacher = async (data: InsertAiTeacher) => {
    if (memData) {
      const newTeacher: AiTeacher = {
        id: memData.idCounters.aiTeachers++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.aiTeachers.push(newTeacher);
      return newTeacher;
    } else {
      const result = await db.insert(aiTeachers).values(data).returning();
      return result[0];
    }
  };
  
  storage.updateAiTeacher = async (id: number, data: Partial<InsertAiTeacher>) => {
    if (memData) {
      const index = memData.aiTeachers.findIndex(teacher => teacher.id === id);
      if (index === -1) return null;
      
      memData.aiTeachers[index] = {
        ...memData.aiTeachers[index],
        ...data,
        updatedAt: new Date()
      };
      return memData.aiTeachers[index];
    } else {
      const result = await db.update(aiTeachers)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(aiTeachers.id, id))
        .returning();
      return result.length ? result[0] : null;
    }
  };
  
  storage.deleteAiTeacher = async (id: number) => {
    if (memData) {
      const index = memData.aiTeachers.findIndex(teacher => teacher.id === id);
      if (index === -1) return false;
      
      memData.aiTeachers.splice(index, 1);
      return true;
    } else {
      const result = await db.delete(aiTeachers).where(eq(aiTeachers.id, id)).returning();
      return result.length > 0;
    }
  };
  
  // Resources
  storage.getResources = async (filters?: { schoolId?: number, type?: string, schoolType?: string }) => {
    if (memData) {
      let filteredResources = [...memData.resources];
      
      if (filters?.schoolId) {
        filteredResources = filteredResources.filter(resource => resource.schoolId === filters.schoolId);
      }
      
      if (filters?.type) {
        filteredResources = filteredResources.filter(resource => resource.type === filters.type);
      }
      
      if (filters?.schoolType) {
        filteredResources = filteredResources.filter(resource => resource.schoolType === filters.schoolType);
      }
      
      return filteredResources;
    } else {
      let query = db.select().from(resources);
      
      if (filters?.schoolId) {
        query = query.where(eq(resources.schoolId, filters.schoolId));
      }
      
      if (filters?.type) {
        query = query.where(eq(resources.type, filters.type));
      }
      
      if (filters?.schoolType) {
        query = query.where(eq(resources.schoolType, filters.schoolType));
      }
      
      return await query;
    }
  };
  
  storage.getResourceById = async (id: number) => {
    if (memData) {
      return memData.resources.find(resource => resource.id === id) || null;
    } else {
      const result = await db.select().from(resources).where(eq(resources.id, id));
      return result.length ? result[0] : null;
    }
  };
  
  storage.createResource = async (data: InsertResource) => {
    if (memData) {
      const newResource: Resource = {
        id: memData.idCounters.resources++,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memData.resources.push(newResource);
      return newResource;
    } else {
      const result = await db.insert(resources).values(data).returning();
      return result[0];
    }
  };
  
  storage.updateResource = async (id: number, data: Partial<InsertResource>) => {
    if (memData) {
      const index = memData.resources.findIndex(resource => resource.id === id);
      if (index === -1) return null;
      
      memData.resources[index] = {
        ...memData.resources[index],
        ...data,
        updatedAt: new Date()
      };
      return memData.resources[index];
    } else {
      const result = await db.update(resources)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(resources.id, id))
        .returning();
      return result.length ? result[0] : null;
    }
  };
  
  storage.deleteResource = async (id: number) => {
    if (memData) {
      const index = memData.resources.findIndex(resource => resource.id === id);
      if (index === -1) return false;
      
      memData.resources.splice(index, 1);
      return true;
    } else {
      const result = await db.delete(resources).where(eq(resources.id, id)).returning();
      return result.length > 0;
    }
  };
  
  return storage;
}