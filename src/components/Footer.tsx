import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer_wrap bg_tint_dark footer_style_dark widget_area">
      <div className="content_wrap">
        <div className="columns_wrap">
          {/* 1st column */}
          <aside className="column-1_4 widget widget_text">
            <h5 className="widget_title">About SkillSwap</h5>
            <div className="textwidget">
              <p>SkillSwap is a platform where you can share your skills and learn from others. Our mission is to create a community of lifelong learners who help each other grow through knowledge exchange.</p>
            </div>
          </aside>

          {/* 2nd column */}
          <aside className="column-1_4 widget widget_nav_menu">
            <h5 className="widget_title">Quick Links</h5>
            <div className="menu-footer-quick-links-container">
              <ul id="menu-footer-quick-links" className="menu">
                <li className="menu-item"><Link href="/courses">Courses</Link></li>
                <li className="menu-item"><Link href="/teachers">Teachers</Link></li>
                <li className="menu-item"><Link href="/about">About Us</Link></li>
                <li className="menu-item"><Link href="/contact">Contact</Link></li>
                <li className="menu-item"><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
          </aside>

          {/* 3rd column */}
          <aside className="column-1_4 widget widget_text">
            <h5 className="widget_title">Contact Info</h5>
            <div className="textwidget">
              <p><i className="icon-home"></i> 123 Education Street<br />
              Knowledge City, 12345</p>
              <p><i className="icon-phone"></i> (123) 456-7890</p>
              <p><i className="icon-mail"></i> <a href="mailto:info@skillswap.com">info@skillswap.com</a></p>
            </div>
          </aside>

          {/* 4th column */}
          <aside className="column-1_4 widget widget_text">
            <h5 className="widget_title">Follow Us</h5>
            <div className="textwidget">
              <div className="social-icons">
                <a href="https://facebook.com" className="social_icons social_facebook" target="_blank" rel="noopener noreferrer">
                  <span className="icon-facebook"></span>
                </a>
                <a href="https://twitter.com" className="social_icons social_twitter" target="_blank" rel="noopener noreferrer">
                  <span className="icon-twitter"></span>
                </a>
                <a href="https://linkedin.com" className="social_icons social_linkedin" target="_blank" rel="noopener noreferrer">
                  <span className="icon-linkedin"></span>
                </a>
                <a href="https://instagram.com" className="social_icons social_instagram" target="_blank" rel="noopener noreferrer">
                  <span className="icon-instagram"></span>
                </a>
              </div>
              <div className="newsletter">
                <h6>Subscribe to our newsletter</h6>
                <form className="newsletter_form">
                  <input type="email" className="newsletter_email" placeholder="Your email" />
                  <button type="submit" className="newsletter_submit icon-paper-plane-empty"></button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright_wrap">
        <div className="content_wrap">
          <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 