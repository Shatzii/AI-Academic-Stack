/**
 * CMS Interface Extensions for IStorage
 * 
 * This file extends the IStorage interface with CMS-specific methods.
 */

import { IStorage } from '../storage';
import { 
  School, InsertSchool,
  NeurodivergentSchool, InsertNeurodivergentSchool,
  LawSchool, InsertLawSchool,
  LanguageSchool, InsertLanguageSchool,
  Page, InsertPage,
  AiTeacher, InsertAiTeacher,
  Resource, InsertResource
} from '../../shared/cms-schema';

/**
 * Extends the IStorage interface with CMS-specific methods
 */
export interface ICMSStorage extends IStorage {
  // Schools
  getSchools(): Promise<School[]>;
  getSchoolById(id: number): Promise<School | null>;
  getSchoolBySlug(slug: string): Promise<School | null>;
  getSchoolsByType(type: string): Promise<School[]>;
  createSchool(data: InsertSchool): Promise<School>;
  updateSchool(id: number, data: Partial<InsertSchool>): Promise<School | null>;
  deleteSchool(id: number): Promise<boolean>;
  
  // Neurodivergent Schools
  getNeurodivergentSchools(): Promise<NeurodivergentSchool[]>;
  getNeurodivergentSchoolById(id: number): Promise<NeurodivergentSchool | null>;
  getNeurodivergentSchoolBySchoolId(schoolId: number): Promise<NeurodivergentSchool | null>;
  createNeurodivergentSchool(data: InsertNeurodivergentSchool): Promise<NeurodivergentSchool>;
  updateNeurodivergentSchool(id: number, data: Partial<InsertNeurodivergentSchool>): Promise<NeurodivergentSchool | null>;
  
  // Law Schools
  getLawSchools(): Promise<LawSchool[]>;
  getLawSchoolById(id: number): Promise<LawSchool | null>;
  getLawSchoolBySchoolId(schoolId: number): Promise<LawSchool | null>;
  createLawSchool(data: InsertLawSchool): Promise<LawSchool>;
  updateLawSchool(id: number, data: Partial<InsertLawSchool>): Promise<LawSchool | null>;
  
  // Language Schools
  getLanguageSchools(): Promise<LanguageSchool[]>;
  getLanguageSchoolById(id: number): Promise<LanguageSchool | null>;
  getLanguageSchoolBySchoolId(schoolId: number): Promise<LanguageSchool | null>;
  createLanguageSchool(data: InsertLanguageSchool): Promise<LanguageSchool>;
  updateLanguageSchool(id: number, data: Partial<InsertLanguageSchool>): Promise<LanguageSchool | null>;
  
  // Pages
  getPages(filters?: { schoolId?: number, type?: string }): Promise<Page[]>;
  getPageById(id: number): Promise<Page | null>;
  getPageBySlug(slug: string): Promise<Page | null>;
  createPage(data: InsertPage): Promise<Page>;
  updatePage(id: number, data: Partial<InsertPage>): Promise<Page | null>;
  deletePage(id: number): Promise<boolean>;
  
  // AI Teachers
  getAiTeachers(filters?: { schoolId?: number }): Promise<AiTeacher[]>;
  getAiTeacherById(id: number): Promise<AiTeacher | null>;
  createAiTeacher(data: InsertAiTeacher): Promise<AiTeacher>;
  updateAiTeacher(id: number, data: Partial<InsertAiTeacher>): Promise<AiTeacher | null>;
  deleteAiTeacher(id: number): Promise<boolean>;
  
  // Resources
  getResources(filters?: { schoolId?: number, type?: string, schoolType?: string }): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | null>;
  createResource(data: InsertResource): Promise<Resource>;
  updateResource(id: number, data: Partial<InsertResource>): Promise<Resource | null>;
  deleteResource(id: number): Promise<boolean>;
}