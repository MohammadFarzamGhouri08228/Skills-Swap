"use client"
import VideoPopup from '@/modals/VideoPopup'
import React, { useState } from 'react'

export default function VideoHomeOne() {

  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  return (
    <>
      <section
        className="relative pb170 wow fadeIn overflow-hidden"
      >
        {/* Full dark gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-[#2d0b4e] via-[#1a1333] to-[#3a1c71]"></div>
          {/* Decorative blurred circles */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -left-16 w-60 h-60 bg-purple-700 opacity-30 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 right-0 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-pink-400 opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-fuchsia-400 opacity-20 rounded-full blur-2xl"></div>
          </div>
        </div>
        <div className="row relative z-10">
          <div className="col-xl-10 mx-auto">
            {/* Add space before heading */}
            <div className="pt-24"></div>
            {/* Video Heading */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">
              Watch This Video To Learn About SkillSwap
            </h2>
            <div className="video-area flex flex-col items-center">
              <img
                src="assets/img/bg/video.png"
                alt="video"
                className="rounded-2xl shadow-2xl border-4 border-purple-400 mb-6 bg-white/10 backdrop-blur"
                style={{ maxWidth: 480 }}
              />
              <a
                onClick={() => setIsVideoOpen(true)}
                style={{ cursor: "pointer" }}
                className="vbtn flex items-center justify-center"
              >
                <svg id="play_icon" viewBox="0 0 163 163" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px">
                  <g fill="none">
                    <g transform="translate(2.000000, 2.000000)" strokeWidth="4">
                      <path d="M10,80 C10,118.107648 40.8923523,149 79,149 L79,149 C117.107648,149 148,118.107648 148,80 C148,41.8923523 117.107648,11 79,11" id="lineOne" stroke="#A5CB43"></path>
                      <path d="M105.9,74.4158594 L67.2,44.2158594 C63.5,41.3158594 58,43.9158594 58,48.7158594 L58,109.015859 C58,113.715859 63.4,116.415859 67.2,113.515859 L105.9,83.3158594 C108.8,81.1158594 108.8,76.6158594 105.9,74.4158594 L105.9,74.4158594 Z" id="triangle" stroke="#A3CD3A"></path>
                      <path d="M159,79.5 C159,35.5933624 123.406638,0 79.5,0 C35.5933624,0 0,35.5933624 0,79.5 C0,123.406638 35.5933624,159 79.5,159 L79.5,159" id="lineTwo" stroke="#A5CB43"></path>
                    </g>
                  </g>
                </svg>
              </a>
            </div>
            {/* Add space after video */}
            <div className="pb-20"></div>
          </div>
        </div>
      </section>

      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={"W7kLyV8h3GI"}
      />
      {/* video modal end */}
    </>
  )
}