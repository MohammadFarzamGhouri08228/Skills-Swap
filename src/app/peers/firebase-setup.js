// Firebase Collections Setup Script for SkillSwap
// Run this script once to create the required collections and set up security rules

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDK547wdEyC5rDDSO87MPORrEHWNC8ECSw",
  authDomain: "skillswap-cf57c.firebaseapp.com",
  projectId: "skillswap-cf57c",
  storageBucket: "skillswap-cf57c.appspot.com",
  messagingSenderId: "747945090512",
  appId: "1:747945090512:web:acb0385ed6bfe0b09fedd5",
  measurementId: "G-F4GZ68HD6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Setup Firebase Collections for SkillSwap Peers System
 */
async function setupFirebaseCollections() {
  try {
    console.log('Setting up Firebase collections...');

    // 1. Create peerRequests collection structure
    const peerRequestsRef = doc(db, 'peerRequests', 'example_request');
    await setDoc(peerRequestsRef, {
      fromUserId: 'example_user_1',
      toUserId: 'example_user_2',
      status: 'pending', // pending, accepted, declined
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Additional fields for display
      fromUserName: 'John Doe',
      fromUserEmail: 'john@example.com',
      fromUserProfilePicture: 'https://example.com/profile.jpg'
    });

    // 2. Create conversations collection structure
    const conversationsRef = doc(db, 'conversations', 'example_conversation');
    await setDoc(conversationsRef, {
      participants: ['example_user_1', 'example_user_2'],
      participantDetails: {
        'example_user_1': {
          name: 'John Doe',
          email: 'john@example.com',
          profilePicture: 'https://example.com/profile1.jpg'
        },
        'example_user_2': {
          name: 'Jane Smith',
          email: 'jane@example.com',
          profilePicture: 'https://example.com/profile2.jpg'
        }
      },
      lastMessage: {
        text: 'Hello! I\'d love to exchange skills with you.',
        senderId: 'example_user_1',
        senderName: 'John Doe',
        timestamp: serverTimestamp()
      },
      unreadCount: {
        'example_user_1': 0,
        'example_user_2': 1
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 3. Create messages collection structure
    const messagesRef = doc(db, 'messages', 'example_message');
    await setDoc(messagesRef, {
      conversationId: 'example_conversation',
      senderId: 'example_user_1',
      senderName: 'John Doe',
      senderProfilePicture: 'https://example.com/profile1.jpg',
      text: 'Hello! I\'d love to exchange skills with you.',
      timestamp: serverTimestamp(),
      read: false
    });

    // 4. Create userPeers collection to track peer relationships
    const userPeersRef = doc(db, 'userPeers', 'example_user_1');
    await setDoc(userPeersRef, {
      userId: 'example_user_1',
      peers: ['example_user_2'], // Array of accepted peer user IDs
      pendingRequests: {
        sent: ['example_user_3'], // Requests this user sent
        received: ['example_user_4'] // Requests this user received
      },
      updatedAt: serverTimestamp()
    });

    console.log('✅ Firebase collections created successfully!');
    console.log('📋 Collections created:');
    console.log('  - peerRequests: For managing peer connection requests');
    console.log('  - conversations: For chat conversations between peers');
    console.log('  - messages: For individual messages in conversations');
    console.log('  - userPeers: For tracking peer relationships');

    // Clean up example documents
    console.log('🧹 Cleaning up example documents...');
    // Note: You might want to delete these example documents after setup
    // Uncomment the following lines if you want to remove example data:
    /*
    await deleteDoc(doc(db, 'peerRequests', 'example_request'));
    await deleteDoc(doc(db, 'conversations', 'example_conversation'));
    await deleteDoc(doc(db, 'messages', 'example_message'));
    await deleteDoc(doc(db, 'userPeers', 'example_user_1'));
    */

  } catch (error) {
    console.error('❌ Error setting up Firebase collections:', error);
  }
}

/**
 * Firestore Security Rules (Copy these to your Firebase Console > Firestore > Rules)
 */
const securityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Peer requests rules
    match /peerRequests/{requestId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.fromUserId || 
         request.auth.uid == resource.data.toUserId);
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.fromUserId;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.toUserId;
    }
    
    // Conversations rules
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages rules
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
      allow update: if request.auth != null;
    }
    
    // User peers rules
    match /userPeers/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}`;

// Export the setup function and security rules
export { setupFirebaseCollections, securityRules };

// If running this script directly (not as import)
if (typeof window === 'undefined') {
  setupFirebaseCollections();
}

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Run this script once: node firebase-setup.js
 * 2. Copy the security rules above to Firebase Console > Firestore Database > Rules
 * 3. The script will create example documents to establish collection structure
 * 4. You can delete the example documents after setup if desired
 * 
 * COLLECTION STRUCTURES:
 * 
 * peerRequests/{requestId}:
 * - fromUserId: string
 * - toUserId: string  
 * - status: 'pending' | 'accepted' | 'declined'
 * - createdAt: timestamp
 * - updatedAt: timestamp
 * - fromUserName: string
 * - fromUserEmail: string
 * - fromUserProfilePicture: string
 * 
 * conversations/{conversationId}:
 * - participants: string[] (array of user IDs)
 * - participantDetails: object (user details for quick access)
 * - lastMessage: object (last message preview)
 * - unreadCount: object (unread count per user)
 * - createdAt: timestamp
 * - updatedAt: timestamp
 * 
 * messages/{messageId}:
 * - conversationId: string
 * - senderId: string
 * - senderName: string
 * - senderProfilePicture: string
 * - text: string
 * - timestamp: timestamp
 * - read: boolean
 * 
 * userPeers/{userId}:
 * - userId: string
 * - peers: string[] (accepted peer IDs)
 * - pendingRequests.sent: string[] (sent request user IDs)
 * - pendingRequests.received: string[] (received request user IDs)
 * - updatedAt: timestamp
 */