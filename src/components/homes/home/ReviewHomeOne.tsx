"use client";
import React, { useEffect, useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


export default function ReviewHomeOne() {

  return (
    <>

      <section className="review section-padding">
        <div className="container">
          <div className="row">
            <div className="col-10 wow fadeInUp">
              <div className="section-title">
                <span>Our Students Review</span>
                <h2>What Our Students Are Says</h2>
              </div>
            </div>

            <div className="col-xl-12 wow fadeIn">
              <div className="review-slider owl-carousel owl-loaded owl-drag">
                
                <Swiper
                   
                  slidesPerView={3}
                  spaceBetween={30}
                  loop={true} 
                  pagination={{el: ".owl-dots", clickable: true}}
                  modules={[Autoplay, Navigation, Pagination]}
                  navigation={{ nextEl: '.owl-next', prevEl: '.owl-prev' }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  centeredSlides={true} 
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1200: {
                      slidesPerView: 3,
                    },
                  }}
                  className="owl-stage-outer">

                  <SwiperSlide
                    className="owl-item"
                    style={{ width: "408.667px", marginRight: "35px" }}
                  >
                    <div className="review-item">
                      <div className="rimage">
                        <img src="assets/img/review/3.jpg" alt="review" />
                        <span className="rating-number">5.00</span>
                      </div>

                      <div className="rev-content">
                        <h4>Motasim Billah</h4>
                        <p>
                          Donec viverra posuere nibh in dapibus. Pellentesque
                          finibus libero vel tempus
                        </p>

                        <div className="rev-rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide
                    className="owl-item"
                    style={{ width: "408.667px", marginRight: "35px" }}
                  >
                    <div className="review-item">
                      <div className="rimage">
                        <img src="assets/img/review/1.jpg" alt="review" />
                        <span className="rating-number">5.00</span>
                      </div>

                      <div className="rev-content">
                        <h4>Masum BIllah</h4>
                        <p>
                          Donec viverra posuere nibh in dapibus. Pellentesque
                          finibus libero vel tempus
                        </p>

                        <div className="rev-rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide
                    className="owl-item"
                    style={{ width: "408.667px", marginRight: "35px" }}
                  >
                    <div className="review-item">
                      <div className="rimage">
                        <img src="assets/img/review/3.jpg" alt="review" />
                        <span className="rating-number">5.00</span>
                      </div>

                      <div className="rev-content">
                        <h4>Motasim Billah</h4>
                        <p>
                          Donec viverra posuere nibh in dapibus. Pellentesque
                          finibus libero vel tempus
                        </p>

                        <div className="rev-rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide
                    className="owl-item"
                    style={{ width: "408.667px", marginRight: "35px" }}
                  >
                    <div className="review-item">
                      <div className="rimage">
                        <img src="assets/img/review/1.jpg" alt="review" />
                        <span className="rating-number">5.00</span>
                      </div>

                      <div className="rev-content">
                        <h4>Masum BIllah</h4>
                        <p>
                          Donec viverra posuere nibh in dapibus. Pellentesque
                          finibus libero vel tempus
                        </p>

                        <div className="rev-rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide
                    className="owl-item"
                    style={{ width: "408.667px", marginRight: "35px" }}
                  >
                    <div className="review-item">
                      <div className="rimage">
                        <img src="assets/img/review/2.jpg" alt="review" />
                        <span className="rating-number">5.00</span>
                      </div>

                      <div className="rev-content">
                        <h4>Ekram Hossain</h4>
                        <p>
                          Donec viverra posuere nibh in dapibus. Pellentesque
                          finibus libero vel tempus
                        </p>

                        <div className="rev-rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                   

                </Swiper>

                <div className="owl-nav">
                  <button
                    type="button"
                    role="presentation"
                    className="owl-prev"
                  >
                    <i className="bx bx-chevrons-left"></i>
                  </button>
                  <button
                    type="button"
                    role="presentation"
                    className="owl-next"
                  >
                    <i className="bx bx-chevrons-right"></i>
                  </button>
                </div>

                <div className="owl-dots"> 
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </section>
    </>
  );
}
