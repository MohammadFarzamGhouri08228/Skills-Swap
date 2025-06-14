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
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Phone,
  Video,
  MoreHorizontal
} from 'lucide-react';
import { userDataService, UserData } from '@/app/api/profile/userDataService';
import Wrapper from '@/layouts/Wrapper';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';
import { 
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
  addDoc,
  Timestamp
} from 'firebase/firestore';
import HeaderOne from '@/layouts/headers/HeaderOne';
import FooterOne from '@/layouts/footers/FooterOne';

// Import Firebase configuration from your existing setup
import { db, app } from '@/lib/firebase';

// Firebase configuration is now imported from your existing file

// Types
interface PeerRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp;
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
  timestamp: Timestamp;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  participantDetails: any;
  lastMessage: any;
  unreadCount: any;
  updatedAt: Timestamp;
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
  const [activeFilter, setActiveFilter] = useState<'peers' | 'all' | 'requests'>('peers');
  
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
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Debug state for Firebase connection
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Test Firebase connection
  useEffect(() => {
    if (db) {
      setFirebaseConnected(true);
      console.log("✅ Firebase connected successfully");
      console.log("📊 Firebase config loaded from /firebase/firebase.ts");
    } else {
      console.error("❌ Firebase not connected");
      setFirebaseConnected(false);
    }
  }, []);

  // Auth effect
  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized.");
      toast({
        title: "Error",
        description: "Firebase authentication not configured.",
        variant: "destructive",
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user?.uid || "No user");
      if (user) {
        setCurrentUserId(user.uid);
        try {
          const userData = await userDataService.getUser(user.uid);
          setCurrentUser(userData);
          if (userData) {
            console.log("✅ Current user loaded:", userData.firstName);
          }
        } catch (error: any) {
          console.error("Error fetching current user data:", error);
          toast({
            title: "Error",
            description: "Could not load your profile data.",
            variant: "destructive",
          });
        }
      } else {
        setCurrentUserId(null);
        setCurrentUser(null);
        console.log("❌ No authenticated user");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch users and setup real-time listeners
  useEffect(() => {
    if (!currentUserId || !db) {
      setIsLoading(false);
      return;
    }

    console.log("🔄 Setting up data for user:", currentUserId);

    const setupData = async () => {
      setIsLoading(true);
      try {
        const allUsers = await userDataService.getAllUsers();
        console.log("📥 Loaded users:", allUsers.length);
        setUsers(allUsers.filter(u => u.uid !== currentUserId));
        
        applyFilter(activeFilter, allUsers.filter(u => u.uid !== currentUserId));

        // Setup real-time listeners
        const unsubPeerRequests = setupPeerRequestsListener();
        const unsubUserPeers = setupUserPeersListener();
        const unsubConversations = setupConversationsListener();
        
        return () => {
          if (unsubPeerRequests) unsubPeerRequests();
          if (unsubUserPeers) unsubUserPeers();
          if (unsubConversations) unsubConversations();
        };
      } catch (error: any) {
        console.error('❌ Error setting up data:', error);
        toast({
          title: "Error",
          description: "Failed to load peers data. Please check your Firebase configuration.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupData();
  }, [currentUserId]);

  // Real-time listeners with better error handling
  const setupPeerRequestsListener = () => {
    if (!currentUserId || !db) return;
    
    console.log("🔄 Setting up peer requests listener");
    const q = query(
      collection(db, 'peerRequests'),
      where('toUserId', '==', currentUserId),
      where('status', '==', 'pending')
    );
    
    return onSnapshot(q, (snapshot) => {
      const requests: PeerRequest[] = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as PeerRequest));
      console.log("📥 Peer requests updated:", requests.length);
      setPeerRequests(requests);
    }, (error: any) => {
      console.error("❌ Error listening to peer requests:", error);
      toast({ 
        title: "Connection Error", 
        description: "Could not update peer requests. Check your Firebase rules.", 
        variant: "destructive"
      });
    });
  };

  const setupUserPeersListener = () => {
    if (!currentUserId || !db) return;
    
    console.log("🔄 Setting up user peers listener");
    const userPeersRef = doc(db, 'userPeers', currentUserId);
    
    return onSnapshot(userPeersRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log("📥 User peers updated:", data);
        setUserPeers(data.peers || []);
        setSentRequests(data.pendingRequests?.sent || []);
        setReceivedRequests(data.pendingRequests?.received || []);
      } else {
        console.log("📥 No user peers document found, creating empty state");
        setUserPeers([]);
        setSentRequests([]);
        setReceivedRequests([]);
      }
    }, (error: any) => {
      console.error("❌ Error listening to user peers:", error);
      toast({ 
        title: "Connection Error", 
        description: "Could not update your peer connections. Check your Firebase rules.", 
        variant: "destructive"
      });
    });
  };

  const setupConversationsListener = () => {
    if (!currentUserId || !db) return;
    
    console.log("🔄 Setting up conversations listener");
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
      console.log("📥 Conversations updated:", convs.length);
      setConversations(convs);
      setUnreadCounts(newUnreadCounts);
    }, (error: any) => {
      console.error("❌ Error listening to conversations:", error);
      toast({ 
        title: "Connection Error", 
        description: "Could not update messages. Check your Firebase rules.", 
        variant: "destructive"
      });
    });
  };

  // Enhanced peer request function with better error handling
  const sendPeerRequest = async (toUserId: string) => {
    if (!currentUserId || !currentUser || !db) {
      toast({ 
        title: "Action Failed", 
        description: "You must be logged in and Firebase must be configured.", 
        variant: "destructive"
      });
      return;
    }
    
    console.log("📤 Sending peer request to:", toUserId);
    try {
      const requestId = `${currentUserId}_${toUserId}`;
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

      const userPeersDoc = await getDoc(userPeersRef);
      if (userPeersDoc.exists()) {
        await updateDoc(userPeersRef, { 
          'pendingRequests.sent': arrayUnion(toUserId), 
          updatedAt: serverTimestamp() 
        });
      } else {
        await setDoc(userPeersRef, { 
          userId: currentUserId, 
          peers: [], 
          pendingRequests: { sent: [toUserId], received: [] }, 
          updatedAt: serverTimestamp() 
        });
      }

      const recipientDoc = await getDoc(recipientPeersRef);
      if (recipientDoc.exists()) {
        await updateDoc(recipientPeersRef, { 
          'pendingRequests.received': arrayUnion(currentUserId), 
          updatedAt: serverTimestamp() 
        });
      } else {
        await setDoc(recipientPeersRef, { 
          userId: toUserId, 
          peers: [], 
          pendingRequests: { sent: [], received: [currentUserId] }, 
          updatedAt: serverTimestamp() 
        });
      }

      console.log("✅ Peer request sent successfully");
      toast({ title: "Peer Request Sent!", description: "Your peer request has been sent successfully." });
    } catch (error: any) {
      console.error('❌ Error sending peer request:', error);
      toast({ 
        title: "Error", 
        description: `Failed to send peer request: ${error.message}`, 
        variant: "destructive" 
      });
    }
  };

  const handlePeerRequest = async (requestId: string, status: 'accepted' | 'declined') => {
    if(!currentUserId || !db) return;
    
    console.log(`📝 ${status} peer request:`, requestId);
    try {
      const requestRef = doc(db, 'peerRequests', requestId);
      const request = peerRequests.find(r => r.id === requestId);
      if (!request) throw new Error("Request not found");

      await updateDoc(requestRef, { status, updatedAt: serverTimestamp() });

      const currentUserPeersRef = doc(db, 'userPeers', currentUserId);
      const fromUserPeersRef = doc(db, 'userPeers', request.fromUserId);

      if (status === 'accepted') {
        await updateDoc(currentUserPeersRef, { 
          peers: arrayUnion(request.fromUserId), 
          'pendingRequests.received': arrayRemove(request.fromUserId), 
          updatedAt: serverTimestamp() 
        });
        await updateDoc(fromUserPeersRef, { 
          peers: arrayUnion(currentUserId), 
          'pendingRequests.sent': arrayRemove(currentUserId), 
          updatedAt: serverTimestamp() 
        });
        console.log("✅ Peer request accepted");
        toast({ title: "Peer Request Accepted!", description: "You are now connected as peers." });
      } else {
        await updateDoc(currentUserPeersRef, { 
          'pendingRequests.received': arrayRemove(request.fromUserId), 
          updatedAt: serverTimestamp() 
        });
        await updateDoc(fromUserPeersRef, { 
          'pendingRequests.sent': arrayRemove(currentUserId), 
          updatedAt: serverTimestamp() 
        });
        console.log("✅ Peer request declined");
        toast({ title: "Peer Request Declined", description: "The peer request has been declined." });
      }

      setPeerRequests(prev => prev.filter(r => r.id !== requestId));

    } catch (error: any) {
      console.error('❌ Error handling peer request:', error);
      toast({ 
        title: "Error", 
        description: `Failed to handle peer request: ${error.message}`, 
        variant: "destructive" 
      });
    }
  };

  // Enhanced chat opening with better error handling
  const openChat = async (peer: UserData) => {
    if (!currentUserId || !currentUser || !db) {
      toast({
        title: "Error",
        description: "Authentication or Firebase configuration issue.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("💬 Opening chat with:", peer.firstName);
    try {
      const participants = [currentUserId, peer.uid].sort();
      const conversationId = `${participants[0]}_${participants[1]}`;
      
      const conversationRef = doc(db, 'conversations', conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        console.log("📝 Creating new conversation");
        await setDoc(conversationRef, {
          participants,
          participantDetails: {
            [currentUserId]: { 
              name: `${currentUser.firstName} ${currentUser.surname}`, 
              email: currentUser.email, 
              profilePicture: currentUser.profilePicture || '' 
            },
            [peer.uid]: { 
              name: `${peer.firstName} ${peer.surname}`, 
              email: peer.email, 
              profilePicture: peer.profilePicture || '' 
            }
          },
          lastMessage: null,
          unreadCount: { [currentUserId]: 0, [peer.uid]: 0 },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setChatPanel({ isOpen: true, isMinimized: false, peer, conversationId });
      setupMessagesListener(conversationId);
      markMessagesAsRead(conversationId);
      
      console.log("✅ Chat opened successfully");
    } catch (error: any) {
      console.error('❌ Error opening chat:', error);
      toast({ 
        title: "Error", 
        description: `Failed to open chat: ${error.message}`, 
        variant: "destructive" 
      });
    }
  };

  const setupMessagesListener = (conversationId: string) => {
    if (!db) return;
    
    console.log("🔄 Setting up messages listener for:", conversationId);
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    return onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Message));
      console.log("📥 Messages updated:", msgs.length);
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error: any) => {
      console.error("❌ Error listening to messages:", error);
      toast({ 
        title: "Chat Error", 
        description: "Could not load messages. Check your Firebase rules.", 
        variant: "destructive"
      });
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatPanel.conversationId || !currentUserId || !currentUser || !chatPanel.peer || !db) {
      console.log("❌ Cannot send message - missing requirements");
      return;
    }
    
    console.log("📤 Sending message:", newMessage.substring(0, 20) + "...");
    try {
      const messageData = {
        conversationId: chatPanel.conversationId,
        senderId: currentUserId,
        senderName: `${currentUser.firstName} ${currentUser.surname}`,
        senderProfilePicture: currentUser.profilePicture || '',
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        read: false
      };
      
      // Add message to messages collection
      await addDoc(collection(db, 'messages'), messageData);

      const otherUserId = chatPanel.peer.uid;
      const currentUnread = unreadCounts[chatPanel.conversationId] || 0;

      // Update conversation with last message and unread count
      await updateDoc(doc(db, 'conversations', chatPanel.conversationId), {
        lastMessage: { 
          text: newMessage.trim(), 
          senderId: currentUserId, 
          senderName: `${currentUser.firstName} ${currentUser.surname}`, 
          timestamp: serverTimestamp() 
        },
        [`unreadCount.${otherUserId}`]: currentUnread + 1,
        updatedAt: serverTimestamp()
      });
      
      setNewMessage('');
      chatInputRef.current?.focus();
      console.log("✅ Message sent successfully");
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      toast({ 
        title: "Error", 
        description: `Failed to send message: ${error.message}`, 
        variant: "destructive" 
      });
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!currentUserId || !conversationId || !db) return;
    
    try {
      await updateDoc(doc(db, 'conversations', conversationId), {
        [`unreadCount.${currentUserId}`]: 0,
      });
    } catch (error: any) {
      console.error('❌ Error marking messages as read:', error);
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`; // max 96px (6 rows)
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Search and filter functions
  const getBaseFilteredUsers = (sourceUsers: UserData[], filter: 'all' | 'peers' | 'requests') => {
    switch (filter) {
      case 'peers':
        return sourceUsers.filter(user => userPeers.includes(user.uid));
      case 'requests':
        return sourceUsers.filter(user => peerRequests.some(req => req.fromUserId === user.uid));
      default:
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
        const skills = user.skillsOffered?.join(' ').toLowerCase() || '';
        const location = user.location?.toLowerCase() || '';
        const email = user.email.toLowerCase();
        
        return fullName.includes(searchLower) || skills.includes(searchLower) || location.includes(searchLower) || email.includes(searchLower);
      });
    }
    setFilteredUsers(currentFilteredUsers);
  };

  useEffect(() => {
    applyFilter(activeFilter, users);
  }, [searchQuery, users, activeFilter, userPeers, peerRequests]);

  const getUserStatus = (user: UserData) => {
    if (userPeers.includes(user.uid)) return 'peer';
    if (sentRequests.includes(user.uid)) return 'sent';
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
            {!firebaseConnected && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-xs">⚠️ Firebase connection issue detected</p>
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <>
      <HeaderOne />
      <Wrapper>
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
                  {(['peers', 'all', 'requests'] as const).map(filterKey => {
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
                          
                          {user.skillsOffered && user.skillsOffered.length > 0 && (
                            <div className="mb-4">
                               <p className="text-xs text-[#2E1065]/70 font-semibold mb-1.5">TOP SKILLS:</p>
                               <div className="flex flex-wrap gap-2">
                                {user.skillsOffered.slice(0, 3).map((skill, index) => (
                                  <Badge 
                                    key={index} 
                                    className="bg-gradient-to-r from-[#FFD23F]/20 via-[#FF914D]/10 to-[#FF686B]/5 text-[#2E1065] border border-[#FFD23F]/40 text-xs px-2.5 py-1 rounded-md font-medium"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                                {user.skillsOffered.length > 3 && (
                                  <Badge 
                                    variant="outline" 
                                    className="border-[#5B21B6]/40 text-[#5B21B6] text-xs px-2.5 py-1 rounded-md font-medium"
                                  >
                                    +{user.skillsOffered.length - 3} more
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
                            onClick={() => router.push(`/user/${user.uid}`)}
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
                           {status === 'received' && (
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

      {/* Modern Simplified Chat Panel */}
      {chatPanel.isOpen && chatPanel.peer && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] z-50">
          <div 
            className={`bg-white rounded-none sm:rounded-3xl shadow-2xl border border-gray-200/50 backdrop-blur-xl 
              transition-all duration-500 ease-out transform-gpu
              ${chatPanel.isMinimized 
                ? 'h-20 sm:h-24' 
                : 'h-screen sm:h-[650px]'
              }`}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.3)'
            }}
          >
            {/* Simplified Modern Header */}
            <div 
              className="relative overflow-hidden bg-gradient-to-r from-[#5B21B6] via-[#7C3AED] to-[#2E1065] 
                text-white p-6 rounded-t-none sm:rounded-t-3xl
                transition-all duration-300 hover:shadow-lg"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Modern Avatar */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/user/${chatPanel.peer!.uid}`);
                    }}
                    className="relative focus:outline-none focus:ring-2 focus:ring-white/50 rounded-2xl"
                    title={`View ${chatPanel.peer!.firstName}'s profile`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 
                      flex items-center justify-center border-2 border-white/20 backdrop-blur-sm
                      shadow-xl transition-transform duration-300 hover:scale-105">
                      {chatPanel.peer.profilePicture ? (
                        <Avatar className="w-full h-full rounded-2xl">
                          <AvatarImage src={chatPanel.peer.profilePicture} className="rounded-2xl" />
                          <AvatarFallback className="bg-transparent text-white font-bold text-lg rounded-2xl">
                            {chatPanel.peer.firstName?.[0]}{chatPanel.peer.surname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="text-xl font-bold text-white">
                          {chatPanel.peer.firstName?.[0]}{chatPanel.peer.surname?.[0]}
                        </span>
                      )}
                    </div>
                  </button>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white tracking-tight">
                      {chatPanel.peer!.firstName} {chatPanel.peer!.surname}
                    </h3>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setChatPanel(prev => ({...prev, isMinimized: !prev.isMinimized})); }}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-200 
                      hover:scale-110 active:scale-95"
                    title={chatPanel.isMinimized ? "Expand" : "Minimize"}
                  >
                    {chatPanel.isMinimized ? 
                      <ChevronUp className="w-5 h-5" /> : 
                      <Minimize2 className="w-5 h-5" />
                    }
                  </button>
                  
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setChatPanel({ isOpen: false, isMinimized: false, peer: null, conversationId: null }); 
                      setMessages([]);
                    }}
                    className="p-3 hover:bg-red-500/20 rounded-2xl transition-all duration-200 
                      hover:scale-110 active:scale-95"
                    title="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            {!chatPanel.isMinimized && (
              <div className="flex-1 flex flex-col h-[calc(100%-theme(spacing.20))] sm:h-[calc(650px-theme(spacing.20))]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/80">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#5B21B6]/10 to-[#2E1065]/5 
                        rounded-full flex items-center justify-center mb-4">
                        <MessageCircle className="w-8 h-8 text-[#5B21B6]/60" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h4>
                      <p className="text-sm text-gray-500 max-w-xs">
                        Send a message to {chatPanel.peer.firstName} to begin your chat!
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, index) => {
                        const isCurrentUser = msg.senderId === currentUserId;
                        const showTimestamp = index === 0 || 
                          (msg.timestamp?.toDate && messages[index-1]?.timestamp?.toDate &&
                          msg.timestamp.toDate().getTime() - messages[index-1].timestamp.toDate().getTime() > 300000);
                        
                        return (
                          <div key={msg.id} className="space-y-2">
                            {showTimestamp && (
                              <div className="flex justify-center">
                                <span className="text-xs text-gray-400 bg-white/80 px-3 py-1 rounded-full border">
                                  {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  }) : 'Now'}
                                </span>
                              </div>
                            )}
                            
                            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} 
                              animate-in slide-in-from-bottom-2 duration-300`}>
                              <div className={`group max-w-[85%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                <div 
                                  className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 
                                    hover:shadow-md transform hover:-translate-y-0.5
                                    ${isCurrentUser 
                                      ? 'bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white rounded-br-md' 
                                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                                    }`}
                                >
                                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                                  
                                  <div className={`flex items-center justify-between mt-2 text-xs 
                                    ${isCurrentUser ? 'text-purple-100' : 'text-gray-400'}`}>
                                    <span>
                                      {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      }) : 'Sending...'}
                                    </span>
                                    {isCurrentUser && (
                                      <div className="ml-2 transition-all duration-200">
                                        {msg.read ? (
                                          <CheckCheck className="w-3 h-3 text-green-300" />
                                        ) : (
                                          <Check className="w-3 h-3 text-purple-200" />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                          <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Input Area */}
                <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm p-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <textarea
                        ref={chatInputRef}
                        value={newMessage}
                        onChange={handleTextareaChange}
                        onKeyPress={handleKeyPress}
                        placeholder={`Message ${chatPanel.peer.firstName}...`}
                        className="w-full resize-none rounded-3xl border border-gray-200 bg-gray-50/50 
                          px-5 py-4 pr-12 text-sm placeholder:text-gray-400 
                          focus:border-[#5B21B6] focus:bg-white focus:outline-none focus:ring-2 
                          focus:ring-[#5B21B6]/20 transition-all duration-200 max-h-24"
                        rows={1}
                        style={{ 
                          minHeight: '48px',
                          height: 'auto'
                        }}
                      />
                      
                      {/* Character counter for long messages */}
                      {newMessage.length > 100 && (
                        <div className="absolute bottom-1 left-3 text-xs text-gray-400">
                          {newMessage.length}/500
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] 
                        text-white rounded-2xl shadow-lg hover:shadow-xl disabled:opacity-50 
                        disabled:cursor-not-allowed transition-all duration-200 
                        hover:scale-105 active:scale-95 disabled:hover:scale-100
                        flex items-center justify-center group"
                      title="Send message"
                    >
                      <Send className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                  
                  {/* Quick actions */}
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <div className="flex items-center space-x-4">
                      <button className="hover:text-[#5B21B6] transition-colors duration-200">
                        📎 Attach
                      </button>
                      <button className="hover:text-[#5B21B6] transition-colors duration-200">
                        😊 Emoji
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <FooterOne />
    </>
  );
}