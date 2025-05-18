import Link from 'next/link';
import React from 'react';

const FooterOne = ({style_2} : any) => {
  return (
    <>
       <footer className={`footer-section fix ${style_2 ? "" : "footer-bg"}`}>
            <div className="container">
                <div className={`footer-widget-wrapper ${style_2 ? "style-4" : ""}`}>
                    <div className="row">
                        <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                            <div className="single-footer-widget">
                                <div className="widget-head">
                                    <Link href="/">
                                        {style_2 ? <img src="assets/img/logo/black-logo-2.svg" alt="img" /> 
                                        :                                        
                                        <img src="assets/img/logo/white-logo.svg" alt="img" />
                                        }
                                    </Link>
                                </div>
                                <div className="footer-content">
                                    <p>
                                        SkillSwap is a platform for sharing and learning skills, empowering individuals through knowledge exchange.
                                    </p>
                                    <div className="social-icon">
                                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                                        <a href="#"><i className="fab fa-instagram"></i></a>
                                        <a href="#"><i className="fab fa-twitter"></i></a>
                                        <a href="#"><i className="fab fa-youtube"></i></a>
                                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".4s">
                            <div className="single-footer-widget">
                                <div className="widget-head">
                                   <h3>Popular Skills</h3>
                                </div>
                                <ul className="list-area">
                                    <li><Link href="/courses">Web Development</Link></li>
                                    <li><Link href="/courses">Digital Marketing</Link></li>
                                    <li><Link href="/courses">Graphic Design</Link></li>
                                    <li><Link href="/courses">Data Science</Link></li>
                                    <li><Link href="/courses">Mobile App Development</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 ps-lg-5 wow fadeInUp" data-wow-delay=".6s">
                            <div className="single-footer-widget">
                                <div className="widget-head">
                                   <h3>Quick Links</h3>
                                </div>
                                <ul className="list-area">
                                    <li><Link href="/about">About SkillSwap</Link></li>
                                    <li><Link href="/instructor">Mentors</Link></li>
                                    <li><Link href="/courses">Popular Skills</Link></li>
                                    <li><Link href="/contact">User Reviews</Link></li>
                                    <li><Link href="/faq">FAQs</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-4 col-md-6 ps-xl-5 wow fadeInUp" data-wow-delay=".8s">
                            <div className="single-footer-widget">
                                <div className="widget-head">
                                   <h3>Contact Us</h3>
                                </div>
                                <div className="footer-content">
                                    <ul className="contact-info">
                                        <li>
                                            123 Main Street, Tech Hub
                                            San Francisco, USA
                                        </li>
                                        <li>
                                            <a href="mailto:info@skillswap.com" className="link">info@skillswap.com</a>
                                        </li>
                                        <li>
                                            <a href="tel:+0001234567">+000 (123) 4567</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`footer-bottom wow fadeInUp ${style_2 ? "style-4" : ""}`} data-wow-delay=".3s">
                    <p>Copyright © <Link href="/">SkillSwap</Link>, all rights reserved.</p>
                </div>
            </div>
            <div className={`footer-name ${style_2 ? "style-2" : ""}`}>
                <h2>
                    SkillSwap
                </h2>
            </div>
        </footer>
    </>
  );
};

export default FooterOne; 