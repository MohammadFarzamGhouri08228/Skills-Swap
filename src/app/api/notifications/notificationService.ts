import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  writeBatch,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';

export interface Notification {
  id: string;
  userId: string;
  type: 'peer_request' | 'peer_accepted' | 'peer_rejected';
  message: string;
  fromUserId?: string;
  fromUser?: {
    firstName: string;
    surname: string;
    profilePicture?: string;
  };
  createdAt: Timestamp;
  read: boolean;
}

class NotificationService {
  private readonly collectionName = 'notifications';

  private getCollection(): CollectionReference {
    if (!db) {
      throw new Error('Firestore is not initialized');
    }
    return collection(db, this.collectionName);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const notificationsRef = this.getCollection();
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    try {
      const notificationsRef = this.getCollection();
      await addDoc(notificationsRef, {
        ...notification,
        createdAt: Timestamp.now(),
        read: false,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const notificationRef = doc(db, this.collectionName, notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      const notificationsRef = this.getCollection();
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService(); 