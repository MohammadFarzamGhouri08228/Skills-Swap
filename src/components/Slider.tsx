import React from 'react';

export default function Slider() {
  return (
    <section className="slider_wrap slider_fullwide slider_engine_revo slider_alias_education_home_slider">
      <div className="content_wrap">
        <div className="slider-container">
          <div className="slider-item active">
            <div className="slider-image" style={{ backgroundImage: "url('/images/slider1.jpg')" }}>
              <div className="slider-content">
                <h2 className="slider-title">Take great courses from the world's best instructors</h2>
                <p className="slider-text">Start learning valuable skills today</p>
                <div className="slider-buttons">
                  <a href="/courses" className="sc_button sc_button_square sc_button_style_filled sc_button_size_large">Browse Courses</a>
                  <a href="/about" className="sc_button sc_button_square sc_button_style_border sc_button_size_large">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 