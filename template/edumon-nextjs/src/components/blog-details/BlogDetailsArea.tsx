
"use client"

import React from 'react'

export default function BlogDetailsArea() {
  return (
    <>
      <section className="blog-details section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-12 col-12 wow fadeIn">
              <div className="post-inner">
                <div className="post-image">
                  <img src="assets/img/blog/bdetails.jpg" alt="Post Image" />
                </div>

                <div className="entry-content">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus eget dolor non condimentum. Mauris ac augue eu ex elementum dictum. Quisque fermentum augue vel venenatis bibendum. Curabitur malesuada egestas varius. Maecenas maximus dapibus sem. Nunc lacinia sollicitudin risus, sed pulvinar orci feugiat vel. Aliquam convallis urna diam, eget ultrices dolor pretium non.
                  </p>

                  <h2>What Dose it Work from Web?</h2>
                  <p>
                    Mauris pulvinar eros non dictum maximus. In at lacus scelerisque nisl maximus eleifend id ac libero. Integer interdum est hendrerit imperdiet condimentum. Pellentesque consectetur id purus ut tincidunt. Vestibulum turpis nisi, commodo quis ante a, commodo accumsan magna. Proin quis felis quis elit egestas molestie.
                  </p>

                  <blockquote>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus finibus vestibulum eleifend. Suspendisse potenti.
                  </blockquote>
                </div>

                <div className="post-nav pnavigation">
                  <a href="#" className="prev-pro">

                    Preview Posts
                  </a>

                  <a href="#" className="next-pro">
                    Next Post

                  </a>
                </div>
              </div>

              <div className="comments">
                <h2 className="bdtitle">Comments - 03</h2>

                <ul className="comment-list">
                  <li className="comment">
                    <div className="single-comment">
                      <div className="float-start com-img">
                        <img src="assets/img/review/1.jpg" alt="" />
                        <h4><a href="#">Mr Smith</a></h4>
                        <span className="cdate">13 Jan, 2024</span>
                        <p className="creplay">
                          <a href="#"><i className="fa-solid fa-reply"></i></a>
                        </p>
                      </div>
                      <div className="com-content">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus eget dolor non condimentum. Mauris ac augue eu ex elementum dictum. Quisque fermentum augue vel venenatis bibendum. Curabitur malesuada egestas varius. Maecenas maximus dapibus sem.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="comment">
                    <ul className="children">
                      <li className="comment">
                        <div className="single-comment">
                          <div className="float-start com-img">
                            <img src="assets/img/review/2.jpg" alt="" />
                            <h4><a href="#">Mr Smith</a></h4>
                            <span className="cdate">13 Jan, 2024</span>
                            <p className="creplay">
                              <a href="#"><i className="fa-solid fa-reply"></i></a>
                            </p>
                          </div>
                          <div className="com-content">
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus eget dolor non condimentum. Mauris ac augue eu ex elementum dictum. Quisque fermentum augue vel venenatis bibendum. Curabitur malesuada egestas varius. Maecenas maximus dapibus sem.
                            </p>
                          </div>
                        </div>

                        <ul className="children">
                          <li className="comment">
                            <div className="single-comment">
                              <div className="float-start com-img">
                                <img src="assets/img/review/3.jpg" alt="" />
                                <h4><a href="#">Mr Smith</a></h4>
                                <span className="cdate">13 Jan, 2024</span>
                                <p className="creplay">
                                  <a href="#"><i className="fa-solid fa-reply"></i></a>
                                </p>
                              </div>
                              <div className="com-content">
                                <p>
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus eget dolor non condimentum. Mauris ac augue eu ex elementum dictum. Quisque fermentum augue vel venenatis bibendum. Curabitur malesuada egestas varius. Maecenas maximus dapibus sem.
                                </p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="comment-form">
                <h2 className="bdtitle">Comment</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <p>
                    <label>Write Full Name</label>
                    <input type="text" className="form-control" name="name" />
                  </p>

                  <p>
                    <label>Email Address</label>
                    <input type="email" className="form-control" name="email" />
                  </p>

                  <p>
                    <label>Website</label>
                    <input type="url" className="form-control" name="website" />
                  </p>

                  <p>
                    <label>Comment</label>
                    <textarea className="form-control" name="comment"></textarea>
                  </p>
                  <p>
                    <input type="submit" id="submit" value="Comment" />
                  </p>
                </form>
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
