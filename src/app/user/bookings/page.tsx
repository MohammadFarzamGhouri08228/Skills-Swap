'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Filter, Search, Star, ChevronLeft, ChevronRight, Eye, Edit, Trash2, MessageCircle, RefreshCw, ArrowLeftRight, Timer } from 'lucide-react';

// Import Header and Footer components (assuming they exist elsewhere)
import HeaderOne from '@/layouts/headers/HeaderOne'; // Example import path
import FooterOne from '@/layouts/footers/FooterOne'; // Example import path

// Mock data for SkillSwap bookings
const mockBookings = [
  {
    id: 1,
    mySkill: "Web Development",
    partnerSkill: "Graphic Design",
    partner: "Sarah Johnson",
    date: "2024-06-15",
    time: "10:00 AM",
    status: "confirmed",
    location: "Online",
    rating: 4.8,
    isRecurring: true,
    frequency: "Weekly",
    duration: "2 hours",
    nextSession: "2024-06-22"
  },
  {
    id: 2,
    mySkill: "Guitar Playing",
    partnerSkill: "Piano Lessons",
    partner: "Mike Chen",
    date: "2024-06-18",
    time: "2:30 PM",
    status: "pending",
    location: "Music Studio Downtown",
    rating: 4.9,
    isRecurring: false,
    frequency: null,
    duration: "1.5 hours",
    nextSession: null
  },
  {
    id: 3,
    mySkill: "Digital Marketing",
    partnerSkill: "Content Writing",
    partner: "Emma Davis",
    date: "2024-06-20",
    time: "9:00 AM",
    status: "confirmed",
    location: "Coffee House Central",
    rating: 4.7,
    isRecurring: true,
    frequency: "Bi-weekly",
    duration: "2 hours",
    nextSession: "2024-07-04"
  },
  {
    id: 4,
    mySkill: "Photography",
    partnerSkill: "Video Editing",
    partner: "Alex Rodriguez",
    date: "2024-06-22",
    time: "11:00 AM",
    status: "completed",
    location: "City Park",
    rating: 5.0,
    isRecurring: true,
    frequency: "Daily",
    duration: "1 hour",
    nextSession: "2024-06-23"
  },
  {
    id: 5,
    mySkill: "Cooking",
    partnerSkill: "Baking",
    partner: "Lisa Wang",
    date: "2024-06-25",
    time: "6:00 PM",
    status: "confirmed",
    location: "Community Kitchen",
    rating: 4.6,
    isRecurring: true,
    frequency: "Weekly",
    duration: "3 hours",
    nextSession: "2024-07-02"
  }
];

function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleAction = (action: string, bookingId: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`${action} booking ${bookingId}`);
      setIsLoading(false);
    }, 1000);
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
                            
                            <div className="bookings-meta-item">
                              <Calendar className="bookings-meta-icon" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="bookings-meta-item">
                              <Clock className="bookings-meta-icon" />
                              <span>{booking.time}</span>
                            </div>
                            
                            <div className="bookings-meta-item">
                              <Timer className="bookings-meta-icon" />
                              <span>{booking.duration}</span>
                            </div>
                            
                            <div className="bookings-meta-item">
                              <MapPin className="bookings-meta-icon" />
                              <span>{booking.location}</span>
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
                                {new Date(booking.nextSession).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bookings-card-actions">
                          <button
                            className="bookings-action-btn bookings-btn-primary"
                            onClick={() => handleAction('view', booking.id)}
                          >
                            <Eye size={16} />
                            View
                          </button>
                          
                          <button
                            className="bookings-action-btn bookings-btn-secondary"
                            onClick={() => handleAction('message', booking.id)}
                          >
                            <MessageCircle size={16} />
                            Message
                          </button>
                          
                          {booking.status !== 'completed' && (
                            <button
                              className="bookings-action-btn bookings-btn-accent"
                              onClick={() => handleAction('edit', booking.id)}
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

        {/* Placeholder for Footer Component */}
        <FooterOne />
      </div>
    </>
  );
}

export default BookingsPage;