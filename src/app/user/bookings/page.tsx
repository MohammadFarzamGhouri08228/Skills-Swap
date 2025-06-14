'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Filter, Search, Star, ChevronLeft, ChevronRight, Eye, Edit, Trash2, MessageCircle, RefreshCw, ArrowLeftRight, Timer, Plus, X } from 'lucide-react';

// Firebase imports - now importing from main directory
import { collection, getDocs, query, where, orderBy, addDoc, getDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from '../../../../firebase/firebase';

// Import Header and Footer components (assuming they exist elsewhere)
import HeaderOne from '@/layouts/headers/HeaderOne'; // Example import path
import FooterOne from '@/layouts/footers/FooterOne'; // Example import path

// Initialize Firebase services using the imported app
const auth = getAuth(app);

// Define an interface for the Booking object
interface Booking {
  id: string;
  mySkill: string;
  partnerSkill: string;
  peer: string;
  date: string;
  secondaryDate?: string | null; // New field for bi-weekly second date
  time: string;
  status: string;
  rating: number;
  isRecurring: boolean;
  frequency: string | null;
  duration: string;
  nextSession: string | null;
  description: string;
}

// Interface for user stats
interface UserStats {
  totalSessions: number;
  completedSessions: number;
  activePeers: number;
  avgRating: number;
}

// Interface for peers
interface Peer {
  id: string;
  name: string;
  skills: string[];
  rating: number;
}

// Interface for user skills
interface UserSkill {
  id: string;
  name: string;
  level: string;
}

// Interface for new booking form
interface NewBookingForm {
  peerId: string;
  peerName: string;
  mySkill: string;
  partnerSkill: string;
  date: string;
  secondaryDate: string | null; // New field for bi-weekly second date
  time: string;
  duration: string;
  isRecurring: boolean;
  frequency: string | null;
  description: string;
}

// Mock data for SkillSwap bookings (fallback if no data from Firebase)
const mockBookings: Booking[] = [
  {
    id: "1",
    mySkill: "Web Development",
    partnerSkill: "Graphic Design",
    peer: "Sarah Johnson",
    date: "2024-06-15",
    time: "10:00 AM",
    status: "confirmed",
    rating: 4.8,
    isRecurring: true,
    frequency: "Weekly",
    duration: "2 hours",
    nextSession: "2024-06-22",
    description: "Learning advanced graphic design techniques while teaching modern web development frameworks including React and Next.js."
  },
  {
    id: "2",
    mySkill: "Guitar Playing",
    partnerSkill: "Piano Lessons",
    peer: "Mike Chen",
    date: "2024-06-18",
    time: "2:30 PM",
    status: "pending",
    rating: 4.9,
    isRecurring: false,
    frequency: null,
    duration: "1.5 hours",
    nextSession: null,
    description: "One-time session to learn piano basics while sharing guitar techniques and music theory."
  },
  {
    id: "3",
    mySkill: "Digital Marketing",
    partnerSkill: "Content Writing",
    peer: "Emma Davis",
    date: "2024-06-20",
    time: "9:00 AM",
    status: "confirmed",
    rating: 4.7,
    isRecurring: true,
    frequency: "Bi-weekly",
    duration: "2 hours",
    nextSession: "2024-07-04",
    description: "Bi-weekly sessions focusing on SEO strategies and social media marketing in exchange for creative writing and copywriting skills."
  },
  {
    id: "4",
    mySkill: "Photography",
    partnerSkill: "Video Editing",
    peer: "Alex Rodriguez",
    date: "2024-06-22",
    time: "11:00 AM",
    status: "completed",
    rating: 5.0,
    isRecurring: true,
    frequency: "Daily",
    duration: "1 hour",
    nextSession: "2024-06-23",
    description: "Daily practice sessions combining photography techniques with advanced video editing using Adobe Premiere Pro."
  },
  {
    id: "5",
    mySkill: "Cooking",
    partnerSkill: "Baking",
    peer: "Lisa Wang",
    date: "2024-06-25",
    time: "6:00 PM",
    status: "confirmed",
    rating: 4.6,
    isRecurring: true,
    frequency: "Weekly",
    duration: "3 hours",
    nextSession: "2024-07-02",
    description: "Weekly culinary exchange focusing on international cuisine and professional baking techniques."
  }
];

// Mock data for peers
const mockPeers: Peer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    skills: ["Graphic Design", "UI/UX Design", "Adobe Photoshop", "Illustrator"],
    rating: 4.8
  },
  {
    id: "2",
    name: "Mike Chen",
    skills: ["Piano Lessons", "Music Theory", "Jazz Piano", "Classical Music"],
    rating: 4.9
  },
  {
    id: "3",
    name: "Emma Davis",
    skills: ["Content Writing", "Copywriting", "SEO Writing", "Blog Writing"],
    rating: 4.7
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    skills: ["Video Editing", "Adobe Premiere Pro", "After Effects", "Motion Graphics"],
    rating: 5.0
  },
  {
    id: "5",
    name: "Lisa Wang",
    skills: ["Baking", "Pastry Arts", "Cake Decorating", "French Patisserie"],
    rating: 4.6
  },
  {
    id: "6",
    name: "David Kim",
    skills: ["Python Programming", "Data Science", "Machine Learning", "Django"],
    rating: 4.5
  }
];

// Mock data for user skills
const mockUserSkills: UserSkill[] = [
  { id: "1", name: "Web Development", level: "Advanced" },
  { id: "2", name: "React", level: "Advanced" },
  { id: "3", name: "JavaScript", level: "Expert" },
  { id: "4", name: "Guitar Playing", level: "Intermediate" },
  { id: "5", name: "Digital Marketing", level: "Advanced" },
  { id: "6", name: "Photography", level: "Intermediate" },
  { id: "7", name: "Cooking", level: "Beginner" },
  { id: "8", name: "Spanish Language", level: "Intermediate" }
];

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: '',
    body: '',
    isError: false
  });
  const [userStats, setUserStats] = useState<UserStats>({
    totalSessions: 0,
    completedSessions: 0,
    activePeers: 0,
    avgRating: 0
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userOfferedSkills, setUserOfferedSkills] = useState<UserSkill[]>([]);
  const [newBookingForm, setNewBookingForm] = useState<NewBookingForm>({
    peerId: '',
    peerName: '',
    mySkill: '',
    partnerSkill: '',
    date: '',
    secondaryDate: null, // Initialize secondaryDate
    time: '',
    duration: '1 hour',
    isRecurring: false,
    frequency: null,
    description: ''
  });
  
  const itemsPerPage = 6;
  const [mounted, setMounted] = useState(false);

  // Helper function to fetch peer details from the userPeers collection
  const fetchPeersFromUserPeers = async (userId: string): Promise<Peer[]> => {
    try {
      console.log('Fetching peers for user:', userId);
      
      // Query the userPeers collection for the document with matching userId
      const userPeersRef = collection(db, 'userPeers');
      const q = query(userPeersRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      console.log('UserPeers documents found:', snapshot.size);
      
      const fetchedPeers: Peer[] = [];
      let peerUserIds: string[] = [];
      
      // Extract peer user IDs from the peers array
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log('Document data for user:', data);
        
        if (data.peers && Array.isArray(data.peers)) {
          console.log('Found peers array:', data.peers);
          peerUserIds = data.peers;
        }
      });
      
      console.log('Total peer user IDs found:', peerUserIds);
      
      // If we have peer user IDs, fetch their details from the users collection
      if (peerUserIds.length > 0) {
        const usersRef = collection(db, 'users');
        
        // Firestore 'in' query has a limit of 10, so we might need to batch
        const batchSize = 10;
        for (let i = 0; i < peerUserIds.length; i += batchSize) {
          const batchUids = peerUserIds.slice(i, i + batchSize);
          console.log('Fetching user details for batch:', batchUids);
          
          const usersQuery = query(usersRef, where('uid', 'in', batchUids));
          const usersSnapshot = await getDocs(usersQuery);
          
          console.log('Users found in batch:', usersSnapshot.size);
          
          usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            console.log('User data:', userData);
            
            fetchedPeers.push({
              id: userData.uid,
              name: `${userData.firstName || ''} ${userData.surname || ''}`.trim() || 'Unknown Peer',
              skills: userData.skillsOffered || [],
              rating: userData.rating || 0,
            });
          });
        }
      } else {
        console.log('No peer user IDs found for user:', userId);
      }
      
      console.log('Final fetched peers:', fetchedPeers);
      return fetchedPeers;
    } catch (error) {
      console.error('Error fetching peers from userPeers collection:', error);
      return [];
    }
  };

  // Fetch user data and stats from Firebase
  const fetchUserDataAndStats = async (userId: string) => {
    try {
      setDataLoading(true);
      let currentSessionPeers: Peer[] = [];
      
      // Get user document
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('uid', '==', userId));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        
        // Fetch peers from the new userPeers collection structure
        const fetchedPeers = await fetchPeersFromUserPeers(userId);
        setPeers(fetchedPeers);
        currentSessionPeers = fetchedPeers;
        
        // Fetch and set the current user's offered skills
        if (userData.skillsOffered && Array.isArray(userData.skillsOffered)) {
          // Map string skills to UserSkill interface for consistency, assign a simple ID
          const offeredSkillsFormatted = userData.skillsOffered.map((skillName: string, index: number) => ({
            id: skillName.replace(/\s+/g, '-').toLowerCase() + '-' + index, // Create a simple ID
            name: skillName,
            level: '' // Level is not available in this data structure
          }));
          setUserOfferedSkills(offeredSkillsFormatted);
        } else {
          setUserOfferedSkills([]); // Set to empty array if no skills offered
        }
        
      } else {
        // User document not found, possibly a new user or error
        console.warn("User document not found for uid:", userId);
        // Optionally handle this case, e.g., redirect to profile setup
      }
      
      // Fetch bookings from Firebase (if you have a bookings collection)
      // You can uncomment and modify this section when you create the bookings collection
      
      const bookingsRef = collection(db, 'bookings');
      // Query for bookings where current user is teacher1
      const teacher1BookingsQuery = query(
        bookingsRef,
        where('participants.teacher1.userId', '==', userId),
        orderBy('timeSlot.startTime', 'desc') // Order by start time
      );
      const teacher1BookingsSnapshot = await getDocs(teacher1BookingsQuery);

      // Query for bookings where current user is teacher2
      const teacher2BookingsQuery = query(
        bookingsRef,
        where('participants.teacher2.userId', '==', userId),
        orderBy('timeSlot.startTime', 'desc') // Order by start time
      );
      const teacher2BookingsSnapshot = await getDocs(teacher2BookingsQuery);

      // Combine and process bookings
      const combinedBookings: Booking[] = [];
      const allBookingsDocs = [...teacher1BookingsSnapshot.docs, ...teacher2BookingsSnapshot.docs];

      allBookingsDocs.forEach(doc => {
        const data = doc.data();
        const isCurrentUserTeacher1 = data.participants.teacher1.userId === userId;
        const peerId = isCurrentUserTeacher1 ? data.participants.teacher2.userId : data.participants.teacher1.userId;
        const peerData = currentSessionPeers.find((p: Peer) => p.id === peerId);
        const peerName = peerData ? peerData.name : 'Unknown Peer';

        const startTime = (data.timeSlot.startTime as any).toDate(); // Convert Firebase Timestamp to Date
        const dateString = startTime.toISOString().split('T')[0];
        const timeString = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const nextSessionDate = data.nextSession ? (data.nextSession as any).toDate() : null;
        const nextSessionString = nextSessionDate ? nextSessionDate.toISOString().split('T')[0] : null;

        combinedBookings.push({
          id: doc.id,
          mySkill: isCurrentUserTeacher1 ? data.participants.teacher1.skillOffered : data.participants.teacher2.skillOffered,
          partnerSkill: isCurrentUserTeacher1 ? data.participants.teacher2.skillOffered : data.participants.teacher1.skillOffered,
          peer: peerName,
          date: dateString,
          secondaryDate: data.secondaryDate ? (data.secondaryDate as any).toDate().toISOString().split('T')[0] : null, // Safely handle secondaryDate
          time: timeString,
          status: data.status,
          rating: data.rating || 0,
          isRecurring: data.isRecurring || false,
          frequency: data.frequency || null,
          duration: data.timeSlot.duration,
          nextSession: nextSessionString,
          description: data.notes || '',
        });
      });
      
      if (combinedBookings.length > 0) {
        setBookings(combinedBookings);
      } else {
        setBookings([]); // Set to empty if no bookings found
      }

      // Calculate and update user stats based on fetched bookings
      const calculatedTotalSessions = combinedBookings.length;
      const calculatedCompletedSessions = combinedBookings.filter(b => b.status === 'completed').length;
      const uniquePeers = new Set(combinedBookings.map(b => b.peer));
      const calculatedActivePeers = uniquePeers.size;

      const completedBookingRatings = combinedBookings
        .filter(b => b.status === 'completed' && b.rating > 0)
        .map(b => b.rating);
      const calculatedAvgRating = completedBookingRatings.length > 0
        ? completedBookingRatings.reduce((sum, rating) => sum + rating, 0) / completedBookingRatings.length
        : 0;

      const newStats = {
        totalSessions: calculatedTotalSessions,
        completedSessions: calculatedCompletedSessions,
        activePeers: calculatedActivePeers,
        avgRating: calculatedAvgRating
      };
      setUserStats(newStats);
      
      // Update user document in Firestore with new stats
      const userDocRef = doc(db, 'users', userSnapshot.docs[0].id);
      await setDoc(userDocRef, newStats, { merge: true });

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Keep using mock data if Firebase fetch fails
    } finally {
      setDataLoading(false);
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserDataAndStats(user.uid);
      } else {
        setCurrentUser(null);
        setDataLoading(false);
        // If no user is logged in, you might want to redirect to login
        // or show mock data for demo purposes
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.mySkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.partnerSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.peer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      if (typeFilter === 'recurring') {
        filtered = filtered.filter(booking => booking.isRecurring);
      } else if (typeFilter === 'one-time') {
        filtered = filtered.filter(booking => !booking.isRecurring);
      }
    }

    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, bookings]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bookings-status-confirmed';
      case 'pending': return 'bookings-status-pending';
      case 'completed': return 'bookings-status-completed';
      default: return 'bookings-status-default';
    }
  };

  const handleMakeBooking = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewBookingForm(prev => ({
      ...prev,
      date: today, // Set today's date as default
      secondaryDate: null, // Reset secondary date
      isRecurring: false, // Default to not recurring
      frequency: null // Default frequency
    }));
    setNewBookingModalOpen(true);
  };

  const handlePeerSelect = (peerId: string) => {
    const selectedPeer = peers.find(peer => peer.id === peerId);
    if (selectedPeer) {
      setNewBookingForm(prev => ({
        ...prev,
        peerId: peerId,
        peerName: selectedPeer.name,
        partnerSkill: '' // Reset partner skill when peer changes
      }));
    }
  };

  const handleCreateBooking = async () => {
    setIsLoading(true);
    
    if (!currentUser) {
      console.error("No user logged in.");
      setIsLoading(false);
      // Optionally show an error message to the user
      return;
    }

    try {
      // Convert duration string to minutes
      const durationInMinutes = parseInt(newBookingForm.duration.split(' ')[0]);
      
      // Combine date and time and convert to Date objects
      const [hours, minutes] = newBookingForm.time.split(':').map(Number);
      const startDate = new Date(newBookingForm.date);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + durationInMinutes * 60000);

      let nextSessionDate = null;
      if (newBookingForm.isRecurring) {
        if (newBookingForm.frequency === 'Bi-weekly' && newBookingForm.secondaryDate) {
          // For bi-weekly, calculate next session based on the later of the two dates.
          // Assuming 'date' is the first, 'secondaryDate' is the second.
          const date2 = new Date(newBookingForm.secondaryDate);
          nextSessionDate = new Date(calculateNextSession(date2.toISOString().split('T')[0], newBookingForm.frequency));
        } else if (newBookingForm.frequency === 'Daily') {
          nextSessionDate = new Date(calculateNextSession(new Date().toISOString().split('T')[0], newBookingForm.frequency));
        } else {
          nextSessionDate = new Date(calculateNextSession(newBookingForm.date, newBookingForm.frequency));
        }
      } else {
        // For one-time sessions, the "next session" is the session itself
        nextSessionDate = startDate;
      }

      // Construct the booking data for Firestore
      const bookingData = {
        location: "Virtual - Google Meet", // Using a placeholder based on your image
        notes: newBookingForm.description,
        participants: {
          teacher1: { // Assuming current user is teacher1
            skillOffered: newBookingForm.mySkill,
            userId: currentUser.uid,
          },
          teacher2: { // Assuming peer is teacher2
            skillOffered: newBookingForm.partnerSkill,
            userId: newBookingForm.peerId,
          },
        },
        status: 'pending', // Initial status
        timeSlot: {
          duration: newBookingForm.duration, // Store as string
          startTime: startDate, // Firestore will convert Date objects to Timestamps
          endTime: endDate, // Firestore will convert Date objects to Timestamps
        },
        // createdAt will be added by Firestore server timestamp
        isRecurring: newBookingForm.isRecurring,
        frequency: newBookingForm.frequency,
        nextSession: nextSessionDate, // Save as Date or null
        rating: 0, // Default rating for new bookings
        secondaryDate: newBookingForm.secondaryDate ? new Date(newBookingForm.secondaryDate) : null, // Save secondary date
      };

      console.log("Current User:", currentUser);
      console.log("Attempting to add booking to Firestore with data:", bookingData);

      // Add the booking to Firestore
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      console.log("Document written with ID: ", docRef.id);

      // Fetch the newly created booking from Firestore to get the full data including server timestamp and ID
      const newBookingSnapshot = await getDoc(docRef);
      if (newBookingSnapshot.exists()) {
        const newBookingFromFirestore = { 
          id: newBookingSnapshot.id, // Explicitly add the document ID
          ...newBookingSnapshot.data() as any // Spread document data, then cast the whole object
        };

        // Add the new booking to the state and reset form
        setBookings(prev => [newBookingFromFirestore, ...prev]);
        setNewBookingModalOpen(false);
        resetNewBookingForm();

        // Re-fetch user stats after a new booking is created
        if (currentUser) {
          fetchUserDataAndStats(currentUser.uid);
        }

      } else {
        console.error("Failed to fetch newly created booking");
        // Handle case where fetching the new doc fails
      }

    } catch (e) {
      console.error("Error adding document: ", e);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextSession = (currentDate: string, frequency: string | null): string => {
    if (!frequency) return currentDate;
    
    const date = new Date(currentDate);
    switch (frequency) {
      case 'Daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'Weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'Bi-weekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'Monthly':
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const resetNewBookingForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewBookingForm({
      peerId: '',
      peerName: '',
      mySkill: '',
      partnerSkill: '',
      date: today,
      secondaryDate: null,
      time: '',
      duration: '1 hour',
      isRecurring: false,
      frequency: null,
      description: ''
    });
  };

  const getSelectedPeerSkills = (): string[] => {
    const selectedPeer = peers.find(peer => peer.id === newBookingForm.peerId);
    return selectedPeer ? selectedPeer.skills : [];
  };

  const isNewBookingFormValid = (): boolean => {
    return !!(
      newBookingForm.peerId &&
      newBookingForm.mySkill &&
      newBookingForm.partnerSkill &&
      (newBookingForm.frequency === 'Daily' || newBookingForm.date) && // Date is optional for Daily
      (newBookingForm.frequency !== 'Bi-weekly' || newBookingForm.secondaryDate) && // Secondary date required for Bi-weekly
      newBookingForm.time &&
      newBookingForm.duration
    );
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      frequency: booking.frequency,
      isRecurring: booking.isRecurring,
      description: booking.description,
      status: booking.status,
      rating: booking.rating,
      secondaryDate: booking.secondaryDate
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    if (!selectedBooking || !currentUser) {
      console.error("No booking selected or user not logged in.");
      setIsLoading(false);
      return;
    }

    try {
      const bookingDocRef = doc(db, "bookings", selectedBooking.id);
      
      const updatedData: any = {
        notes: editForm.description,
        timeSlot: {
          duration: editForm.duration,
        },
        isRecurring: editForm.isRecurring,
        frequency: editForm.frequency,
      };

      // Only update date and time if not daily recurring
      if (editForm.frequency !== 'Daily') {
        const [hours, minutes] = (editForm.time || selectedBooking.time).split(':').map(Number);
        const startDate = new Date(editForm.date || selectedBooking.date);
        startDate.setHours(hours, minutes, 0, 0);
        updatedData['timeSlot.startTime'] = startDate; // Use dot notation for nested fields
        updatedData['timeSlot.endTime'] = new Date(startDate.getTime() + parseInt(editForm.duration?.split(' ')[0] || selectedBooking.duration.split(' ')[0]) * 60000);
      }

      // Handle status change and rating
      if (editForm.status) { // Assuming status can be edited from the form
        updatedData.status = editForm.status;
      }
      if (editForm.rating !== undefined) { // Assuming rating can be edited
        updatedData.rating = editForm.rating;
      }

      await setDoc(bookingDocRef, updatedData, { merge: true });

      // Update local state
      const updatedBookings = bookings.map(booking =>
        booking.id === selectedBooking.id
          ? { ...booking, ...editForm as Booking } // Cast editForm to Booking to satisfy type
          : booking
      );
      setBookings(updatedBookings);
      setEditModalOpen(false);

      // Re-fetch user stats after a booking is edited
      fetchUserDataAndStats(currentUser.uid);

    } catch (e) {
      console.error("Error updating document: ", e);
      setMessageModalContent({ title: "Error", body: "Error updating booking. Please try again.", isError: true });
      setMessageModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!currentUser) {
      console.error("No user logged in to delete booking.");
      return;
    }

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setFilteredBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setMessageModalContent({ title: "Success!", body: "Booking cancelled successfully!", isError: false });
      setMessageModalOpen(true);

      // Re-fetch user stats after a booking is deleted
      if (currentUser) {
        fetchUserDataAndStats(currentUser.uid);
      }

    } catch (e) {
      console.error("Error deleting document: ", e);
      setMessageModalContent({ title: "Error", body: "Error cancelling booking. Please try again.", isError: true });
      setMessageModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    return `${dateStr} at ${time}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <>
        <HeaderOne />
        <div className="bookings-page">
          <div className="bookings-content-wrapper">
            <div className="bookings-loading">
              <div className="bookings-loading-spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          </div>
        </div>
        <FooterOne />
      </>
    );
  }

  return (
    <>
      <HeaderOne />
      <div className="bookings-page">
        <div className="bookings-content-wrapper">
          {/* Header Section */}
          <div className="bookings-header">
            <div className="bookings-container">
              <div className="bookings-header-content">
                <h1 className="bookings-title">My SkillSwap Sessions</h1>
                <p className="bookings-subtitle">Manage your skill exchange sessions and peers</p>
              </div>
              
              {/* Stats Cards - Now using real data from Firebase */}
              <div className="bookings-stats">
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">{userStats.totalSessions}</div>
                  <div className="bookings-stat-label">Total Sessions</div>
                </div>
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">{userStats.completedSessions}</div>
                  <div className="bookings-stat-label">Completed</div>
                </div>
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">{userStats.activePeers}</div>
                  <div className="bookings-stat-label">Active Peers</div>
                </div>
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">{userStats.avgRating.toFixed(1)}</div>
                  <div className="bookings-stat-label">My Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bookings-filters">
            <div className="bookings-container">
              <div className="bookings-filters-content">
                <div className="bookings-search">
                  <Search className="bookings-search-icon" />
                  <input
                    type="text"
                    placeholder="Search sessions or peers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bookings-search-input"
                  />
                </div>
                
                <div className="bookings-filter-group">
                  <div className="bookings-filter">
                    <Filter className="bookings-filter-icon" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bookings-filter-select"
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="bookings-filter">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="bookings-filter-select"
                    >
                      <option value="all">All Types</option>
                      <option value="recurring">Recurring</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Make a Booking Button */}
          <div className="bookings-make-booking-section">
            <div className="bookings-container">
              <button 
                className="bookings-make-booking-btn"
                onClick={handleMakeBooking}
              >
                <Plus size={20} />
                Make a New Booking
              </button>
            </div>
          </div>

          {/* Bookings Grid */}
          <div className="bookings-content">
            <div className="bookings-container">
              {isLoading ? (
                <div className="bookings-loading">
                  <div className="bookings-loading-spinner"></div>
                </div>
              ) : (
                mounted && (
                  <div className="bookings-grid">
                    {currentBookings.map((booking) => (
                      <div key={booking.id} className="bookings-card">
                        <div className="bookings-card-header">
                          <div className="bookings-card-type">
                            {booking.isRecurring ? (
                              <div className="bookings-recurring">
                                <RefreshCw size={16} />
                                <span>{booking.frequency}</span>
                              </div>
                            ) : (
                              <div className="bookings-one-time">
                                📅 One-time
                              </div>
                            )}
                          </div>
                          <div className={`bookings-card-status ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>

                        <div className="bookings-card-content">
                          <div className="bookings-skill-exchange">
                            <div className="bookings-skill-item">
                              <div className="bookings-skill-label">I teach:</div>
                              <div className="bookings-skill-name">{booking.mySkill}</div>
                            </div>
                            <ArrowLeftRight className="bookings-exchange-icon" />
                            <div className="bookings-skill-item">
                              <div className="bookings-skill-label">I learn:</div>
                              <div className="bookings-skill-name">{booking.partnerSkill}</div>
                            </div>
                          </div>
                          
                          <div className="bookings-card-meta">
                            <div className="bookings-meta-item">
                              <User className="bookings-meta-icon" />
                              <span>{booking.peer}</span>
                            </div>
                            
                            <div className="bookings-datetime-section">
                              {!(booking.isRecurring && booking.frequency === 'Daily') && (
                                <div className="bookings-meta-item bookings-datetime">
                                  <Calendar className="bookings-meta-icon" />
                                  <span className="bookings-datetime-text">
                                    {formatDateTime(booking.date, booking.time)}
                                    {booking.isRecurring && booking.frequency === 'Bi-weekly' && booking.secondaryDate && (
                                      <span> & {formatDateTime(booking.secondaryDate, booking.time)}</span>
                                    )}
                                  </span>
                                </div>
                              )}
                              
                              <div className="bookings-meta-item bookings-duration">
                                <Timer className="bookings-meta-icon" />
                                <span className="bookings-duration-text">{booking.duration}</span>
                              </div>
                            </div>
                            
                            {/* <div className="bookings-meta-item">
                              <Star className="bookings-meta-icon" />
                              <span>{booking.rating}</span>
                            </div> */}
                          </div>

                          {booking.nextSession && (
                            <div className="bookings-next-session">
                              <div className="bookings-next-label">Next session:</div>
                              <div className="bookings-next-date">
                                {formatDateTime(booking.nextSession, booking.time)}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bookings-card-actions">
                          <button
                            className="bookings-action-btn bookings-btn-secondary"
                            onClick={() => console.log('Message functionality coming soon')}
                          >
                            <MessageCircle size={16} />
                            Message
                          </button>
                          
                          {booking.status !== 'completed' && (
                            <button
                              className="bookings-action-btn bookings-btn-accent"
                              onClick={() => handleEdit(booking)}
                            >
                              <Edit size={16} />
                              Edit
                            </button>
                          )}

                          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <button
                              className="bookings-action-btn bookings-btn-danger"
                              onClick={() => {
                                setBookingToDelete(booking.id);
                                setDeleteConfirmationModalOpen(true);
                              }}
                            >
                              <Trash2 size={16} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bookings-pagination">
                  <button
                    className="bookings-pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`bookings-pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    className="bookings-pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Booking Modal */}
        {newBookingModalOpen && (
          <div className="bookings-modal-overlay" onClick={() => setNewBookingModalOpen(false)}>
            <div className="bookings-modal bookings-new-booking-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bookings-modal-header">
                <h2>Create New Booking</h2>
                <button 
                  className="bookings-modal-close"
                  onClick={() => setNewBookingModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bookings-modal-content">
                <div className="bookings-new-booking-form">
                  {/* Step 1: Select Peer */}
                  <div className="bookings-form-section">
                    <h3>Select a Peer</h3>
                    <div className="bookings-peers-grid">
                      {peers.map((peer) => (
                        <div 
                          key={peer.id}
                          className={`bookings-peer-card ${newBookingForm.peerId === peer.id ? 'selected' : ''}`}
                          onClick={() => handlePeerSelect(peer.id)}
                        >
                          <div className="bookings-peer-header">
                            <h4>{peer.name}</h4>
                            <div className="bookings-peer-rating">
                              <Star size={16} />
                              <span>{peer.rating}</span>
                            </div>
                          </div>
                          <div className="bookings-peer-skills">
                            <strong>Skills:</strong>
                            <div className="bookings-skills-list">
                              {peer.skills.map((skill, index) => (
                                <span key={index} className="bookings-skill-tag">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Skills */}
                  {newBookingForm.peerId && (
                    <div className="bookings-form-section">
                      <h3>Select Skills</h3>
                      <div className="bookings-skills-selection">
                        <div className="bookings-form-group">
                          <label>Skill I will teach:</label>
                          <select
                            value={newBookingForm.mySkill}
                            onChange={(e) => setNewBookingForm(prev => ({...prev, mySkill: e.target.value}))}
                            className="bookings-form-select"
                          >
                            <option value="">Select your skill</option>
                            {userOfferedSkills.map((skill) => (
                              <option key={skill.id} value={skill.name}>
                                {skill.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="bookings-form-group">
                          <label>Skill I want to learn:</label>
                          <select
                            value={newBookingForm.partnerSkill}
                            onChange={(e) => setNewBookingForm(prev => ({...prev, partnerSkill: e.target.value}))}
                            className="bookings-form-select"
                          >
                            <option value="">Select peer's skill</option>
                            {getSelectedPeerSkills().map((skill, index) => (
                              <option key={index} value={skill}>
                                {skill}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Schedule Details */}
                  {newBookingForm.mySkill && newBookingForm.partnerSkill && (
                    <div className="bookings-form-section">
                      <h3>Schedule Details</h3>
                      <div className="bookings-schedule-grid">
                        {newBookingForm.frequency !== 'Daily' && (
                          <div className="bookings-form-group">
                            <label>Date:</label>
                            <input
                              type="date"
                              value={newBookingForm.date}
                              onChange={(e) => setNewBookingForm(prev => ({...prev, date: e.target.value}))}
                              className="bookings-form-input"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        )}
                        
                        {newBookingForm.isRecurring && newBookingForm.frequency === 'Bi-weekly' && (
                          <div className="bookings-form-group">
                            <label>Second Date:</label>
                            <input
                              type="date"
                              value={newBookingForm.secondaryDate || ''}
                              onChange={(e) => setNewBookingForm(prev => ({...prev, secondaryDate: e.target.value}))}
                              className="bookings-form-input"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        )}
                        
                        <div className="bookings-form-group">
                          <label>Time:</label>
                          <input
                            type="time"
                            value={newBookingForm.time}
                            onChange={(e) => setNewBookingForm(prev => ({...prev, time: e.target.value}))}
                            className="bookings-form-input"
                          />
                        </div>
                        
                        <div className="bookings-form-group">
                          <label>Duration:</label>
                          <select
                            value={newBookingForm.duration}
                            onChange={(e) => setNewBookingForm(prev => ({...prev, duration: e.target.value}))}
                            className="bookings-form-select"
                          >
                            <option value="30 minutes">30 minutes</option>
                            <option value="1 hour">1 hour</option>
                            <option value="1.5 hours">1.5 hours</option>
                            <option value="2 hours">2 hours</option>
                            <option value="2.5 hours">2.5 hours</option>
                            <option value="3 hours">3 hours</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="bookings-form-group">
                        <label className="bookings-checkbox-label">
                          <input
                            type="checkbox"
                            checked={newBookingForm.isRecurring}
                            onChange={(e) => setNewBookingForm(prev => ({
                              ...prev, 
                              isRecurring: e.target.checked,
                              frequency: e.target.checked ? 'Weekly' : null,
                              secondaryDate: null // Reset secondary date when recurring status changes
                            }))}
                            className="bookings-form-checkbox"
                          />
                          Make this a recurring session
                        </label>
                      </div>
                      
                      {newBookingForm.isRecurring && (
                        <div className="bookings-form-group">
                          <label>Frequency:</label>
                          <select
                            value={newBookingForm.frequency || ''}
                            onChange={(e) => setNewBookingForm(prev => ({...prev, frequency: e.target.value}))}
                            className="bookings-form-select"
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Bi-weekly">Bi-weekly</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>
                      )}
                      
                      <div className="bookings-form-group">
                        <label>Description (Optional):</label>
                        <textarea
                          value={newBookingForm.description}
                          onChange={(e) => setNewBookingForm(prev => ({...prev, description: e.target.value}))}
                          className="bookings-form-textarea"
                          rows={3}
                          placeholder="Add any additional details about this session..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {isNewBookingFormValid() && (
                    <div className="bookings-form-section">
                      <h3>Booking Summary</h3>
                      <div className="bookings-summary-card">
                        <div className="bookings-summary-row">
                          <strong>Peer:</strong> {newBookingForm.peerName}
                        </div>
                        <div className="bookings-summary-row">
                          <strong>Exchange:</strong> 
                          <div className="bookings-summary-exchange">
                            <span>You teach: {newBookingForm.mySkill}</span>
                            <ArrowLeftRight size={16} />
                            <span>You learn: {newBookingForm.partnerSkill}</span>
                          </div>
                        </div>
                        <div className="bookings-summary-row">
                          <strong>Date & Time:</strong> {formatDateTime(newBookingForm.date, newBookingForm.time)}
                          {newBookingForm.isRecurring && newBookingForm.frequency === 'Bi-weekly' && newBookingForm.secondaryDate && (
                            <span> & {formatDateTime(newBookingForm.secondaryDate, newBookingForm.time)}</span>
                          )}
                        </div>
                        <div className="bookings-summary-row">
                          <strong>Duration:</strong> {newBookingForm.duration}
                        </div>
                        {newBookingForm.isRecurring && (
                          <div className="bookings-summary-row">
                            <strong>Type:</strong> Recurring ({newBookingForm.frequency})
                          </div>
                        )}
                        {newBookingForm.description && (
                          <div className="bookings-summary-row">
                            <strong>Description:</strong> {newBookingForm.description}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="bookings-form-actions">
                    <button
                      className="bookings-btn-secondary"
                      onClick={() => {
                        setNewBookingModalOpen(false);
                        resetNewBookingForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="bookings-btn-primary"
                      onClick={handleCreateBooking}
                      disabled={!isNewBookingFormValid() || isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Booking'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && selectedBooking && (
          <div className="bookings-modal-overlay" onClick={() => setEditModalOpen(false)}>
            <div className="bookings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bookings-modal-header">
                <h2>Edit Session</h2>
                <button 
                  className="bookings-modal-close"
                  onClick={() => setEditModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bookings-modal-content">
                <div className="bookings-edit-form">
                  <div className="bookings-form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                      className="bookings-form-input"
                    />
                  </div>
                  
                  <div className="bookings-form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      className="bookings-form-input"
                    />
                  </div>
                  
                  <div className="bookings-form-group">
                    <label>Duration</label>
                    <select
                      value={editForm.duration}
                      onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                      className="bookings-form-select"
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1.5 hours">1.5 hours</option>
                      <option value="2 hours">2 hours</option>
                      <option value="2.5 hours">2.5 hours</option>
                      <option value="3 hours">3 hours</option>
                    </select>
                  </div>
                  
                  <div className="bookings-form-group">
                    <label>Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="bookings-form-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      {/* Add other statuses as needed */}
                    </select>
                  </div>
                  
                  {editForm.status === 'completed' && (
                    <div className="bookings-form-group">
                      <label>Rating</label>
                      <input
                        type="number"
                        value={editForm.rating ?? ''}
                        onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value) || 0})}
                        className="bookings-form-input"
                        min="0" max="5" step="0.1"
                      />
                    </div>
                  )}
                  
                  <div className="bookings-form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={editForm.isRecurring}
                        onChange={(e) => setEditForm({...editForm, isRecurring: e.target.checked})}
                      />
                      Recurring Session
                    </label>
                  </div>
                  
                  <div className="bookings-form-group">
                    <label>Description</label>
                    <textarea
                      value={editForm.description ?? ''}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="bookings-form-textarea"
                      rows={3}
                    />
                  </div>
                  
                  <div className="bookings-form-actions">
                    <button
                      className="bookings-btn-secondary"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bookings-btn-primary"
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmationModalOpen && bookingToDelete && (
          <div className="bookings-modal-overlay" onClick={() => setDeleteConfirmationModalOpen(false)}>
            <div className="bookings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bookings-modal-header">
                <h2>Confirm Cancellation</h2>
                <button 
                  className="bookings-modal-close"
                  onClick={() => setDeleteConfirmationModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bookings-modal-content">
                <p>Are you sure you want to cancel this booking? This action is irreversible.</p>
                <div className="bookings-modal-actions">
                  <button
                    className="bookings-btn-secondary"
                    onClick={() => setDeleteConfirmationModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bookings-btn-primary"
                    onClick={() => {
                      handleDeleteBooking(bookingToDelete);
                      setDeleteConfirmationModalOpen(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModalOpen && (
          <div className="bookings-modal-overlay" onClick={() => setMessageModalOpen(false)}>
            <div className="bookings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bookings-modal-header">
                <h2>{messageModalContent.title}</h2>
                <button 
                  className="bookings-modal-close"
                  onClick={() => setMessageModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bookings-modal-content">
                <p>{messageModalContent.body}</p>
                <div className="bookings-modal-actions">
                  <button
                    className="bookings-btn-primary"
                    onClick={() => setMessageModalOpen(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterOne />
    </>
  );
}

export default BookingsPage;