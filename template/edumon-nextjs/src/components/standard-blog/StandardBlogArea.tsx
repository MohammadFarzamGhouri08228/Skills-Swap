
"use client"

import Link from 'next/link'
import React from 'react'

export default function StandardBlogArea() {
  return (
    <>
      <section className="blog section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-12 col-12 wow fadeIn">
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
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus eget dolor non condimentum. Mauris ac augue eu ex elementum dictum Quisque fermentum augue.
                  </p>
                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>

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
                      <a href="#">Education</a>
                    </span>
                  </div>

                  <h3><Link href="/blog-details">All Students and Teachers are Happy To Back to School</Link></h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus eget dolor non condimentum. Mauris ac augue eu ex elementum dictum Quisque fermentum augue.
                  </p>
                  <Link href="/blog-details" className="bbtn">Explore More</Link>
                </div>
              </div>

              <div className="col-12 text-center">
                <div className="post_pagination">
                  <ul>
                    <li><a href="#"><i className="fa-solid fa-arrow-left-long"></i></a></li>
                    <li><a href="#">1</a></li>
                    <li className="active"><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#"><i className="fa-solid fa-arrow-right-long"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-12 sidebar">
              <div className="widget search-widget wow fadeIn">
                <div className="search-form">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input type="text" className="search-control" placeholder="Search Query" />
                    <button type="submit" className="search-btn">
                      <i className="ti-search"></i>
                    </button>
                  </form>
                </div>
              </div>

              <div className="widget category-widget wow fadeIn">
                <h3 className="widget-title">Category</h3>
                <ul>
                  <li><a href="#">UI / UX Design</a></li>
                  <li><a href="#">Web Design</a></li>
                  <li><a href="#">App Development</a></li>
                  <li><a href="#">Branding and Printing</a></li>
                </ul>
              </div>

              <div className="widget popular-posts-widget wow fadeIn">
                <h3 className="widget-title">Popular Posts</h3>
                <ul>
                  <li>
                    <a href="#">
                      <div className="float-start ppimage">
                        <img src="assets/img/blog/1.jpg" alt="image" />
                      </div>
                      <div className="ppcontent">
                        <h4>Lorem Ipsum is simply dummy</h4>
                        <span>10 Jan,  2024</span>
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <div className="float-start ppimage">
                        <img src="assets/img/blog/2.jpg" alt="image" />
                      </div>
                      <div className="ppcontent">
                        <h4>Lorem Ipsum is simply dummy</h4>
                        <span>10 Jan,  2024</span>
                      </div>
                    </a>
                  </li>

                  <li>
                    <a href="#">
                      <div className="float-start ppimage">
                        <img src="assets/img/blog/3.jpg" alt="image" />
                      </div>
                      <div className="ppcontent">
                        <h4>Lorem Ipsum is simply dummy</h4>
                        <span>10 Jan,  2024</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="widget popular-posts-widget wow fadeIn">
                <h3 className="widget-title">Tags</h3>
                <div className="tags_clouds">
                  <a href="#">Trading</a>
                  <a href="#">Education</a>
                  <a href="#">Statistics</a>
                  <a href="#">Corporate</a>
                  <a href="#">Analysis</a>
                  <a href="#">Profit</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
