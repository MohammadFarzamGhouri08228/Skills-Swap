'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
// Assuming Card, Button, Badge, Avatar, Input, toast are from shadcn/ui or similar,
// their base styles will be respected and enhanced with Tailwind.
import { Card } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  UserPlus, 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Users,
  Clock,
  Check,
  CheckCheck,
  Filter,
  SlidersHorizontal,
  ChevronDown, // For potential dropdowns or accordions
  ChevronUp,   // For potential dropdowns or accordions
  AlertTriangle // For empty states or warnings
} from 'lucide-react';
import { userDataService, UserData } from '@/app/api/profile/userDataService'; // Ensure this path is correct
import Wrapper from '@/layouts/Wrapper'; // Ensure this path is correct
import { auth } from '@/lib/firebase'; // Ensure this path is correct
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast'; // Ensure this path is correct
import { 
  initializeApp,
  getApps,
  getApp
} from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  limit,
  addDoc
} from 'firebase/firestore';
import HeaderOne from '@/layouts/headers/HeaderOne'; // Ensure this path is correct
import FooterOne from '@/layouts/footers/FooterOne'; // Ensure this path is correct

// Firebase Configuration (Ensure your keys are handled securely, e.g., via environment variables)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual Firebase config
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Color Palette (for reference, used in Tailwind classes)
// #5B21B6 Bright Purple
// #2E1065 Deep Midnight Purple
// #FFD23F Yellow
// #FF914D Orange
// #FF686B Coral

// Types
interface PeerRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: any; // Consider using Firestore Timestamp type
  fromUserName: string;
  fromUserEmail: string;
  fromUserProfilePicture: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderProfilePicture: string;
  text: string;
  timestamp: any; // Consider using Firestore Timestamp type
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  participantDetails: any; // Define more specific type if possible
  lastMessage: any; // Define more specific type if possible
  unreadCount: any; // Define more specific type if possible
  updatedAt: any; // Consider using Firestore Timestamp type
}

interface ChatPanel {
  isOpen: boolean;
  isMinimized: boolean;
  peer: UserData | null;
  conversationId: string | null;
}

export default function ModernPeersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'peers' | 'requests'>('all');
  
  const [peerRequests, setPeerRequests] = useState<PeerRequest[]>([]);
  const [userPeers, setUserPeers] = useState<string[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);
  
  const [chatPanel, setChatPanel] = useState<ChatPanel>({
    isOpen: false,
    isMinimized: false,
    peer: null,
    conversationId: null
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{[key: string]: number}>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Auth effect
  useEffect(() => {
    if (!auth) {
      // router.push('/login'); // Consider redirecting or showing an error
      console.error("Firebase auth is not initialized.");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        try {
          const userData = await userDataService.getUser(user.uid);
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error fetching current user data:", error);
          toast({
            title: "Error",
            description: "Could not load your profile data.",
            variant: "destructive",
          });
        }
      } else {
        // router.push('/login'); // Consider redirecting
        setCurrentUserId(null);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch users and setup real-time listeners
  useEffect(() => {
    if (!currentUserId) {
      setIsLoading(false); // Not loading if no user
      return;
    }

    const setupData = async () => {
      setIsLoading(true);
      try {
        const allUsers = await userDataService.getAllUsers();
        setUsers(allUsers.filter(u => u.uid !== currentUserId)); // Filter out current user from the main list
        
        // Initial filter application
        applyFilter(activeFilter, allUsers.filter(u => u.uid !== currentUserId));


        // Setup real-time listeners
        const unsubPeerRequests = setupPeerRequestsListener();
        const unsubUserPeers = setupUserPeersListener();
        const unsubConversations = setupConversationsListener();
        
        return () => { // Cleanup listeners
          if (unsubPeerRequests) unsubPeerRequests();
          if (unsubUserPeers) unsubUserPeers();
          if (unsubConversations) unsubConversations();
        };
      } catch (error) {
        console.error('Error setting up data:', error);
        toast({
          title: "Error",
          description: "Failed to load peers data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]); // Rerun if currentUserId changes

  // Real-time listeners
  const setupPeerRequestsListener = () => {
    if (!currentUserId) return;
    const q = query(
      collection(db, 'peerRequests'),
      where('toUserId', '==', currentUserId),
      where('status', '==', 'pending')
    );
    return onSnapshot(q, (snapshot) => {
      const requests: PeerRequest[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PeerRequest));
      setPeerRequests(requests);
    }, (error) => {
      console.error("Error listening to peer requests:", error);
      toast({ title: "Real-time Error", description: "Could not update peer requests.", variant: "destructive"});
    });
  };

  const setupUserPeersListener = () => {
    if (!currentUserId) return;
    const userPeersRef = doc(db, 'userPeers', currentUserId);
    return onSnapshot(userPeersRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserPeers(data.peers || []);
        setSentRequests(data.pendingRequests?.sent || []);
        setReceivedRequests(data.pendingRequests?.received || []);
      } else { // Ensure states are reset if doc doesn't exist or user has no peer data
        setUserPeers([]);
        setSentRequests([]);
        setReceivedRequests([]);
      }
    }, (error) => {
      console.error("Error listening to user peers:", error);
      toast({ title: "Real-time Error", description: "Could not update your peer connections.", variant: "destructive"});
    });
  };

  const setupConversationsListener = () => {
    if (!currentUserId) return;
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', currentUserId),
      orderBy('updatedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const convs: Conversation[] = [];
      const newUnreadCounts: {[key: string]: number} = {};
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() } as Conversation;
        convs.push(data);
        newUnreadCounts[doc.id] = data.unreadCount?.[currentUserId] || 0;
      });
      setConversations(convs);
      setUnreadCounts(newUnreadCounts);
    }, (error) => {
      console.error("Error listening to conversations:", error);
      toast({ title: "Real-time Error", description: "Could not update messages.", variant: "destructive"});
    });
  };

  // Peer request functions
  const sendPeerRequest = async (toUserId: string) => {
    if (!currentUserId || !currentUser) {
      toast({ title: "Action Failed", description: "You must be logged in to send peer requests.", variant: "destructive"});
      return;
    }
    try {
      const requestId = `${currentUserId}_${toUserId}`; // Simple ID, ensure uniqueness if needed
      await setDoc(doc(db, 'peerRequests', requestId), {
        fromUserId: currentUserId,
        toUserId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        fromUserName: `${currentUser.firstName} ${currentUser.surname}`,
        fromUserEmail: currentUser.email,
        fromUserProfilePicture: currentUser.profilePicture || ''
      });

      const userPeersRef = doc(db, 'userPeers', currentUserId);
      const recipientPeersRef = doc(db, 'userPeers', toUserId);

      // Update current user's sent requests
      const userPeersDoc = await getDoc(userPeersRef);
      if (userPeersDoc.exists()) {
        await updateDoc(userPeersRef, { 'pendingRequests.sent': arrayUnion(toUserId), updatedAt: serverTimestamp() });
      } else {
        await setDoc(userPeersRef, { userId: currentUserId, peers: [], pendingRequests: { sent: [toUserId], received: [] }, updatedAt: serverTimestamp() });
      }

      // Update recipient's received requests
      const recipientDoc = await getDoc(recipientPeersRef);
      if (recipientDoc.exists()) {
        await updateDoc(recipientPeersRef, { 'pendingRequests.received': arrayUnion(currentUserId), updatedAt: serverTimestamp() });
      } else {
        await setDoc(recipientPeersRef, { userId: toUserId, peers: [], pendingRequests: { sent: [], received: [currentUserId] }, updatedAt: serverTimestamp() });
      }

      toast({ title: "Peer Request Sent!", description: "Your peer request has been sent successfully." });
    } catch (error) {
      console.error('Error sending peer request:', error);
      toast({ title: "Error", description: "Failed to send peer request. Please try again.", variant: "destructive" });
    }
  };

  const handlePeerRequest = async (requestId: string, status: 'accepted' | 'declined') => {
    if(!currentUserId) return;
    try {
      const requestRef = doc(db, 'peerRequests', requestId);
      const request = peerRequests.find(r => r.id === requestId);
      if (!request) throw new Error("Request not found");

      await updateDoc(requestRef, { status, updatedAt: serverTimestamp() });

      const currentUserPeersRef = doc(db, 'userPeers', currentUserId);
      const fromUserPeersRef = doc(db, 'userPeers', request.fromUserId);

      if (status === 'accepted') {
        await updateDoc(currentUserPeersRef, { peers: arrayUnion(request.fromUserId), 'pendingRequests.received': arrayRemove(request.fromUserId), updatedAt: serverTimestamp() });
        await updateDoc(fromUserPeersRef, { peers: arrayUnion(currentUserId), 'pendingRequests.sent': arrayRemove(currentUserId), updatedAt: serverTimestamp() });
        toast({ title: "Peer Request Accepted!", description: "You are now connected as peers." });
      } else {
        await updateDoc(currentUserPeersRef, { 'pendingRequests.received': arrayRemove(request.fromUserId), updatedAt: serverTimestamp() });
        await updateDoc(fromUserPeersRef, { 'pendingRequests.sent': arrayRemove(currentUserId), updatedAt: serverTimestamp() });
        toast({ title: "Peer Request Declined", description: "The peer request has been declined." });
      }
       // Optimistically update UI or rely on listener
       setPeerRequests(prev => prev.filter(r => r.id !== requestId));

    } catch (error) {
      console.error('Error handling peer request:', error);
      toast({ title: "Error", description: "Failed to handle peer request. Please try again.", variant: "destructive" });
    }
  };

  // Messaging functions
  const openChat = async (peer: UserData) => {
    if (!currentUserId || !currentUser) return;
    try {
      const participants = [currentUserId, peer.uid].sort();
      const conversationId = `${participants[0]}_${participants[1]}`;
      
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        await setDoc(conversationRef, {
          participants,
          participantDetails: {
            [currentUserId]: { name: `${currentUser.firstName} ${currentUser.surname}`, email: currentUser.email, profilePicture: currentUser.profilePicture || '' },
            [peer.uid]: { name: `${peer.firstName} ${peer.surname}`, email: peer.email, profilePicture: peer.profilePicture || '' }
          },
          lastMessage: null,
          unreadCount: { [currentUserId]: 0, [peer.uid]: 0 },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setChatPanel({ isOpen: true, isMinimized: false, peer, conversationId });
      setupMessagesListener(conversationId); // Ensure this returns a cleanup function if needed
      markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error opening chat:', error);
      toast({ title: "Error", description: "Failed to open chat. Please try again.", variant: "destructive" });
    }
  };

  const setupMessagesListener = (conversationId: string) => {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc'),
      limit(100) // Load last 100 messages
    );
    return onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
      console.error("Error listening to messages:", error);
      toast({ title: "Real-time Error", description: "Could not update chat messages.", variant: "destructive"});
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatPanel.conversationId || !currentUserId || !currentUser || !chatPanel.peer) return;
    try {
      const messageData = {
        conversationId: chatPanel.conversationId,
        senderId: currentUserId,
        senderName: `${currentUser.firstName} ${currentUser.surname}`,
        senderProfilePicture: currentUser.profilePicture || '',
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false // Will be true for sender, receiver updates on open
      };
      await addDoc(collection(db, 'messages'), messageData); // Use addDoc for auto-ID

      const otherUserId = chatPanel.peer.uid;
      const currentUnread = unreadCounts[chatPanel.conversationId] || 0; // Get current unread for the other user

      await updateDoc(doc(db, 'conversations', chatPanel.conversationId), {
        lastMessage: { text: newMessage.trim(), senderId: currentUserId, senderName: `${currentUser.firstName} ${currentUser.surname}`, timestamp: serverTimestamp() },
        [`unreadCount.${otherUserId}`]: currentUnread + 1, // Increment for the other user
        updatedAt: serverTimestamp()
      });
      setNewMessage('');
      chatInputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!currentUserId || !conversationId) return;
    try {
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`unreadCount.${currentUserId}`]: 0,
        // updatedAt: serverTimestamp() // Optionally update timestamp
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      // No toast for this, as it's a background action
    }
  };

  // Search and filter functions
  const getBaseFilteredUsers = (sourceUsers: UserData[], filter: 'all' | 'peers' | 'requests') => {
    switch (filter) {
      case 'peers':
        return sourceUsers.filter(user => userPeers.includes(user.uid));
      case 'requests':
        // Show users who sent requests TO ME
        return sourceUsers.filter(user => peerRequests.some(req => req.fromUserId === user.uid));
      default: // 'all'
        return sourceUsers.filter(user => user.uid !== currentUserId);
    }
  };
  
  const applyFilter = (filter: 'all' | 'peers' | 'requests', sourceUsersList = users) => {
    setActiveFilter(filter);
    let currentFilteredUsers = getBaseFilteredUsers(sourceUsersList, filter);
  
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      currentFilteredUsers = currentFilteredUsers.filter(user => {
        const fullName = `${user.firstName} ${user.surname}`.toLowerCase();
        const skills = user.skills?.join(' ').toLowerCase() || '';
        const location = user.location?.toLowerCase() || '';
        const email = user.email.toLowerCase();
        return fullName.includes(searchLower) || skills.includes(searchLower) || location.includes(searchLower) || email.includes(searchLower);
      });
    }
    setFilteredUsers(currentFilteredUsers);
  };

  useEffect(() => {
    applyFilter(activeFilter, users);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, users, activeFilter, userPeers, peerRequests]);


  const getUserStatus = (user: UserData) => {
    if (userPeers.includes(user.uid)) return 'peer';
    if (sentRequests.includes(user.uid)) return 'sent';
    // Check if this user has sent a request TO ME that is still pending
    if (peerRequests.some(req => req.fromUserId === user.uid && req.status === 'pending')) return 'received';
    return 'none';
  };

  const getTotalUnreadCount = () => {
    if (!currentUserId) return 0;
    return conversations.reduce((sum, conv) => sum + (conv.unreadCount?.[currentUserId] || 0), 0);
  };


  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFD23F] to-[#FF914D]">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5B21B6] border-t-transparent mx-auto mb-4"></div>
            <p className="text-[#2E1065] font-semibold text-lg">Loading SkillSwappers...</p>
            <p className="text-[#5B21B6]/80 text-sm">Connecting you with the community.</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      <HeaderOne /> {/* Ensure HeaderOne is styled appropriately */}
      <Wrapper>
        {/* Main page background gradient */}
        <div className="min-h-screen selection:bg-[#5B21B6] selection:text-white" style={{ background: 'linear-gradient(to bottom right, #2E1065, #5B21B6, #FF914D, #FF686B)' }}>
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            
            {/* Header Section with Search and Filters */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-[#5B21B6] to-[#2E1065] p-3.5 rounded-xl shadow-lg">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2E1065]">SkillSwap Peers</h1>
                      <p className="text-[#5B21B6]/80 text-sm sm:text-base">Connect, collaborate, and grow together.</p>
                    </div>
                  </div>
                  
                  {getTotalUnreadCount() > 0 && (
                    <Badge variant="destructive" className="bg-[#FF686B] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shrink-0">
                      {getTotalUnreadCount()} New Messages
                    </Badge>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5B21B6]/70" />
                  <Input
                    type="text"
                    placeholder="Search peers by name, skills, location..."
                    className="pl-12 pr-4 py-3 w-full rounded-xl border-2 border-[#5B21B6]/30 focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/30 bg-white/80 backdrop-blur text-[#2E1065] placeholder-[#5B21B6]/70 transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['all', 'peers', 'requests'] as const).map(filterKey => {
                    const counts = {
                        all: users.filter(u => u.uid !== currentUserId).length,
                        peers: userPeers.length,
                        requests: peerRequests.length
                    };
                    const label = {
                        all: 'All Users',
                        peers: 'My Peers',
                        requests: 'Requests'
                    };
                    return (
                      <Button
                        key={filterKey}
                        variant={activeFilter === filterKey ? 'default' : 'outline'}
                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 relative group
                          ${activeFilter === filterKey 
                            ? 'bg-gradient-to-r from-[#5B21B6] to-[#2E1065] text-white shadow-lg hover:opacity-90' 
                            : 'border-[#5B21B6]/50 text-[#5B21B6] hover:bg-[#5B21B6]/10 hover:border-[#5B21B6] hover:text-[#2E1065]'
                          }`}
                        onClick={() => applyFilter(filterKey)}
                      >
                        {label[filterKey]} ({counts[filterKey]})
                        {filterKey === 'requests' && peerRequests.length > 0 && (
                          <div className="absolute -top-2 -right-2 bg-[#FF686B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                            {peerRequests.length}
                          </div>
                        )}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-[#5B21B6]/70 text-sm">
                  Displaying {filteredUsers.length} {activeFilter === 'all' ? 'potential peers' : activeFilter}.
                </p>
              </div>
            </div>

            {/* Peer Requests Section - only shown when 'requests' filter is active */}
            {activeFilter === 'requests' && peerRequests.length > 0 && (
              <div className="max-w-5xl mx-auto mb-10">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30">
                  <h2 className="text-2xl font-bold text-[#2E1065] mb-5 flex items-center">
                    <Clock className="h-6 w-6 mr-3 text-[#FF914D]" />
                    Pending Peer Requests
                  </h2>
                  <div className="space-y-4">
                    {peerRequests.map((request) => (
                      <div key={request.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-[#FFD23F]/10 to-[#FF914D]/5 rounded-xl border border-[#FFD23F]/40 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                          <Avatar className="h-14 w-14 border-2 border-[#5B21B6]/50 shadow-sm">
                            <AvatarImage src={request.fromUserProfilePicture} alt={request.fromUserName} />
                            <AvatarFallback className="bg-gradient-to-br from-[#5B21B6]/20 to-[#2E1065]/20 text-[#2E1065] font-semibold">
                              {request.fromUserName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg text-[#2E1065]">{request.fromUserName}</p>
                            <p className="text-sm text-[#5B21B6]/80">{request.fromUserEmail}</p>
                            <p className="text-xs text-[#FF914D]/90 mt-0.5">
                              Received: {request.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-3 shrink-0">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#FF914D] to-[#FF686B] hover:opacity-90 text-white rounded-lg shadow-md px-4 py-2 transition-opacity duration-300"
                            onClick={() => handlePeerRequest(request.id, 'accepted')}
                          >
                            <Check className="h-4 w-4 mr-1.5" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#FF686B]/70 text-[#FF686B] hover:bg-[#FF686B]/10 hover:border-[#FF686B] rounded-lg shadow-sm px-4 py-2 transition-all duration-300"
                            onClick={() => handlePeerRequest(request.id, 'declined')}
                          >
                            <X className="h-4 w-4 mr-1.5" /> Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Peers Grid or Empty State */}
            <div className="max-w-5xl mx-auto">
              {filteredUsers.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredUsers.map((user) => {
                    const status = getUserStatus(user);
                    const relevantConversation = conversations.find(c => c.participants.includes(user.uid));
                    const hasUnread = relevantConversation && unreadCounts[relevantConversation.id] > 0;

                    return (
                      <Card 
                        key={user.uid} 
                        className="group p-6 hover:shadow-2xl transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl hover:scale-[1.03] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="relative shrink-0">
                              <Avatar className="h-20 w-20 border-3 border-white shadow-lg ring-2 ring-[#5B21B6]/30">
                                <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.surname}`} />
                                <AvatarFallback className="bg-gradient-to-br from-[#5B21B6] to-[#2E1065] text-white font-bold text-2xl">
                                  {user.firstName?.[0]?.toUpperCase()}{user.surname?.[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {hasUnread && relevantConversation && (
                                <div className="absolute -top-1 -right-1 bg-[#FF686B] text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-solid animate-pulse">
                                  {unreadCounts[relevantConversation.id]}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h2 className="text-xl font-bold text-[#2E1065] truncate" title={`${user.firstName} ${user.surname}`}>
                                  {user.firstName} {user.surname}
                                </h2>
                                {user.isVerified && (
                                  <Star className="h-5 w-5 text-[#FFD23F] fill-[#FFD23F] shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-[#5B21B6]/90 font-medium truncate" title={user.email}>{user.email}</p>
                              {user.location && (
                                <p className="text-xs text-[#FF914D] mt-1 truncate" title={user.location}>{user.location}</p>
                              )}
                            </div>
                          </div>
                          
                          {user.skills && user.skills.length > 0 && (
                            <div className="mb-4">
                               <p className="text-xs text-[#2E1065]/70 font-semibold mb-1.5">TOP SKILLS:</p>
                               <div className="flex flex-wrap gap-2">
                                {user.skills.slice(0, 3).map((skill, index) => ( // Show up to 3 skills
                                  <Badge 
                                    key={index} 
                                    className="bg-gradient-to-r from-[#FFD23F]/20 via-[#FF914D]/10 to-[#FF686B]/5 text-[#2E1065] border border-[#FFD23F]/40 text-xs px-2.5 py-1 rounded-md font-medium"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {user.skills.length > 3 && (
                                  <Badge 
                                    variant="outline" 
                                    className="border-[#5B21B6]/40 text-[#5B21B6] text-xs px-2.5 py-1 rounded-md font-medium"
                                  >
                                    +{user.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto pt-4 border-t border-[#5B21B6]/10">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[#5B21B6]/70 text-[#5B21B6] hover:bg-[#5B21B6] hover:text-white transition-all duration-300 rounded-lg group/button"
                            onClick={() => router.push(`/user/${user.uid}`)} // Ensure this route exists
                          >
                            View Profile
                            <span className="ml-1.5 text-[#5B21B6]/70 group-hover/button:text-white transition-colors duration-300">&rarr;</span>
                          </Button>
                          
                          {status === 'peer' && (
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-[#FF914D] to-[#FF686B] hover:opacity-90 text-white rounded-lg shadow-md transition-opacity duration-300 relative"
                              onClick={() => openChat(user)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1.5" /> Chat
                              {hasUnread && relevantConversation && (
                                <div className="absolute -top-1.5 -right-1.5 bg-white text-[#FF686B] text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm">
                                  {unreadCounts[relevantConversation.id]}
                                </div>
                              )}
                            </Button>
                          )}
                          
                          {status === 'none' && (
                            <Button
                              size="sm"
                              className="flex-1 bg-[#5B21B6] hover:bg-[#2E1065] text-white rounded-lg shadow-md transition-colors duration-300"
                              onClick={() => sendPeerRequest(user.uid)}
                            >
                              <UserPlus className="h-4 w-4 mr-1.5" /> Add Peer
                            </Button>
                          )}
                          
                          {status === 'sent' && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="flex-1 border-[#5B21B6]/40 text-[#5B21B6]/60 rounded-lg cursor-not-allowed"
                            >
                              <Clock className="h-4 w-4 mr-1.5" /> Request Sent
                            </Button>
                          )}
                           {status === 'received' && ( // If a user sent ME a request, show on their card if not in requests tab
                                <Badge className="flex-1 bg-[#FFD23F]/80 text-[#2E1065] border border-[#FFD23F] text-xs justify-center py-2 rounded-lg">
                                    <Users className="h-4 w-4 mr-1.5" /> Wants to Connect
                                </Badge>
                            )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <AlertTriangle className="h-16 w-16 text-[#FF914D]/80 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-[#2E1065] mb-2">No Peers Found</h3>
                  <p className="text-[#5B21B6]/80">
                    {searchQuery ? "Try adjusting your search or filters." : "Expand your network or check back later!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Chat Panel - Enhanced Styling */}
      {chatPanel.isOpen && chatPanel.peer && (
        <div 
          className={`fixed bottom-0 right-0 sm:bottom-4 sm:right-4 m-0 sm:m-0 w-full sm:w-96 h-full sm:h-[70vh] sm:max-h-[600px] bg-white/90 backdrop-blur-lg border border-[#2E1065]/20 rounded-none sm:rounded-xl shadow-2xl flex flex-col z-[100] transition-all duration-300 ease-in-out
            ${chatPanel.isMinimized ? 'translate-y-[calc(100%-4rem)] sm:translate-y-[calc(100%-4rem)]' : 'translate-y-0'}`
          }
          style={{boxShadow: '0 10px 30px -10px rgba(46, 16, 101, 0.3), 0 20px 50px -15px rgba(91, 33, 182, 0.2)'}} // Custom shadow for more punch
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#5B21B6] to-[#2E1065] text-white p-3 sm:p-4 flex justify-between items-center cursor-pointer rounded-t-none sm:rounded-t-lg" onClick={() => setChatPanel(prev => ({...prev, isMinimized: !prev.isMinimized}))}>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-white/50">
                <AvatarImage src={chatPanel.peer.profilePicture} />
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {chatPanel.peer.firstName?.[0]}{chatPanel.peer.surname?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">{chatPanel.peer.firstName} {chatPanel.peer.surname}</h3>
                {/* Could add online status here if available */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setChatPanel(prev => ({...prev, isMinimized: !prev.isMinimized})); }}
                className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                title={chatPanel.isMinimized ? "Maximize" : "Minimize"}
              >
                {chatPanel.isMinimized ? <ChevronUp className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setChatPanel({ isOpen: false, isMinimized: false, peer: null, conversationId: null }); setMessages([]); }}
                className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
                title="Close Chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Area - Hidden when minimized */}
          {!chatPanel.isMinimized && (
            <>
              <div className="flex-1 p-3 sm:p-4 space-y-3 overflow-y-auto bg-slate-50">
                {messages.map((msg, index) => {
                  const isCurrentUser = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id || index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`p-2.5 sm:p-3 rounded-xl shadow-md max-w-[75%] break-words
                          ${isCurrentUser 
                            ? 'bg-gradient-to-br from-[#5B21B6] to-[#4c1d95] text-white rounded-br-none' 
                            : 'bg-white text-[#2E1065] border border-slate-200 rounded-bl-none'
                          }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-purple-200/80 text-right' : 'text-gray-400 text-left'}`}>
                          {msg.timestamp?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'sending...'}
                          {isCurrentUser && msg.read && <CheckCheck className="inline ml-1 h-3 w-3 text-sky-300" />}
                          {isCurrentUser && !msg.read && <Check className="inline ml-1 h-3 w-3 text-purple-300/70" />}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-[#5B21B6]/20 bg-white flex items-center space-x-2 sm:space-x-3">
                <Input
                  ref={chatInputRef}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border-[#5B21B6]/40 focus:ring-2 focus:ring-[#5B21B6]/50 focus:border-[#5B21B6] rounded-lg px-3 py-2.5 text-sm bg-slate-50 placeholder:text-[#5B21B6]/60 transition-all"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-[#FF914D] to-[#FF686B] text-white p-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send Message"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      <FooterOne /> {/* Ensure FooterOne is styled appropriately */}
    </>
  );
}

