export default function Testimonials() {
  return (
    <div className="sc_section bg_tint_dark testimonials_section">
      <div className="content_wrap">
        <div className="sc_section_header">
          <h2 className="sc_section_title">What Our Students Say</h2>
          <h6 className="sc_section_subtitle">Testimonials from our community</h6>
        </div>
        <div className="sc_testimonials sc_slider_swiper sc_slider_pagination sc_slider_pagination_bottom sc_slider_nocontrols">
          <div className="slides swiper-wrapper">
            {/* Testimonial 1 */}
            <div className="swiper-slide">
              <div className="sc_testimonial_item">
                <div className="sc_testimonial_avatar">
                  <img alt="Testimonial Avatar" src="/images/course1.jpg" />
                </div>
                <div className="sc_testimonial_content">
                  <p>SkillSwap transformed my career path. The web development course I took was comprehensive and practical. Within weeks of completing it, I landed a job as a junior developer.</p>
                </div>
                <div className="sc_testimonial_author">
                  <a href="#">Michael Clark</a>
                  <span>, Web Developer</span>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="swiper-slide">
              <div className="sc_testimonial_item">
                <div className="sc_testimonial_avatar">
                  <img alt="Testimonial Avatar" src="/images/course2.jpg" />
                </div>
                <div className="sc_testimonial_content">
                  <p>The quality of instruction on SkillSwap is outstanding. The teachers are engaging and the content is up-to-date with industry standards. The community support has been invaluable to my learning journey.</p>
                </div>
                <div className="sc_testimonial_author">
                  <a href="#">Sarah Johnson</a>
                  <span>, Graphic Designer</span>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="swiper-slide">
              <div className="sc_testimonial_item">
                <div className="sc_testimonial_avatar">
                  <img alt="Testimonial Avatar" src="/images/course3.jpg" />
                </div>
                <div className="sc_testimonial_content">
                  <p>I've tried several online learning platforms, but SkillSwap stands out because of its interactive approach. The practical exercises and feedback from instructors helped me master digital marketing quickly.</p>
                </div>
                <div className="sc_testimonial_author">
                  <a href="#">David Wilson</a>
                  <span>, Marketing Specialist</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sc_slider_pagination_wrap"></div>
        </div>
      </div>
    </div>
  );
} 