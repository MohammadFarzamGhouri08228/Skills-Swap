

import Link from 'next/link'
import React from 'react'

export default function CoursesHomeTwo() {
  return (
    <>
      <section className="courses">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-md-8 wow fadeInUp">
              <div className="section-title">
                <span>Our Courses List</span>
                <h2>Most Popular Courses</h2>
              </div>
            </div>

            <div className="col-xl-4 col-md-4 align-self-center text-end title_btn wow fadeIn">
              <Link href="/courses" className="bg_btn bt">View All</Link>
            </div>

            <div className="col-xl-6 col-lg-6 wow fadeIn">
              <div className="single-course cstyle-2">
                <div className="row">
                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
                    <div className="course-img">
                      <div className="c_image" style={{ background: `url(/assets/img/courses/1.jpg)` }}></div>
                      <div className="ccategory">
                        <a href="#">WordPress</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
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
                      <h2><Link href="/course-details">Ultimate Photoshop Training: From Beginner</Link></h2>

                      <div className="cmeta">
                        <div className="smeta">
                          <i className='bx bx-user'></i>
                          25 Students
                        </div>

                        <div className="smeta">
                          <i className='bx bx-file'></i>
                          15 Lessons
                        </div>
                      </div>

                      <div className="course_btm">
                        <div className="cauthor">
                          <a href="#">
                            <img src="assets/img/review/1.jpg" alt="" />
                            <span>Masum Billah</span>
                          </a>
                        </div>

                        <span className="cprice-2">$500</span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xl-6 col-lg-6 wow fadeIn">
              <div className="single-course cstyle-2">
                <div className="row">
                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
                    <div className="course-img">
                      <div className="c_image" style={{ backgroundImage: "url(/assets/img/courses/2.jpg)" }}></div>
                      <div className="ccategory">
                        <a href="#">JavaScript</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
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
                      <h2><Link href="/course-details">Photography Crash Course
                        for Photographer</Link></h2>

                      <div className="cmeta">
                        <div className="smeta">
                          <i className='bx bx-user'></i>
                          25 Students
                        </div>

                        <div className="smeta">
                          <i className='bx bx-file'></i>
                          15 Lessons
                        </div>
                      </div>

                      <div className="course_btm">
                        <div className="cauthor">
                          <a href="#">
                            <img src="assets/img/review/1.jpg" alt="" />
                            <span>Masum Billah</span>
                          </a>
                        </div>

                        <span className="cprice-2">$500</span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xl-6 col-lg-6 wow fadeIn">
              <div className="single-course cstyle-2">
                <div className="row">
                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
                    <div className="course-img">
                      <div className="c_image" style={{ background: `url(/assets/img/courses/3.jpg)` }}></div>
                      <div className="ccategory">
                        <a href="#">Php</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
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
                      </div>

                      <div className="course_btm">
                        <div className="cauthor">
                          <a href="#">
                            <img src="assets/img/review/1.jpg" alt="" />
                            <span>Masum Billah</span>
                          </a>
                        </div>

                        <span className="cprice-2">$500</span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xl-6 col-lg-6 wow fadeIn">
              <div className="single-course cstyle-2">
                <div className="row">
                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
                    <div className="course-img">
                      <div className="c_image" style={{ background: `url(/assets/img/courses/4.jpg)` }}></div>
                      <div className="ccategory">
                        <a href="#">Lavarel</a>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-6 col-12">
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
                      </div>

                      <div className="course_btm">
                        <div className="cauthor">
                          <a href="#">
                            <img src="assets/img/review/1.jpg" alt="" />
                            <span>Masum Billah</span>
                          </a>
                        </div>

                        <span className="cprice-2">$500</span>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
    </>
  )
}
