import { db } from '@/lib/firebase';
import { collection, getDocs, doc } from 'firebase/firestore';

export interface Skill {
  id: string;
  name: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
}

export class SkillsService {
  private static instance: SkillsService;
  private skillsCollection = 'skills';

  private constructor() {}

  public static getInstance(): SkillsService {
    if (!SkillsService.instance) {
      SkillsService.instance = new SkillsService();
    }
    return SkillsService.instance;
  }

  // Fetch all categories (documents in 'skills' collection)
  async getCategories(): Promise<SkillCategory[]> {
    if (!db) throw new Error('Firestore is not initialized');
    const categoriesRef = collection(db, this.skillsCollection);
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || doc.id // Prefer 'name' field, fallback to doc.id
      };
    });
  }

  // Fetch all skills for a category (documents in subcollection under category doc)
  async getSkillsByCategory(categoryId: string): Promise<Skill[]> {
    if (!db) throw new Error('Firestore is not initialized');
    const skillsRef = collection(db, this.skillsCollection, categoryId, categoryId);
    const snapshot = await getDocs(skillsRef);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || doc.id, // Prefer 'name' field, fallback to doc.id
        description: data.description || ''
      };
    });
  }
}

export const skillsService = SkillsService.getInstance(); 