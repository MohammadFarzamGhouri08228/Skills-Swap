import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import FooterOne from '@/layouts/footers/FooterOne'

export default function HomeOne() {
  return (
    <>
      <HeaderOne />
      {/* Home content sections will be added here */}
      <div className="hero-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="text-center">Welcome to Skills Swap</h1>
              <p className="text-center">Find courses and resources to enhance your skills</p>
            </div>
          </div>
        </div>
      </div>
      <FooterOne />
    </>
  )
} 