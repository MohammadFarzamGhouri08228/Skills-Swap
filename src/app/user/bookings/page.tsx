'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Filter, Search, Star, ChevronLeft, ChevronRight, Eye, Edit, Trash2, MessageCircle, RefreshCw, ArrowLeftRight, Timer, Plus, X } from 'lucide-react';

// Import Header and Footer components (assuming they exist elsewhere)
import HeaderOne from '@/layouts/headers/HeaderOne'; // Example import path
import FooterOne from '@/layouts/footers/FooterOne'; // Example import path

// Define an interface for the Booking object
interface Booking {
  id: number;
  mySkill: string;
  partnerSkill: string;
  partner: string;
  date: string;
  time: string;
  status: string;
  rating: number;
  isRecurring: boolean;
  frequency: string | null;
  duration: string;
  nextSession: string | null;
  description: string;
}

// Mock data for SkillSwap bookings
const mockBookings: Booking[] = [
  {
    id: 1,
    mySkill: "Web Development",
    partnerSkill: "Graphic Design",
    partner: "Sarah Johnson",
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
    id: 2,
    mySkill: "Guitar Playing",
    partnerSkill: "Piano Lessons",
    partner: "Mike Chen",
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
    id: 3,
    mySkill: "Digital Marketing",
    partnerSkill: "Content Writing",
    partner: "Emma Davis",
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
    id: 4,
    mySkill: "Photography",
    partnerSkill: "Video Editing",
    partner: "Alex Rodriguez",
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
    id: 5,
    mySkill: "Cooking",
    partnerSkill: "Baking",
    partner: "Lisa Wang",
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

function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});
  const itemsPerPage = 6;
  const [mounted, setMounted] = useState(false);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.mySkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.partnerSkill.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.partner.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Navigate to Skills List page
    window.location.href = '/skills'; // or use router.push('/skills') if using Next.js router
  };

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      frequency: booking.frequency,
      isRecurring: booking.isRecurring,
      description: booking.description
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedBooking) {
        const updatedBookings = bookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, ...editForm }
            : booking
        );
        setBookings(updatedBookings);
        setEditModalOpen(false);
      }
      setIsLoading(false);
    }, 1000);
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
                <p className="bookings-subtitle">Manage your skill exchange sessions and partnerships</p>
              </div>
              
              {/* Stats Cards */}
              <div className="bookings-stats">
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">12</div>
                  <div className="bookings-stat-label">Total Sessions</div>
                </div>
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">8</div>
                  <div className="bookings-stat-label">Completed</div>
                </div>
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">3</div>
                  <div className="bookings-stat-label">Active Partners</div>
                </div>
                <div className="bookings-stat-card">
                  <div className="bookings-stat-number">4.8</div>
                  <div className="bookings-stat-label">Avg Rating</div>
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
                    placeholder="Search sessions or partners..."
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
                              <span>{booking.partner}</span>
                            </div>
                            
                            <div className="bookings-datetime-section">
                              <div className="bookings-meta-item bookings-datetime">
                                <Calendar className="bookings-meta-icon" />
                                <span className="bookings-datetime-text">
                                  {formatDateTime(booking.date, booking.time)}
                                </span>
                              </div>
                              
                              <div className="bookings-meta-item bookings-duration">
                                <Timer className="bookings-meta-icon" />
                                <span className="bookings-duration-text">{booking.duration}</span>
                              </div>
                            </div>
                            
                            <div className="bookings-meta-item">
                              <Star className="bookings-meta-icon" />
                              <span>{booking.rating}</span>
                            </div>
                          </div>

                          {booking.isRecurring && booking.nextSession && (
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
                            className="bookings-action-btn bookings-btn-primary"
                            onClick={() => handleView(booking)}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          
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

        {/* View Modal */}
        {viewModalOpen && selectedBooking && (
          <div className="bookings-modal-overlay" onClick={() => setViewModalOpen(false)}>
            <div className="bookings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bookings-modal-header">
                <h2>Session Details</h2>
                <button 
                  className="bookings-modal-close"
                  onClick={() => setViewModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bookings-modal-content">
                <div className="bookings-view-details">
                  <div className="bookings-view-section">
                    <h3>Skill Exchange</h3>
                    <div className="bookings-view-skills">
                      <div>
                        <strong>You teach:</strong> {selectedBooking.mySkill}
                      </div>
                      <div>
                        <strong>You learn:</strong> {selectedBooking.partnerSkill}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bookings-view-section">
                    <h3>Session Info</h3>
                    <div className="bookings-view-info">
                      <div><strong>Partner:</strong> {selectedBooking.partner}</div>
                      <div><strong>Date & Time:</strong> {formatDateTime(selectedBooking.date, selectedBooking.time)}</div>
                      <div><strong>Duration:</strong> {selectedBooking.duration}</div>
                      <div><strong>Status:</strong> {selectedBooking.status}</div>
                      <div><strong>Rating:</strong> {selectedBooking.rating}/5</div>
                      {selectedBooking.isRecurring && (
                        <>
                          <div><strong>Type:</strong> Recurring ({selectedBooking.frequency})</div>
                          {selectedBooking.nextSession && (
                            <div><strong>Next Session:</strong> {formatDateTime(selectedBooking.nextSession, selectedBooking.time)}</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {selectedBooking.description && (
                    <div className="bookings-view-section">
                      <h3>Description</h3>
                      <p>{selectedBooking.description}</p>
                    </div>
                  )}
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
                    <label>
                      <input
                        type="checkbox"
                        checked={editForm.isRecurring}
                        onChange={(e) => setEditForm({...editForm, isRecurring: e.target.checked})}
                      />
                      Recurring Session
                    </label>
                  </div>
                  
                  {editForm.isRecurring && (
                    <div className="bookings-form-group">
                      <label>Frequency</label>
                      <select
                        value={editForm.frequency ?? ''}
                        onChange={(e) => setEditForm({...editForm, frequency: e.target.value})}
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

        {/* Placeholder for Footer Component */}
        <FooterOne />
      </div>
    </>
  );
}

export default BookingsPage;