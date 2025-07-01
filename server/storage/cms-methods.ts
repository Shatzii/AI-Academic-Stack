/**
 * CMS Methods for Storage
 * 
 * These methods extend the storage interface to support CMS functionality
 */
import { v4 as uuidv4 } from 'uuid';
import type { MemStorage } from '../storage';

// In-memory storage for CMS content
const pages: any[] = [];
const schools: any[] = [];
const languages: any[] = [];
const lawSchoolContent: any[] = [];
const ndashContent: any[] = [];
const aiTeachers: any[] = [];

// Add methods to the storage interface
export function applyCmsMethods(storage: MemStorage): void {
  // Pages
  storage.getPages = async (params?: any) => {
    return pages;
  };
  
  storage.getPageById = async (id: string, params?: any) => {
    return pages.find(page => page.id === id);
  };
  
  storage.getPageBySlug = async (slug: string, params?: any) => {
    return pages.find(page => page.slug === slug);
  };
  
  storage.createPage = async (data: any) => {
    const newPage = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      ...data
    };
    pages.push(newPage);
    return newPage;
  };
  
  storage.updatePage = async (id: string, data: any) => {
    const index = pages.findIndex(page => page.id === id);
    if (index === -1) return null;
    
    const updatedPage = {
      ...pages[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    pages[index] = updatedPage;
    return updatedPage;
  };
  
  storage.deletePage = async (id: string) => {
    const index = pages.findIndex(page => page.id === id);
    if (index === -1) return false;
    
    pages.splice(index, 1);
    return true;
  };
  
  // Schools
  storage.getSchools = async (params?: any) => {
    return schools;
  };
  
  storage.getSchoolById = async (id: string, params?: any) => {
    return schools.find(school => school.id === id);
  };
  
  storage.getSchoolBySlug = async (slug: string, params?: any) => {
    return schools.find(school => school.slug === slug);
  };
  
  storage.createSchool = async (data: any) => {
    const newSchool = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      ...data
    };
    schools.push(newSchool);
    return newSchool;
  };
  
  storage.updateSchool = async (id: string, data: any) => {
    const index = schools.findIndex(school => school.id === id);
    if (index === -1) return null;
    
    const updatedSchool = {
      ...schools[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    schools[index] = updatedSchool;
    return updatedSchool;
  };
  
  storage.deleteSchool = async (id: string) => {
    const index = schools.findIndex(school => school.id === id);
    if (index === -1) return false;
    
    schools.splice(index, 1);
    return true;
  };
  
  // Languages
  storage.getLanguages = async (params?: any) => {
    return languages;
  };
  
  storage.getLanguageById = async (id: string, params?: any) => {
    return languages.find(language => language.id === id);
  };
  
  storage.getLanguageByCode = async (code: string, params?: any) => {
    return languages.find(language => language.languageCode === code);
  };
  
  storage.createLanguage = async (data: any) => {
    const newLanguage = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      ...data
    };
    languages.push(newLanguage);
    return newLanguage;
  };
  
  storage.updateLanguage = async (id: string, data: any) => {
    const index = languages.findIndex(language => language.id === id);
    if (index === -1) return null;
    
    const updatedLanguage = {
      ...languages[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    languages[index] = updatedLanguage;
    return updatedLanguage;
  };
  
  storage.deleteLanguage = async (id: string) => {
    const index = languages.findIndex(language => language.id === id);
    if (index === -1) return false;
    
    languages.splice(index, 1);
    return true;
  };
  
  // Law School Content
  storage.getLawSchool = async (params?: any) => {
    return lawSchoolContent;
  };
  
  storage.getLawSchoolById = async (id: string, params?: any) => {
    return lawSchoolContent.find(content => content.id === id);
  };
  
  storage.createLawSchool = async (data: any) => {
    const newContent = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      ...data
    };
    lawSchoolContent.push(newContent);
    return newContent;
  };
  
  storage.updateLawSchool = async (id: string, data: any) => {
    const index = lawSchoolContent.findIndex(content => content.id === id);
    if (index === -1) return null;
    
    const updatedContent = {
      ...lawSchoolContent[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    lawSchoolContent[index] = updatedContent;
    return updatedContent;
  };
  
  storage.deleteLawSchool = async (id: string) => {
    const index = lawSchoolContent.findIndex(content => content.id === id);
    if (index === -1) return false;
    
    lawSchoolContent.splice(index, 1);
    return true;
  };
  
  // NDASH Content
  storage.getNdash = async (params?: any) => {
    return ndashContent;
  };
  
  storage.getNdashById = async (id: string, params?: any) => {
    return ndashContent.find(content => content.id === id);
  };
  
  storage.createNdash = async (data: any) => {
    const newContent = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      ...data
    };
    ndashContent.push(newContent);
    return newContent;
  };
  
  storage.updateNdash = async (id: string, data: any) => {
    const index = ndashContent.findIndex(content => content.id === id);
    if (index === -1) return null;
    
    const updatedContent = {
      ...ndashContent[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    ndashContent[index] = updatedContent;
    return updatedContent;
  };
  
  storage.deleteNdash = async (id: string) => {
    const index = ndashContent.findIndex(content => content.id === id);
    if (index === -1) return false;
    
    ndashContent.splice(index, 1);
    return true;
  };
  
  // AI Teachers
  storage.getAiTeachers = async (params?: any) => {
    return aiTeachers;
  };
  
  storage.getAiTeacherById = async (id: string, params?: any) => {
    return aiTeachers.find(teacher => teacher.id === id);
  };
  
  storage.createAiTeacher = async (data: any) => {
    const newTeacher = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      ...data
    };
    aiTeachers.push(newTeacher);
    return newTeacher;
  };
  
  storage.updateAiTeacher = async (id: string, data: any) => {
    const index = aiTeachers.findIndex(teacher => teacher.id === id);
    if (index === -1) return null;
    
    const updatedTeacher = {
      ...aiTeachers[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    aiTeachers[index] = updatedTeacher;
    return updatedTeacher;
  };
  
  storage.deleteAiTeacher = async (id: string) => {
    const index = aiTeachers.findIndex(teacher => teacher.id === id);
    if (index === -1) return false;
    
    aiTeachers.splice(index, 1);
    return true;
  };
  
  // Initialize with some sample data
  if (schools.length === 0) {
    storage.createSchool({
      title: "Neurodivergent School",
      slug: "neurodivergent-school",
      description: "Specialized education for neurodivergent students from preschool through college.",
      themeColor: "#7c3aed",
      features: [
        {
          id: uuidv4(),
          title: "Adaptive Learning",
          description: "Personalized learning paths based on individual strengths and needs"
        },
        {
          id: uuidv4(),
          title: "Superhero Theme",
          description: "Engaging superhero-themed learning environment for elementary students"
        }
      ],
      levels: [
        {
          id: uuidv4(),
          name: "Elementary School",
          shortName: "Elementary",
          description: "K-6 education with superhero-themed learning",
          ageRange: "5-12",
          gradeLevel: "K-6",
          subjects: []
        },
        {
          id: uuidv4(),
          name: "Middle School",
          shortName: "Middle",
          description: "Grades 7-8 with transition to more mature learning",
          ageRange: "12-14",
          gradeLevel: "7-8",
          subjects: []
        },
        {
          id: uuidv4(),
          name: "High School",
          shortName: "High",
          description: "Grades 9-12 college preparatory education",
          ageRange: "14-18",
          gradeLevel: "9-12",
          subjects: []
        }
      ]
    });
    
    storage.createSchool({
      title: "Shatzii School of Law",
      slug: "law-school",
      description: "Comprehensive legal education with UAE Bar Exam preparation.",
      themeColor: "#1e40af",
      features: [
        {
          id: uuidv4(),
          title: "Bar Exam Prep",
          description: "Specialized preparation for the UAE Bar Exam"
        },
        {
          id: uuidv4(),
          title: "Case Studies",
          description: "In-depth analysis of real-world legal cases"
        }
      ],
      levels: []
    });
    
    storage.createSchool({
      title: "Language Learning School",
      slug: "language-school",
      description: "Multi-language acquisition with interactive lessons and AI conversation partners.",
      themeColor: "#059669",
      features: [
        {
          id: uuidv4(),
          title: "AI Conversation Partners",
          description: "Practice language skills with AI conversation partners"
        },
        {
          id: uuidv4(),
          title: "Vocabulary Building",
          description: "Interactive vocabulary learning with visual aids"
        }
      ],
      levels: []
    });
    
    storage.createSchool({
      title: "NDASH Platform",
      slug: "ndash",
      description: "Advanced educational platform with personalized support for diverse learning needs.",
      themeColor: "#d97706",
      features: [
        {
          id: uuidv4(),
          title: "Learning Style Assessment",
          description: "Personalized learning based on individual learning styles"
        },
        {
          id: uuidv4(),
          title: "Accessibility Tools",
          description: "Comprehensive accessibility features for diverse needs"
        }
      ],
      levels: []
    });
  }
  
  console.log("CMS methods applied to storage");
}