import Link from 'next/link'
import React from 'react'

export default function BlogHomeOne() {
  return (
    <>
      <section className="blog section-padding">
        <div className="container">
          <div className="row">
            <div className="col-12 wow fadeInUp">
              <div className="section-title text-center">
                <span>Latest Blog & Articles</span>
                <h2>Take a Look Our latest Posts</h2>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 col-12 wow fadeIn">
              <div className="blog-item">
                <div className="blog-image">
                  <img src="assets/img/blog/1.jpg" alt="image" />
                </div>

                <div className="blog-content">
                  <div className="bmeta">
                    <span>
                      <i className="bx bx-time-five"></i> 27 Jan , 2024
                    </span>

                    <span className="bcat">
                      <a href="#">eLearning</a>
                    </span>
                  </div>

                  <h3><Link href="/blog-details">A Student Learning with Online Programme on Computer</Link></h3>
                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 col-12 wow fadeIn">
              <div className="blog-item">
                <div className="blog-image">
                  <img src="assets/img/blog/2.jpg" alt="image" />
                </div>

                <div className="blog-content">
                  <div className="bmeta">
                    <span>
                      <i className="bx bx-time-five"></i> 27 Jan , 2024
                    </span>

                    <span className="bcat">
                      <a href="#">Students</a>
                    </span>
                  </div>

                  <h3><Link href="/blog-details">All Students and Teachers are Happy To Back to School</Link></h3>
                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 col-12 wow fadeIn">
              <div className="blog-item">
                <div className="blog-image">
                  <img src="assets/img/blog/3.jpg" alt="image" />
                </div>

                <div className="blog-content">
                  <div className="bmeta">
                    <span>
                      <i className="bx bx-time-five"></i> 27 Jan , 2024
                    </span>

                    <span className="bcat">
                      <a href="#">Education</a>
                    </span>
                  </div>

                  <h3><Link href="/blog-details">Learners are studing with togather in the Class Room</Link></h3>

                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
