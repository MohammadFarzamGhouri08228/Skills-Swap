"use client"
import Link from 'next/link';
import React from 'react';

const NavMenu = () => {
  return (
    <>
      <ul>
        <li className="has-dropdown menu-thumb">
          <Link href="/">
              <span className="head-icon"><i className="fas fa-home"></i></span>
              Home
          </Link>
        </li>
        <li className="has-dropdown menu-thumb">
          <Link href="/about">
              <span className="head-icon"><i className="fas fa-info-circle"></i></span>
              About
          </Link>
        </li>
        <li className="has-dropdown menu-thumb">
          <Link href="/courses">
              <span className="head-icon"><i className="fas fa-graduation-cap"></i></span>
              Skills
              <i className="fas fa-chevron-down"></i>
          </Link>
          <ul className="submenu">
            <li><Link href="/courses">All Skills</Link></li>
            <li><Link href="/courses-grid">Skills Grid</Link></li>
            <li><Link href="/courses-list">Skills List</Link></li>
            <li><Link href="/courses-details">Skill Details</Link></li>
          </ul>
        </li>
        <li className="has-dropdown menu-thumb">
          <Link href="/instructor">
              <span className="head-icon"><i className="fas fa-chalkboard-teacher"></i></span>
              Mentors
              <i className="fas fa-chevron-down"></i>
          </Link>
          <ul className="submenu">
            <li><Link href="/instructor">All Mentors</Link></li>
            <li><Link href="/instructor-details">Mentor Details</Link></li>
          </ul>
        </li>
        <li className="has-dropdown menu-thumb">
          <Link href="/news">
              <span className="head-icon"><i className="fas fa-newspaper"></i></span>
              Blog
              <i className="fas fa-chevron-down"></i>
          </Link>
          <ul className="submenu">
            <li><Link href="/news">Blog</Link></li>
            <li><Link href="/news-details">Blog Details</Link></li>
          </ul>
        </li>
        <li className="has-dropdown menu-thumb">
          <Link href="/contact">
              <span className="head-icon"><i className="fas fa-envelope"></i></span>
              Contact
          </Link>
        </li>
      </ul>
    </>
  );
};

export default NavMenu; 