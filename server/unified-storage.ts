// Simplified storage interface
interface SchoolData {
  id: string;
  name: string;
  theme: string;
  description: string;
  features: string[];
  isActive: boolean;
}

export interface UnifiedStorage {
  getAllSchools(): Promise<SchoolData[]>;
  getSchool(id: string): Promise<SchoolData | undefined>;
}

class SimplifiedStorage implements UnifiedStorage {
  private schoolData: SchoolData[] = [
    {
      id: 'primary-school',
      name: 'Primary School',
      theme: 'superhero',
      description: 'Superhero-themed K-6 education tailored for young neurodivergent minds.',
      features: ['Interactive Stories', 'Visual Learning', 'Adaptive Pace'],
      isActive: true
    },
    {
      id: 'secondary-school',
      name: 'Secondary School',
      theme: 'mature',
      description: 'Grades 7-12 with mature themes designed for adolescent learners.',
      features: ['Project-Based', 'Self-Paced', 'Career Focused'],
      isActive: true
    },
    {
      id: 'lawyer-makers',
      name: 'Law School',
      theme: 'professional',
      description: 'College-level legal education designed for neurodivergent students.',
      features: ['Case Studies', 'Simulations', 'Legal Writing'],
      isActive: true
    },
    {
      id: 'language-school',
      name: 'Language School',
      theme: 'global',
      description: 'Multilingual education in English, German, and Spanish.',
      features: ['Conversation', 'Cultural Context', 'Practical Usage'],
      isActive: true
    }
  ];

  async getAllSchools(): Promise<SchoolData[]> {
    return this.schoolData.filter(school => school.isActive);
  }

  async getSchool(id: string): Promise<SchoolData | undefined> {
    return this.schoolData.find(school => school.id === id && school.isActive);
  }
}

export const storage = new SimplifiedStorage();