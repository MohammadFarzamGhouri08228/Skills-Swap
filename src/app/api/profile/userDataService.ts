export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  surname: string;
  dob: string;
  gender: string;
  currentBalance: number;
  createdAt: string;
  emailValidated: boolean;
  skills?: string[];
  interests?: string[];
  bio?: string;
  profileImage?: string;
  location?: string;
  phoneNumber?: string;
} 