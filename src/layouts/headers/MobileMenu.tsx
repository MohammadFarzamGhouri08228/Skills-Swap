"use client"
import Link from "next/link";
import React, { useState } from "react";

const MobileMenu = () => {
  const [navTitle, setNavTitle] = useState("");
  
  // openMobileMenu
  const openMobileMenu = (menu: string) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };

  return (
    <>
      <div className="mean-bar">
        <a href="#nav" className="meanmenu-reveal">
          <span>
            <span>
              <span></span>
            </span>
          </span>
        </a>
        <nav className="mean-nav">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li className="has-dropdown">
              <Link href="/courses">Skills</Link>
              <ul className="submenu" style={{ display: navTitle === "Skills" ? "block" : "none" }}>
                <li><Link href="/courses">All Skills</Link></li>
                <li><Link href="/courses-grid">Skills Grid</Link></li>
                <li><Link href="/courses-list">Skills List</Link></li>
                <li><Link href="/courses-details">Skill Details</Link></li>
              </ul>
              <a className={`mean-expand ${navTitle === "Skills" ? "mean-clicked" : ""}`} href="#" onClick={() => openMobileMenu("Skills")}>
                <i className="far fa-plus"></i>
              </a>
            </li>
            <li className="has-dropdown">
              <Link href="/instructor">Mentors</Link>
              <ul className="submenu" style={{ display: navTitle === "Mentors" ? "block" : "none" }}>
                <li><Link href="/instructor">All Mentors</Link></li>
                <li><Link href="/instructor-details">Mentor Details</Link></li>
              </ul>
              <a className={`mean-expand ${navTitle === "Mentors" ? "mean-clicked" : ""}`} href="#" onClick={() => openMobileMenu("Mentors")}>
                <i className="far fa-plus"></i>
              </a>
            </li>
            <li className="has-dropdown">
              <Link href="/news">Blog</Link>
              <ul className="submenu" style={{ display: navTitle === "Blog" ? "block" : "none" }}>
                <li><Link href="/news">Blog</Link></li>
                <li><Link href="/news-details">Blog Details</Link></li>
              </ul>
              <a className={`mean-expand ${navTitle === "Blog" ? "mean-clicked" : ""}`} href="#" onClick={() => openMobileMenu("Blog")}>
                <i className="far fa-plus"></i>
              </a>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu; 