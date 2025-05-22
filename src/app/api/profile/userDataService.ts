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

  async verifyUser(uid: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const userRef = doc(db, this.usersCollection, uid);
    await updateDoc(userRef, {
      isVerified: true
    });
  }
}

export const userDataService = UserDataService.getInstance(); 