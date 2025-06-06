import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  surname: string;
  dob: string;
  gender: string;
  createdAt: string;
  currentBalance?: number;
  emailValidated?: boolean;
  skills?: string[];
  interests?: string[];
  bio?: string;
  profilePicture?: string;
  location?: string;
  phoneNumber?: string;
  lastLogin?: string;
  isVerified?: boolean;
  displayName?: string;
}

export class UserDataService {
  private static instance: UserDataService;
  private readonly usersCollection = 'users';

  private constructor() {}

  public static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  async createUser(userData: UserData): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, userData.uid);
    await setDoc(userRef, userData);
  }

  async getUser(uid: string): Promise<UserData | null> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserData;
    }
    return null;
  }

  async updateUser(uid: string, data: Partial<UserData>): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, data);
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const usersRef = collection(db, this.usersCollection);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserData;
    }
    return null;
  }

  async updateLastLogin(uid: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      lastLogin: new Date().toISOString()
    });
  }

  async updateProfilePicture(uid: string, pictureUrl: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      profilePicture: pictureUrl
    });
  }

  async updateSkills(uid: string, skills: string[]): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      skills
    });
  }

  async updateBio(uid: string, bio: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      bio
    });
  }

  async updateLocation(uid: string, location: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      location
    });
  }

  async updatePhoneNumber(uid: string, phoneNumber: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      phoneNumber
    });
  }

  async getAllUsers(searchQuery?: string): Promise<UserData[]> {
    if (!db) {
      const error = new Error('Firestore is not initialized');
      console.error(error);
      throw error;
    }
    
    try {
      console.log('Starting to fetch users from Firestore collection:', this.usersCollection);
      const usersRef = collection(db, this.usersCollection);
      
      // Log the query parameters
      console.log('Fetching all users without filters');
      const querySnapshot = await getDocs(usersRef);
      
      console.log('Raw query response:', querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      
      let users = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email || '',
          firstName: data.firstName || '',
          surname: data.surname || '',
          dob: data.dob || '',
          gender: data.gender || '',
          createdAt: data.createdAt || '',
          skills: data.skills || [],
          location: data.location || '',
          profilePicture: data.profilePicture || '',
          isVerified: data.isVerified || false,
        } as UserData;
      });

      console.log('Processed users:', users);

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        console.log('Filtering users with search query:', searchLower);
        
        users = users.filter(user => {
          const fullName = `${user.firstName} ${user.surname}`.toLowerCase();
          const skills = user.skills?.join(' ').toLowerCase() || '';
          const location = user.location?.toLowerCase() || '';
          const email = user.email.toLowerCase();
          
          const matches = fullName.includes(searchLower) || 
                         skills.includes(searchLower) ||
                         location.includes(searchLower) ||
                         email.includes(searchLower);
          
          if (matches) {
            console.log('Found matching user:', user);
          }
          
          return matches;
        });
      }

      console.log(`Returning ${users.length} users`);
      return users;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  async verifyUser(uid: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      isVerified: true
    });
  }
}

export const userDataService = UserDataService.getInstance(); 