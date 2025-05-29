import { createBookingsCollection } from './createCollections.js';
import './firebase.js'; // This ensures Firebase app is initialized before createCollections is called.

const executeCreateBookings = async () => {
  try {
    console.log("SCRIPT: Attempting to create bookings collection in Firebase...");
    const bookingId = await createBookingsCollection();
    if (bookingId) {
      console.log(`SCRIPT: ✅ Successfully created bookings collection. Document ID: ${bookingId}`);
    } else {
      console.log("SCRIPT: ⚠️ createBookingsCollection ran, but did not return a booking ID.");
    }
  } catch (error) {
    console.error("SCRIPT: ❌ Error running createBookingsCollection:", error);
  }
};

executeCreateBookings(); 