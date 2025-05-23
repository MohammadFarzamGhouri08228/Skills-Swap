import { db } from '@/lib/firebase';
import { collection, getDocs, doc } from 'firebase/firestore';

interface Skill {
  id: string;
  name: string;
}

interface CategoryWithSkills {
  category: string;
  skills: Skill[];
}

// If you cannot call listCollections(), hardcode your known category subcollections
const KNOWN_CATEGORIES = ['Practical & Lifestyle Skills', 'Academic & Intellectual Skills', 'Academic & Research Skills', 'Creative & Communication Skills', 'Language & Culture Skills', 'Leadership & Entrepreneurial Skills' , 'Life & Career Development Skills', 'Personal Growth & Everyday Skills', 'Professional & Leadership Skills', 'Tech & Digital', 'Other']; 

export async function fetchSkills(): Promise<CategoryWithSkills[]> {
  const categories: CategoryWithSkills[] = [];

  if (!db) {
    return [];
  }
  const skillsCollection = collection(db, 'skills');
  const skillDocsSnapshot = await getDocs(skillsCollection);

  if (skillDocsSnapshot.empty) return [];

  for (const category of KNOWN_CATEGORIES) {
    let allSkillsInCategory: Skill[] = [];

    for (const docSnap of skillDocsSnapshot.docs) {
      const categoryCollection = collection(docSnap.ref, category);
      const categorySnapshot = await getDocs(categoryCollection);

      const skills = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data()['Skill Name'] ?? '',
      }));

      allSkillsInCategory = allSkillsInCategory.concat(skills);
    }

    if (allSkillsInCategory.length > 0) {
      categories.push({ category, skills: allSkillsInCategory });
    }
  }

  return categories;
}
