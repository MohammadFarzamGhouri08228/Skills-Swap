export default function Features() {
  return (
    <div className="sc_section bg_tint_light">
      <div className="content_wrap">
        <div className="sc_section_header">
          <h2 className="sc_section_title">Why Choose SkillSwap?</h2>
          <h6 className="sc_section_subtitle">Our platform offers unique benefits</h6>
        </div>
        <div className="columns_wrap sc_columns">
          {/* Feature 1 */}
          <div className="column-1_3 sc_column_item sc_column_item_1">
            <div className="sc_feature sc_feature_style_1">
              <div className="sc_feature_icon icon-book"></div>
              <h4 className="sc_feature_title">Expert Instructors</h4>
              <div className="sc_feature_description">
                <p>Learn from industry professionals and experienced educators who are passionate about sharing their knowledge.</p>
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="column-1_3 sc_column_item sc_column_item_2">
            <div className="sc_feature sc_feature_style_1">
              <div className="sc_feature_icon icon-star"></div>
              <h4 className="sc_feature_title">Quality Content</h4>
              <div className="sc_feature_description">
                <p>Access high-quality, well-structured courses designed to help you master new skills effectively.</p>
              </div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="column-1_3 sc_column_item sc_column_item_3">
            <div className="sc_feature sc_feature_style_1">
              <div className="sc_feature_icon icon-certificate"></div>
              <h4 className="sc_feature_title">Certifications</h4>
              <div className="sc_feature_description">
                <p>Earn recognized certifications to showcase your skills and boost your resume.</p>
              </div>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="column-1_3 sc_column_item sc_column_item_1">
            <div className="sc_feature sc_feature_style_1">
              <div className="sc_feature_icon icon-group"></div>
              <h4 className="sc_feature_title">Community Support</h4>
              <div className="sc_feature_description">
                <p>Join a supportive community of learners and instructors who are eager to help you succeed.</p>
              </div>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="column-1_3 sc_column_item sc_column_item_2">
            <div className="sc_feature sc_feature_style_1">
              <div className="sc_feature_icon icon-mobile"></div>
              <h4 className="sc_feature_title">Learn Anywhere</h4>
              <div className="sc_feature_description">
                <p>Access your courses on any device, anytime, anywhere with our responsive platform.</p>
              </div>
            </div>
          </div>
          
          {/* Feature 6 */}
          <div className="column-1_3 sc_column_item sc_column_item_3">
            <div className="sc_feature sc_feature_style_1">
              <div className="sc_feature_icon icon-wallet"></div>
              <h4 className="sc_feature_title">Affordable Options</h4>
              <div className="sc_feature_description">
                <p>Explore a range of free and affordable courses to fit any budget and learning needs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 