// src/createCollections.js
import { db } from './firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Function to create bookings collection
export const createBookingsCollection = async () => {
  try {
    console.log('🚀 Creating bookings collection...');
    
    const docRef = await addDoc(collection(db, 'bookings'), {
      participants: {
        teacher1: {
          userId: "demo-user-001",
          skillOffered: "React Development"
        },
        teacher2: {
          userId: "demo-user-002", 
          skillOffered: "UI/UX Design"
        }
      },
      timeSlot: {
        startTime: new Date('2024-06-20T15:00:00'),
        endTime: new Date('2024-06-20T16:00:00'),
        duration: 60
      },
      status: "pending",
      location: "Virtual - Google Meet",
      createdAt: serverTimestamp(),
      notes: "Demo booking to initialize collection"
    });
    
    console.log('✅ Bookings collection created successfully!');
    console.log('Document ID:', docRef.id);
    return docRef.id;
    
  } catch (error) {
    console.error('❌ Error creating bookings collection:', error);
    throw error;
  }
};

// Function to create all collections at once
export const createAllCollections = async () => {
  try {
    console.log('🚀 Creating all collections...');
    
    // Create bookings
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      participants: {
        teacher1: { userId: "user-001", skillOffered: "JavaScript" },
        teacher2: { userId: "user-002", skillOffered: "Python" }
      },
      timeSlot: {
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        duration: 60
      },
      status: "pending",
      location: "Online",
      createdAt: serverTimestamp(),
      notes: "Sample booking"
    });

    // Create timeSlots
    const slotRef = await addDoc(collection(db, 'timeSlots'), {
      userId: "user-001",
      skillOffered: "Web Development",
      skillWanted: "Mobile Development",
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      isBooked: false,
      location: "Coffee Shop",
      createdAt: serverTimestamp()
    });

    // Create users
    const userRef = await addDoc(collection(db, 'users'), {
      name: "John Doe",
      email: "john@example.com",
      skills: ["JavaScript", "React", "Node.js"],
      skillsWanted: ["Python", "Django"],
      rating: 4.5,
      profileImage: "",
      createdAt: serverTimestamp()
    });

    console.log('✅ All collections created successfully!');
    console.log('Bookings ID:', bookingRef.id);
    console.log('TimeSlots ID:', slotRef.id);
    console.log('Users ID:', userRef.id);
    
    return {
      bookingId: bookingRef.id,
      slotId: slotRef.id,
      userId: userRef.id
    };
    
  } catch (error) {
    console.error('❌ Error creating collections:', error);
    throw error;
  }
};