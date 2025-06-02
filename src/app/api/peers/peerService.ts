import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

export interface PeerRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  message?: string;
}

export interface Peer {
  userId: string;
  displayName: string;
  skills: string[];
  rating: number;
  profilePicture?: string;
}

class PeerService {
  private peerRequestsCollection = 'peerRequests';
  private usersCollection = 'users';

  // Send a peer request
  async sendPeerRequest(senderId: string, receiverId: string, message?: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    // Check if a request already exists
    const existingRequest = await this.getExistingRequest(senderId, receiverId);
    if (existingRequest) {
      throw new Error('A peer request already exists between these users');
    }

    // Create new request
    const requestRef = doc(collection(db, this.peerRequestsCollection));
    const requestData: Omit<PeerRequest, 'id'> = {
      senderId,
      receiverId,
      status: 'pending',
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      message
    };

    await setDoc(requestRef, requestData);
  }

  // Get existing request between two users
  private async getExistingRequest(senderId: string, receiverId: string): Promise<PeerRequest | null> {
    if (!db) throw new Error('Firestore is not initialized');
    
    const requestsRef = collection(db, this.peerRequestsCollection);
    const q = query(
      requestsRef,
      where('senderId', 'in', [senderId, receiverId]),
      where('receiverId', 'in', [senderId, receiverId])
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as PeerRequest;
  }

  // Accept a peer request
  async acceptPeerRequest(requestId: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const requestRef = doc(db, this.peerRequestsCollection, requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      throw new Error('Peer request not found');
    }

    const request = requestDoc.data() as PeerRequest;
    
    // Update request status
    await updateDoc(requestRef, {
      status: 'accepted',
      updatedAt: serverTimestamp()
    });

    // Add each user to the other's peers list
    const senderRef = doc(db, this.usersCollection, request.senderId);
    const receiverRef = doc(db, this.usersCollection, request.receiverId);

    await updateDoc(senderRef, {
      peers: arrayUnion(request.receiverId)
    });

    await updateDoc(receiverRef, {
      peers: arrayUnion(request.senderId)
    });
  }

  // Reject a peer request
  async rejectPeerRequest(requestId: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const requestRef = doc(db, this.peerRequestsCollection, requestId);
    await updateDoc(requestRef, {
      status: 'rejected',
      updatedAt: serverTimestamp()
    });
  }

  // Get all peer requests for a user
  async getUserPeerRequests(userId: string): Promise<PeerRequest[]> {
    if (!db) throw new Error('Firestore is not initialized');

    const requestsRef = collection(db, this.peerRequestsCollection);
    const q = query(
      requestsRef,
      where('receiverId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PeerRequest));
  }

  // Get all peers for a user
  async getUserPeers(userId: string): Promise<Peer[]> {
    if (!db) throw new Error('Firestore is not initialized');

    const userRef = doc(db, this.usersCollection, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const peerIds = userData.peers || [];

    if (peerIds.length === 0) return [];

    const peers: Peer[] = [];
    for (const peerId of peerIds) {
      const peerDoc = await getDoc(doc(db, this.usersCollection, peerId));
      if (peerDoc.exists()) {
        const peerData = peerDoc.data();
        peers.push({
          userId: peerId,
          displayName: `${peerData.firstName} ${peerData.surname}`,
          skills: peerData.skillsOffered || [],
          rating: peerData.rating || 0,
          profilePicture: peerData.profilePicture
        });
      }
    }

    return peers;
  }

  // Remove a peer
  async removePeer(userId: string, peerId: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');

    const userRef = doc(db, this.usersCollection, userId);
    const peerRef = doc(db, this.usersCollection, peerId);

    // Remove from both users' peer lists
    await updateDoc(userRef, {
      peers: arrayRemove(peerId)
    });

    await updateDoc(peerRef, {
      peers: arrayRemove(userId)
    });

    // Delete any existing peer requests between these users
    const existingRequest = await this.getExistingRequest(userId, peerId);
    if (existingRequest) {
      await deleteDoc(doc(db, this.peerRequestsCollection, existingRequest.id));
    }
  }
}

export const peerService = new PeerService(); 