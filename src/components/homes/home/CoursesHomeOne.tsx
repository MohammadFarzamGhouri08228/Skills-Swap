"use client"
import Link from 'next/link'
import React from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function CoursesHomeOne() {
  return (
    <>
      <section className="courses">
        <div className="container">
          <div className="row">
            <div className="col-12 wow fadeInUp">
              <div className="section-title">
                <span>Our Courses List</span>
                <h2>Most Popular Courses</h2>
              </div>
            </div>

            <div className="col-12 wow fadeIn">

              <div className="courses-slider owl-carousel owl-loaded owl-drag">
                
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={30}
                    loop={true}
                    pagination={{ clickable: true }}
                    modules={[Autoplay, Navigation]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    navigation={
                      { nextEl: '.owl-next', prevEl: '.owl-prev' }
                    }
                    breakpoints={{
                      0: {
                        slidesPerView: 1
                      },
                      768: {
                        slidesPerView: 2
                      },
                      1200: {
                        slidesPerView: 3
                      }
                    }}
                    className="courses-slider owl-carousel owl-loaded owl-drag">

                    <SwiperSlide className="single-course">
                      <div className="course-img">
                        <img src="assets/img/courses/1.jpg" alt="course image" />
                        <span className="cprice">$50.00</span>
                      </div>

                      <div className="course_content">
                        <div className="crating">
                          <a href="#">
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <span>(21)</span>
                          </a>
                        </div>
                        <h2><Link href="/course-details">Financial Security Thinking and Principles Theory</Link></h2>

                        <div className="cmeta">
                          <div className="smeta">
                            <i className='bx bx-user'></i>
                            25 Students
                          </div>

                          <div className="smeta">
                            <i className='bx bx-file'></i>
                            15 Lessons
                          </div>

                          <div className="smeta">
                            <i className='bx bx-time-five'></i>
                            1.5 Hours
                          </div>
                        </div>

                        <div className="course_btm">
                          <div className="cauthor">
                            <a href="#">
                              <img src="assets/img/review/1.jpg" alt="" />
                              <span>Masum Billah</span>
                            </a>
                          </div>

                          <div className="ccategory">
                            <a href="#">
                              WordPress
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide className="single-course">
                      <div className="course-img">
                        <img src="assets/img/courses/2.jpg" alt="course image" />
                        <span className="cprice">$50.00</span>
                      </div>

                      <div className="course_content">
                        <div className="crating">
                          <a href="#">
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <span>(21)</span>
                          </a>
                        </div>
                        <h2><Link href="/course-details">Professional Ceramic Moulding for Beginners</Link></h2>
                        <div className="cmeta">
                          <div className="smeta">
                            <i className='bx bx-user'></i>
                            25 Students
                          </div>

                          <div className="smeta">
                            <i className='bx bx-file'></i>
                            15 Lessons
                          </div>

                          <div className="smeta">
                            <i className='bx bx-time-five'></i>
                            1.5 Hours
                          </div>
                        </div>

                        <div className="course_btm">
                          <div className="cauthor">
                            <a href="#">
                              <img src="assets/img/review/1.jpg" alt="" />
                              <span>Masum Billah</span>
                            </a>
                          </div>

                          <div className="ccategory">
                            <a href="#">
                              JavaScript
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide className="single-course">
                      <div className="course-img">
                        <img src="assets/img/courses/3.jpg" alt="course image" />
                        <span className="cprice">$50.00</span>
                      </div>

                      <div className="course_content">
                        <div className="crating">
                          <a href="#">
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <span>(21)</span>
                          </a>
                        </div>
                        <h2><Link href="/course-details">Basic Fundamentals of Interior & Graphics Design</Link></h2>
                        <div className="cmeta">
                          <div className="smeta">
                            <i className='bx bx-user'></i>
                            25 Students
                          </div>

                          <div className="smeta">
                            <i className='bx bx-file'></i>
                            15 Lessons
                          </div>

                          <div className="smeta">
                            <i className='bx bx-time-five'></i>
                            1.5 Hours
                          </div>
                        </div>

                        <div className="course_btm">
                          <div className="cauthor">
                            <a href="#">
                              <img src="assets/img/review/1.jpg" alt="" />
                              <span>Masum Billah</span>
                            </a>
                          </div>

                          <div className="ccategory">
                            <a href="#">
                              Laravel
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide className="single-course">
                      <div className="course-img">
                        <img src="assets/img/courses/4.jpg" alt="course image" />
                        <span className="cprice">$50.00</span>
                      </div>

                      <div className="course_content">
                        <div className="crating">
                          <a href="#">
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <i className="bx bxs-star"></i>
                            <span>(21)</span>
                          </a>
                        </div>
                        <h2><Link href="/course-details">WordPress for Beginners – Master WordPress</Link></h2>
                        <div className="cmeta">
                          <div className="smeta">
                            <i className='bx bx-user'></i>
                            25 Students
                          </div>

                          <div className="smeta">
                            <i className='bx bx-file'></i>
                            15 Lessons
                          </div>

                          <div className="smeta">
                            <i className='bx bx-time-five'></i>
                            1.5 Hours
                          </div>
                        </div>

                        <div className="course_btm">
                          <div className="cauthor">
                            <a href="#">
                              <img src="assets/img/review/1.jpg" alt="" />
                              <span>Masum Billah</span>
                            </a>
                          </div>

                          <div className="ccategory">
                            <a href="#">
                              PHP
                            </a>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>


                  </Swiper>

               

                  <div className="owl-nav">
                    <button type="button" role="presentation" className="owl-prev"><i className="bx bx-chevrons-left"></i></button>
                    <button type="button" role="presentation" className="owl-next"><i className="bx bx-chevrons-right"></i></button>
                  </div>
              </div>



            </div>
          </div>
        </div>
      </section>
    </>
  )
}
