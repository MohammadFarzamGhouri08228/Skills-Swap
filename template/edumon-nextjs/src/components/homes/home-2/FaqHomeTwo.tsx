
"use client"
import React from 'react'
 


if(typeof window !== 'undefined') {
  require('bootstrap/js/dist/collapse');
}


export default function FaqHomeTwo() {

 

  return (
    <>
      <section className="faq pb120">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 wow fadeIn">
              <div className="faq-image">
                <img src="assets/img/faq.jpg" alt="faq" />
                <div className="faq_contact">
                  <h4>Online Support</h4>
                  <p>+858 75 45 64 24</p>
                </div>
              </div>
            </div>

            <div className="col-xl-6 align-self-center wow fadeIn">
              <div className="section-title">
                <span>FAQ</span>
                <h2>Frequently Asked <br /> Questions</h2>
              </div>

              <div className="accordion" id="faq_accordion">

                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading1">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                      Development & Design
                    </button>
                  </h2>

                  <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="heading1" data-bs-parent="#faq_accordion">
                    <div className="accordion-body">
                      Fusce luctus lacinia lorem non ornare. Aliquam quis libero quis orci finibus accumsan. Quisque suscipit justo dictum augue vehicula, quis tincidunt erat elementum. Curabitur tincidunt convallis blandit
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading2">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                      Start With mentors
                    </button>
                  </h2>

                  <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="heading2" data-bs-parent="#faq_accordion">
                    <div className="accordion-body">
                      Fusce luctus lacinia lorem non ornare. Aliquam quis libero quis orci finibus accumsan. Quisque suscipit justo dictum augue vehicula, quis tincidunt erat elementum. Curabitur tincidunt convallis blandit
                    </div>
                  </div>
                </div>


                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading3">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                      The best way to Boost Your
                    </button>
                  </h2>

                  <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="heading3" data-bs-parent="#faq_accordion">
                    <div className="accordion-body">
                      Fusce luctus lacinia lorem non ornare. Aliquam quis libero quis orci finibus accumsan. Quisque suscipit justo dictum augue vehicula, quis tincidunt erat elementum. Curabitur tincidunt convallis blandit
                    </div>
                  </div>
                </div>


                <div className="accordion-item">
                  <h2 className="accordion-header" id="heading4">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                      What Can i do to Help?
                    </button>
                  </h2>

                  <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="heading4" data-bs-parent="#faq_accordion">
                    <div className="accordion-body">
                      Fusce luctus lacinia lorem non ornare. Aliquam quis libero quis orci finibus accumsan. Quisque suscipit justo dictum augue vehicula, quis tincidunt erat elementum. Curabitur tincidunt convallis blandit
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
