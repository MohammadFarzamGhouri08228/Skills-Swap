
"use client"

import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

export default function BrandHomeTwo() {
  return (
    <>
      <section className="container partner-style-2 wow fadeIn">
        <div className="row">
          <Swiper
            slidesPerView={6}
            spaceBetween={30}
            loop={true}
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            centeredSlides={true}
            breakpoints={{
              0: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 6,
              },

            }}
            className="mx-auto partners owl-carousel">

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/1.svg" alt="client" /></a>
            </SwiperSlide>

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/2.svg" alt="client" /></a>
            </SwiperSlide>

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/3.svg" alt="client" /></a>
            </SwiperSlide>

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/4.svg" alt="client" /></a>
            </SwiperSlide>

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/5.svg" alt="client" /></a>
            </SwiperSlide>

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/1.svg" alt="client" /></a>
            </SwiperSlide>

            <SwiperSlide className="client-item">
              <a href="#"><img src="assets/img/partners/dark/2.svg" alt="client" /></a>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  )
}
