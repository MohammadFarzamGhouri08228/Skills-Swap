import React, { useState } from 'react';
import { createBookingsCollection, createAllCollections } from '../firebasecode/createCollections.js';

function App() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateBookings = async () => {
    setLoading(true);
    try {
      const docId = await createBookingsCollection();
      setResult(`✅ Success! Bookings collection created. Document ID: ${docId}`);
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleCreateAll = async () => {
    setLoading(true);
    try {
      const ids = await createAllCollections();
      setResult(`✅ All collections created! Booking: ${ids.bookingId}, Slot: ${ids.slotId}, User: ${ids.userId}`);
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔥 SkillSwap Database Setup</h1>
      <p>Click buttons to create Firebase collections:</p>
      
      <button 
        onClick={handleCreateBookings}
        disabled={loading}
        style={{ 
          padding: '15px 30px', 
          margin: '10px', 
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating...' : 'Create Bookings Collection'}
      </button>
      
      <button 
        onClick={handleCreateAll}
        disabled={loading}
        style={{ 
          padding: '15px 30px', 
          margin: '10px', 
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating...' : 'Create All Collections'}
      </button>
      
      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          color: result.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '5px',
          fontFamily: 'monospace'
        }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default App; 