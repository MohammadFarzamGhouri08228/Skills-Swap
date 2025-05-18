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
                <h2>Discover Insights on Skill Sharing</h2>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 col-12 wow fadeIn">
              <div className="blog-item">
                <div className="blog-image">
                  <img src="assets/img/blog/1.jpg" alt="SkillSwap Tips" />
                </div>

                <div className="blog-content">
                  <div className="bmeta">
                    <span>
                      <i className="bx bx-time-five"></i> 18 May, 2025
                    </span>

                    <span className="bcat">
                      <a href="#">Skill Exchange</a>
                    </span>
                  </div>

                  <h3>
                    <Link href="/blog-details">Top 5 Tips for Effective Skill Swaps</Link>
                  </h3>
                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 col-12 wow fadeIn">
              <div className="blog-item">
                <div className="blog-image">
                  <img src="assets/img/blog/2.jpg" alt="Choosing Partners" />
                </div>

                <div className="blog-content">
                  <div className="bmeta">
                    <span>
                      <i className="bx bx-time-five"></i> 12 May, 2025
                    </span>

                    <span className="bcat">
                      <a href="#">Community</a>
                    </span>
                  </div>

                  <h3>
                    <Link href="/blog-details">How to Find the Right Partner for Skill Exchange</Link>
                  </h3>
                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-md-6 col-12 wow fadeIn">
              <div className="blog-item">
                <div className="blog-image">
                  <img src="assets/img/blog/3.jpg" alt="SkillSwap Benefits" />
                </div>

                <div className="blog-content">
                  <div className="bmeta">
                    <span>
                      <i className="bx bx-time-five"></i> 10 May, 2025
                    </span>

                    <span className="bcat">
                      <a href="#">Learning</a>
                    </span>
                  </div>

                  <h3>
                    <Link href="/blog-details">Why Skill Exchange is a Game Changer for Learning</Link>
                  </h3>

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
