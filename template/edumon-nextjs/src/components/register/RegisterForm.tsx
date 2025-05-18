
import Link from 'next/link'
import React from 'react'

export default function RegisterForm() {
  return (
    <>
      <section className="login_register section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-xs-12 wow fadeIn">
              <div className="register">
                <h4 className="login_register_title">Create a new account:</h4>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" placeholder="Enter Username" id="username" className=" form-control" name="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input type="text" placeholder="Enter Full Name" id="fullname" className=" form-control" name="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="email-address">Email Address</label>
                  <input type="email" placeholder="Enter Email Address" id="email-address" className="form-control " name="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="cpwd">Password</label>
                  <input type="password" placeholder="Enter Password" id="cpwd" className="form-control" name="password" />
                </div>
                <div className="form-group col-lg-12">
                  <button className="bg_btn bt" type="submit" name="submit">Signup now</button>
                </div>
                <p>Already have an account? <Link href="/login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
