"use client"

import React from 'react'

export default function ContactForm() {
  return (
    <>
      <section className="contact_us section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 wow fadeIn">
              <div className="contact_content">
                <img src="assets/img/contact.jpg" alt="image" />
                <div className="contact_info">
                  <div className="row">
                    <div className="col-xl-4 col-md-4 ">
                      <div className="contact_list">
                        <div className="cicon">
                          <i className='bx bx-phone-call'></i>
                        </div>
                        <div className="cinfo_content">
                          <h4>For any Query?</h4>
                          <p>
                            <a href="#">Free +68 (025)-9875</a><br />
                            <a href="#">Free +68 (026)-9879</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-md-4">
                      <div className="contact_list">
                        <div className="cicon">
                          <i className='bx bx-envelope' ></i>
                        </div>
                        <div className="cinfo_content">
                          <h4>Write email Us</h4>
                          <p>
                            <a href="#">admin@example.com</a><br />
                            <a href="#">support@example.com</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-md-4">
                      <div className="contact_list">
                        <div className="cicon">
                          <i className='bx bx-map' ></i>
                        </div>
                        <div className="cinfo_content">
                          <h4>Visit anytime</h4>
                          <p>
                            427 Hall Place Longview, Texas
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-6 wow fadeIn">
              <div className="contact-form align-self-center">
                <div className="section-title">
                  <span>Send us email</span>
                  <h2>Feel Free to write</h2>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    <div className="col-xl-6">
                      <input type="text" placeholder="Enter Name" className="form-control" />
                    </div>

                    <div className="col-xl-6">
                      <input type="email" placeholder="Enter Email" className="form-control" />
                    </div>

                    <div className="col-xl-6">
                      <input type="text" placeholder="Enter Subject" className="form-control" />
                    </div>

                    <div className="col-xl-6">
                      <input type="text" placeholder="Enter Phone" className="form-control" />
                    </div>

                    <div className="col-12">
                      <textarea placeholder="Enter Message" className="form-control"></textarea>
                    </div>

                    <div className="col-12">
                      <input type="submit" className="bg_btn bt" value="Send Message" />
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
