import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  setDoc,
  writeBatch
} from 'firebase/firestore';

export type MessageType = 'text' | 'image' | 'document' | 'voice';

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp | null;
  read: boolean;
  type: MessageType;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
    duration?: number; // for voice messages
    thumbnailUrl?: string; // for images
  };
}

export interface ChatThread {
  id?: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: Timestamp;
    senderId: string;
    type: MessageType;
  };
  updatedAt: Timestamp | null;
  createdAt: Timestamp | null;
  unreadCount?: {
    [userId: string]: number;
  };
}

export interface UserPresence {
  online: boolean;
  lastSeen: Timestamp | null;
  typing?: {
    threadId: string;
    timestamp: Timestamp;
  } | null;
}

class MessageService {
  private static instance: MessageService;
  private readonly messagesCollection = 'messages';
  private readonly chatThreadsCollection = 'chatThreads';
  private readonly userPresenceCollection = 'presence';

  private constructor() {}

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  // User presence methods
  async updateUserPresence(userId: string, online: boolean): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const presenceRef = doc(db, this.userPresenceCollection, userId);
    await setDoc(presenceRef, {
      online,
      lastSeen: online ? serverTimestamp() : Timestamp.now(),
    }, { merge: true });
  }

  subscribeToUserPresence(userId: string, callback: (presence: UserPresence) => void): () => void {
    if (!db) throw new Error('Firestore is not initialized');

    const presenceRef = doc(db, this.userPresenceCollection, userId);
    return onSnapshot(presenceRef, (doc) => {
      callback(doc.data() as UserPresence);
    });
  }

  async setTypingStatus(userId: string, threadId: string | null): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const presenceRef = doc(db, this.userPresenceCollection, userId);
    await updateDoc(presenceRef, {
      typing: threadId ? {
        threadId,
        timestamp: serverTimestamp()
      } : null
    });
  }

  async createChatThread(participants: string[]): Promise<string> {
    if (!db) throw new Error('Firestore is not initialized');

    const threadData: ChatThread = {
      participants,
      updatedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      unreadCount: Object.fromEntries(participants.map(p => [p, 0]))
    };

    const threadRef = await addDoc(collection(db, this.chatThreadsCollection), threadData);
    return threadRef.id;
  }

  async sendMessage(threadId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<string> {
    if (!db) throw new Error('Firestore is not initialized');

    const messageData = {
      ...message,
      timestamp: serverTimestamp(),
    };

    // Add message to the messages subcollection of the thread
    const messageRef = await addDoc(
      collection(db, this.chatThreadsCollection, threadId, this.messagesCollection),
      messageData
    );

    // Get the thread to update unread count
    const threadRef = doc(db, this.chatThreadsCollection, threadId);
    const threadDoc = await getDoc(threadRef);
    const threadData = threadDoc.data() as ChatThread;

    // Update the thread's last message and unread count
    const updates: any = {
      lastMessage: {
        content: message.content,
        timestamp: serverTimestamp(),
        senderId: message.senderId,
        type: message.type
      },
      updatedAt: serverTimestamp(),
    };

    // Increment unread count for the receiver
    if (!threadData.unreadCount) {
      updates.unreadCount = { [message.receiverId]: 1 };
    } else {
      updates.unreadCount = {
        ...threadData.unreadCount,
        [message.receiverId]: (threadData.unreadCount[message.receiverId] || 0) + 1
      };
    }

    await updateDoc(threadRef, updates);

    return messageRef.id;
  }

  async markThreadAsRead(threadId: string, userId: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const threadRef = doc(db, this.chatThreadsCollection, threadId);
    await updateDoc(threadRef, {
      [`unreadCount.${userId}`]: 0
    });

    // Mark all messages as read
    const messagesRef = collection(db, this.chatThreadsCollection, threadId, this.messagesCollection);
    const q = query(messagesRef, where('receiverId', '==', userId), where('read', '==', false));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
  }

  async getMessages(threadId: string): Promise<Message[]> {
    if (!db) throw new Error('Firestore is not initialized');

    const messagesRef = collection(db, this.chatThreadsCollection, threadId, this.messagesCollection);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  }

  async getUserThreads(userId: string): Promise<ChatThread[]> {
    if (!db) throw new Error('Firestore is not initialized');

    const threadsRef = collection(db, this.chatThreadsCollection);
    const q = query(
      threadsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatThread));
  }

  subscribeToMessages(threadId: string, callback: (messages: Message[]) => void): () => void {
    if (!db) throw new Error('Firestore is not initialized');

    const messagesRef = collection(db, this.chatThreadsCollection, threadId, this.messagesCollection);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      callback(messages);
    });
  }

  subscribeToUserThreads(userId: string, callback: (threads: ChatThread[]) => void): () => void {
    if (!db) throw new Error('Firestore is not initialized');

    const threadsRef = collection(db, this.chatThreadsCollection);
    const q = query(
      threadsRef,
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const threads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatThread));
      callback(threads);
    });
  }

  async markMessageAsRead(threadId: string, messageId: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const messageRef = doc(db, this.chatThreadsCollection, threadId, this.messagesCollection, messageId);
    await updateDoc(messageRef, {
      read: true
    });
  }
}

export const messageService = MessageService.getInstance(); 