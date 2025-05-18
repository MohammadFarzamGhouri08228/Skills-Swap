
import Link from 'next/link'
import React from 'react'

export default function LoginForm() {
  return (
    <>
      <section className="login_register section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-xs-12 wow fadeIn">
              <div className="login">
                <h4 className="login_register_title">Already a member? Sign in:</h4>
                <div className="form-group">
                  <label htmlFor="contact-name">Username</label>
                  <input type="text" id="contact-name" placeholder="Enter Username" className="form-control" name="name" />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Password</label>
                  <input type="password" placeholder="Enter Password" id="contact-email" className="form-control" name="password" />
                </div>

                <div className="form-check mb-4">
                  <input id="rpaword" className="form-check-input" type="checkbox" />
                  <label className="form-check-label" htmlFor="rpaword" >
                    Remember Password
                  </label>
                </div>

                <div className="form-group col-lg-12">
                  <button className="bg_btn bt" type="submit" name="submit">login</button>
                </div>
                <p>Dont have an account? <Link href="/register">Register Now</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
