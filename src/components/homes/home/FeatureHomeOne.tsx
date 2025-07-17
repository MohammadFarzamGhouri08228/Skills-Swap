import React from 'react'

type Props = {
  style_2?: boolean
}

export default function FeatureHomeOne({style_2}: Props) {
  return (
    <>
      <section className={`features section-padding ${style_2 ? 'fstyle-2' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-12 wow fadeInUp">
              <div className="section-title text-center">
                
                <h2>One Platform, Many Skills!</h2>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 wow fadeIn">
                <div className="feature-item">
                    <div className="fea-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L550.2 352l41.8 0c26.5 0 48-21.5 48-48l0-128c0-26.5-21.5-48-48-48l-76 0-4 0-.7 0-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48-80 0c-26.5 0-48 21.5-48 48L0 304c0 26.5 21.5 48 48 48l108.2 0 91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123z"/></svg>
                    </div>
                    <h3>Skill Swap Sessions</h3>
                    <p>Find users with interesting skills and set up a swap session. </p>
                    <span className="fnumber">01</span>
                </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 wow fadeIn">
                <div className="feature-item">
                    <div className="fea-icon">
                        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M6,11a1,1,0,1,0,1,1A1,1,0,0,0,6,11Zm5.86-1.55h0L4.71,2.29A1,1,0,0,0,3.29,3.71L4.59,5H4A3,3,0,0,0,1,8v8a3,3,0,0,0,3,3H18.59l2.7,2.71a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Zm-.74,2.09,1.34,1.34A1,1,0,0,1,12,13a1,1,0,0,1-1-1A1,1,0,0,1,11.12,11.54ZM4,17a1,1,0,0,1-1-1V8A1,1,0,0,1,4,7H6.59l3.1,3.1A3,3,0,0,0,9,12a3,3,0,0,0,3,3,3,3,0,0,0,1.9-.69L16.59,17ZM20,5H12.66a1,1,0,0,0,0,2H20a1,1,0,0,1,1,1v7.34a1,1,0,1,0,2,0V8A3,3,0,0,0,20,5Zm-1,7a1,1,0,1,0-1,1A1,1,0,0,0,19,12Z"/></svg>
                    </div>
                    <h3>No Cash Payments, Only Skill Exchange</h3>
                    <p>Swap skills without monetary transactions — teach what you know, learn what you want. </p>
                    <span className="fnumber">02</span>
                </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 wow fadeIn">
              <div className="feature-item">
                <div className="fea-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
                </div>
                <h3>Community Support</h3>
                <p>Join a community that values learning, sharing, and mutual respect. </p>
                <span className="fnumber">03</span>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4 col-md-6 col-12 wow fadeIn">
              <div className="feature-item">
                <div className="fea-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zM305 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47z"/></svg>
                </div>
                <h3>Flexible Scheduling</h3>
                <p>Coordinate swap sessions based on your availability.</p>
                <span className="fnumber">04</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
