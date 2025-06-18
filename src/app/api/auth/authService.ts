import { auth, provider } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInWithPopup,
  UserCredential,
  User
} from 'firebase/auth';
import { userDataService } from '../profile/userDataService';
import { UserData } from '../profile/userDataService';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signUp(email: string, password: string, userData: Omit<UserData, 'uid' | 'email' | 'currentBalance' | 'createdAt' | 'emailValidated'>): Promise<User> {
    if (!auth) throw new Error('Firebase Auth is not initialized');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user data in Firestore
      await userDataService.createUser({
        uid: user.uid,
        email: user.email!,
        currentBalance: 0,
        createdAt: new Date().toISOString(),
        emailValidated: false,
        ...userData
      });

      return user;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    if (!auth) throw new Error('Firebase Auth is not initialized');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await userDataService.updateLastLogin(user.uid);

      return user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signInWithGoogle(): Promise<User> {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    if (!provider) throw new Error('Google Auth Provider is not initialized');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const existingUser = await userDataService.getUser(user.uid);
      
      if (!existingUser) {
        // Create new user data if it doesn't exist
        await userDataService.createUser({
          uid: user.uid,
          email: user.email!,
          firstName: user.displayName?.split(' ')[0] || '',
          surname: user.displayName?.split(' ').slice(1).join(' ') || '',
          dob: '',
          gender: '',
          currentBalance: 0,
          createdAt: new Date().toISOString(),
          emailValidated: user.emailVerified,
          profilePicture: user.photoURL || undefined,
          skillsOffered: [],
          skillsWanted: []
        });
      } else {
        // Update last login
        await userDataService.updateLastLogin(user.uid);
      }

      return user;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signOut(): Promise<void> {
    if (!auth) throw new Error('Firebase Auth is not initialized');

    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  getCurrentUser(): User | null {
    if (!auth) throw new Error('Firebase Auth is not initialized');
    return auth.currentUser;
  }

  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/popup-closed-by-user': 'Sign-in popup was closed before completing the sign-in',
      'auth/cancelled-popup-request': 'Sign-in popup was cancelled',
      'auth/popup-blocked': 'Sign-in popup was blocked by the browser',
      'auth/network-request-failed': 'Network error. Please check your connection'
    };

    return errorMessages[errorCode] || 'An error occurred during authentication';
  }
}

export const authService = AuthService.getInstance(); 