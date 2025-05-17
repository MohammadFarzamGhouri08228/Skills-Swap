import MobileMenu from '@/layouts/headers/MobileMenu';
import Link from 'next/link';
import React from 'react';

const OffCanvas = ({setOpenCanvas, openCanvas} : any) => {
  return (
    <>
      <div className="fix-area">
            <div className={`offcanvas__info ${openCanvas ? "info-open" : ""}`}>
                <div className="offcanvas__wrapper">
                    <div className="offcanvas__content">
                        <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                            <div className="offcanvas__logo">
                                <Link href="/">
                                    <img src="assets/img/logo/black-logo.svg" alt="logo-img" />
                                </Link>
                            </div>
                            <div className="offcanvas__close" onClick={() => setOpenCanvas(false)}>
                                <button>
                                <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <h3 className="offcanvas-title">Welcome to SkillSwap!</h3>
                        <p>Share your skills, learn from others, and grow together.</p>
                        <div className="social-icon d-flex align-items-center">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                        <div className="mobile-menu fix mb-3 mean-container">
                          <MobileMenu />
                        </div>
                        <div className="offcanvas__contact">
                            <h3>Contact Information</h3>
                            <ul className="contact-list">
                                <li>
                                    <span>
                                        Address:
                                    </span>
                                    123 Main Street, Tech Hub
                                    San Francisco, USA
                                </li>
                                <li>
                                    <span>
                                        Call Us:
                                    </span>
                                    <a href="tel:+0001234567">+000 123 4567</a>
                                </li>
                                <li>
                                    <span>
                                        Email:
                                    </span>
                                    <a href="mailto:info@skillswap.com">info@skillswap.com</a>
                                </li>
                            </ul>
                            <div className="offcanvas-button">
                                <Link href="/login" className="theme-btn style-2"><i className="far fa-user"></i> Login</Link>
                                <Link href="/register" className="theme-btn yellow-btn">Join Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={`offcanvas__overlay ${openCanvas? "overlay-open" : ""}`} onClick={() => setOpenCanvas(false)}></div>
    </>
  );
};

export default OffCanvas; 