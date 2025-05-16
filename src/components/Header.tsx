import Link from 'next/link';

export default function Header() {
  return (
    <header className="top_panel_wrap bg_tint_dark">
      {/* User menu */}
      <div className="menu_user_wrap">
        <div className="content_wrap clearfix">
          <div className="menu_user_area menu_user_right menu_user_nav_area">
            <ul id="menu_user" className="menu_user_nav">
              <li className="menu_user_bookmarks">
                <a href="#" className="bookmarks_show icon-star-1" title="Show bookmarks"></a>
                <ul className="bookmarks_list">
                  <li><a href="#" className="bookmarks_add icon-star-empty" title="Add the current page into bookmarks">Add bookmark</a></li>
                </ul>
              </li>
              <li className="menu_user_controls">
                <a href="#">
                  <span className="user_avatar">
                    <img alt="" src="http://1.gravatar.com/avatar/45e4d63993e55fa97a27d49164bce80f?s=16&#038;d=mm&#038;r=g" srcSet="http://1.gravatar.com/avatar/45e4d63993e55fa97a27d49164bce80f?s=32&amp;d=mm&amp;r=g 2x" className="avatar avatar-16 photo" height="16" width="16" />
                  </span>
                  <span className="user_name">John Doe</span>
                </a>
                <ul>
                  <li><a href="#" className="icon icon-doc-inv">New post</a></li>
                  <li><a href="#" className="icon icon-cog-1">Settings</a></li>
                </ul>
              </li>
              <li className="menu_user_logout">
                <a href="#" className="icon icon-logout">Logout</a>
              </li>
            </ul>
          </div>
          <div className="menu_user_area menu_user_left menu_user_contact_area">Contact us on 0 800 123-4567 or <a href="mailto:support@example.com">support@example.com</a></div>
        </div>
      </div>
      {/* /User menu */}
      
      {/* Main menu */}
      <div className="menu_main_wrap logo_left">
        <div className="content_wrap clearfix">
          {/* Logo */}
          <div className="logo">
            <Link href="/" className="logo_text">
              <span className="logo_text_1">Skill</span>
              <span className="logo_text_2">Swap</span>
            </Link>
          </div>
          {/* /Logo */}
          
          {/* Search */}
          <div className="search_wrap search_style_regular search_ajax" title="Open/close search form">
            <a href="#" className="search_icon icon-search-2"></a>
            <div className="search_form_wrap">
              <form method="get" className="search_form" action="#">
                <button type="submit" className="search_submit icon-zoom-1" title="Start search"></button>
                <input type="text" className="search_field" placeholder="" name="s" title="" />
              </form>
            </div>
            <div className="search_results widget_area bg_tint_light">
              <a className="search_results_close icon-delete-2"></a>
              <div className="search_results_content"></div>
            </div>
          </div>
          {/* /Search */}
          
          {/* Navigation */}
          <a href="#" className="menu_main_responsive_button icon-menu-1"></a>
          <nav className="menu_main_nav_area">
            <ul id="menu_main" className="menu_main_nav">
              <li className="menu-item menu-item-has-children current-menu-ancestor current-menu-parent">
                <Link href="/">Home</Link>
              </li>
              <li className="menu-item menu-item-has-children">
                <Link href="/courses">Courses</Link>
                <ul className="sub-menu">
                  <li className="menu-item"><Link href="/courses">All courses</Link></li>
                  <li className="menu-item"><Link href="/courses/free">Free courses</Link></li>
                  <li className="menu-item"><Link href="/courses/paid">Paid courses</Link></li>
                </ul>
              </li>
              <li className="menu-item menu-item-has-children">
                <Link href="/teachers">Teachers</Link>
                <ul className="sub-menu">
                  <li className="menu-item"><Link href="/teachers">Teachers Team</Link></li>
                  <li className="menu-item"><Link href="/teachers/profile">Teacher's Profile</Link></li>
                </ul>
              </li>
              <li className="menu-item">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="menu-item">
                <Link href="/about">About</Link>
              </li>
              <li className="menu-item">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          {/* /Navigation */}
        </div>
      </div>
      {/* /Main menu */}
    </header>
  );
} 