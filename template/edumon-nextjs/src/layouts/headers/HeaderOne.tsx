
"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import NavMenu from './NavMenu'
import MobileMenu from './MobileMenu'

export default function HeaderOne() {

  const [open, setOpen] = useState(false)
  const [opneMenu, setOpneMenu] = useState(false)

  return (
    <>
      <header id="navigation">
        <div className="container-fluid">
          <div className="row">
            <div className="col-30 left-col align-self-center rk_style">
              <div className="site-logo">
                <Link href="/"><img src="assets/img/logo.svg" alt="Edumon" /></Link>
              </div>

              <div className="course_cat">
                <ul className="cat_list">
                  <li><a href="#">Category <i className='bx bx-chevron-down'></i></a>
                    <ul className="sub-menu">
                      <li><a href="#"><i className='bx bx-code-curly' ></i>Web Design</a></li>
                      <li><a href="#"><i className='bx bx-heart' ></i> Fitness</a></li>
                      <li><a href="#"><i className='bx bxl-wordpress'></i> WordPress</a></li>
                      <li><a href="#"><i className='bx bxl-react' ></i> React</a></li>
                      <li><a href="#"><i className='bx bxl-shopify' ></i> Shopify</a></li>
                      <li><a href="#"><i className='bx bxl-java' ></i> Java</a></li>
                      <li><a href="#"><i className='bx bxl-php' ></i> PHP</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-40 justify-content-center d-flex align-self-center">
              <nav id="main-menu">
                <NavMenu />
              </nav>
            </div>

            <div className="col-30 right-col align-self-center text-end">
              <div className="searchcart">
                <a style={{ cursor: "pointer" }} onClick={() => setOpen(!open)} className="sicon search-btn">
                  <svg fill="none" viewBox="0 0 20 20"><path fill="#fff" d="M7.536.044a8.418 8.418 0 00-5.1 2.434C1.476 3.44.826 4.487.413 5.745a8.018 8.018 0 000 5.08 7.977 7.977 0 002.03 3.27c1.906 1.896 4.503 2.756 7.182 2.377a8.529 8.529 0 003.846-1.579c.117-.09.223-.156.239-.152.015.008 1.198 1.164 2.628 2.57 1.628 1.603 2.655 2.584 2.749 2.627a.627.627 0 00.89-.47c.063-.327.281-.093-3.999-4.32l-1.335-1.322.226-.265c.976-1.13 1.62-2.56 1.867-4.123.094-.61.094-1.727 0-2.345-.277-1.793-1.062-3.333-2.37-4.634A8.463 8.463 0 007.536.044zm1.87 1.309c1.578.23 2.964.918 4.061 2.012 1.344 1.349 2.043 3.025 2.043 4.92 0 .7-.063 1.18-.227 1.786-.828 3.08-3.635 5.209-6.869 5.209-1.925 0-3.713-.73-5.049-2.067a6.958 6.958 0 01-1.84-3.17c-.288-1.082-.288-2.434 0-3.516A7.082 7.082 0 016.572 1.52c.89-.23 1.98-.297 2.835-.168z" /></svg>
                </a>
                <div className="cart-icon">
                  <a href="#" className="mcart_open" data-menu="#mini_cart"><svg fill="none" viewBox="0 0 17 19"><path fill="#fff" d="M7.465.072C5.288.345 3.627 2.132 3.627 4.21v.446l-.811.018c-.777.013-.829.017-1.063.13A1.656 1.656 0 00.807 6.01c-.073.442-.832 11.316-.806 11.576.052.53.494 1.106 1.015 1.314l.247.1h13.489l.247-.1c.52-.208.963-.785 1.015-1.314.026-.26-.733-11.13-.807-11.572a1.786 1.786 0 00-.139-.451c-.143-.29-.485-.612-.784-.75-.26-.122-.296-.126-1.08-.14l-.816-.017v-.35c-.004-1.05-.477-2.157-1.258-2.942A4.32 4.32 0 008.484.068a3.492 3.492 0 00-1.019.004zm1.301 1.453C10.03 1.845 11 3.073 11 4.348v.317H5.015v-.317c0-.177.039-.468.082-.646a3.01 3.01 0 013.67-2.177zM3.648 7.883l-.03 1.835.1.148c.147.212.303.312.525.338.251.03.511-.1.646-.321l.104-.165.013-1.835.013-1.83h5.977l.013 1.83.013 1.835.104.165a.678.678 0 00.646.32c.217-.02.377-.125.52-.333.096-.143.096-.148.096-1.978V6.053h.672c.647 0 .673.004.733.095.048.074.16 1.475.46 5.713l.4 5.617-.096.078c-.091.073-.39.078-6.55.078-6.159 0-6.458-.005-6.549-.078l-.095-.078.399-5.617c.299-4.238.412-5.639.46-5.713.06-.09.082-.095.758-.095h.699l-.03 1.83z" /></svg></a>
                  <span>3</span>
                </div>
              </div>
              <a href="#" className="white-btn bt">Login / Register</a>
            </div>

          </div>
        </div>

        <div id="mini_cart" className="cart_drawer">
          <div className="cart_top">
            <a href="#" className="cart_close"><i className='bx bx-x'></i></a>
            <h3 className="title">Courses List</h3>
            <span className="cart_number">
              3
            </span>
          </div>

          <div className="mini_cart_list">
            <ul>
              <li className="d-flex">
                <div className="thumb_img_cartmini">
                  <a href="course-details.html" className="mc_img">
                    <img src="assets/img/mcart/1.jpg" alt="Product Name" />
                  </a>
                </div>

                <div className="product-detail">
                  <h3 className="product_name_mini">
                    <a href="course-details.html">
                      Photography Crash Course
                    </a>
                  </h3>
                  <div className="product_info">
                    <div className="product_quanity">QTY : 1 </div>
                    <div className="product_price">
                      <span className="price_sale">$25.00</span>
                    </div>
                  </div>
                </div>

                <div className="produc_remove">
                  <a href="#" className="remove-product">
                    <i className='bx bx-trash'></i>
                  </a>
                </div>
              </li>

              <li className="d-flex">
                <div className="thumb_img_cartmini">
                  <a href="course-details.html" className="mc_img">
                    <img src="assets/img/mcart/2.jpg" alt="Product Name" />
                  </a>
                </div>

                <div className="product-detail">
                  <h3 className="product_name_mini">
                    <a href="course-details.html">
                      Photography Crash Course
                    </a>
                  </h3>
                  <div className="product_info">
                    <div className="product_quanity">QTY : 1 </div>
                    <div className="product_price">
                      <span className="price_sale">$25.00</span>
                    </div>
                  </div>
                </div>

                <div className="produc_remove">
                  <a href="#" className="remove-product">
                    <i className='bx bx-trash'></i>
                  </a>
                </div>
              </li>

              <li className="d-flex">
                <div className="thumb_img_cartmini">
                  <a href="course-details.html" className="mc_img">
                    <img src="assets/img/mcart/3.jpg" alt="Product Name" />
                  </a>
                </div>

                <div className="product-detail">
                  <h3 className="product_name_mini">
                    <a href="course-details.html">
                      Photography Crash Course
                    </a>
                  </h3>
                  <div className="product_info">
                    <div className="product_quanity">QTY : 1 </div>
                    <div className="product_price">
                      <span className="price_sale">$25.00</span>
                    </div>
                  </div>
                </div>

                <div className="produc_remove">
                  <a href="#" className="remove-product">
                    <i className='bx bx-trash'></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="cart_drawer_btm">
            <div className="sub-total">
              <span className="total-title float-start">Total:</span>
              <span className="total-price float-end">$75.00</span>
            </div>

            <div className="bottom_group">
              <a href="cart.html" className="button-viewcart">
                <span>View Cart</span>
              </a>
              <a href="checkout.html" className="button-checkout">
                <span>Checkout</span>
              </a>
            </div>
          </div>
        </div>

        <div className={`search_box ${open ? "active" : ""}`}>
          <div className="close-btn" onClick={() => setOpen(false)} style={{display: open ? "block" : "none"}}>
            <i className="ti-close"></i>
          </div>

          <div className="search-data" style={{display: open ? "block" : "none"}}>
            <form onSubmit={e => e.preventDefault()}>
              <input type="text" required />
              <div className={`line ${open ? "active" : ""}`}></div>
              <label style={{display: open ? "block" : "none"}}>Type to search..</label>
              <button type="submit">
                <span className="ti-search" style={{display: open ? "block" : "none"}}></span>
              </button>
            </form>
          </div>
        </div>

        <div id="sm_menu_ham" className={`${opneMenu ? "open" : ""}`} onClick={() => setOpneMenu(!opneMenu)}><span></span><span></span><span></span><span></span></div>
        <MobileMenu opneMenu={opneMenu} />

      </header>
    </>
  )
}
