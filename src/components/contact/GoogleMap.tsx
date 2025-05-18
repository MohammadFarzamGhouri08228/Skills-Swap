
import React from 'react'

export default function GoogleMap() {
  return (
    <>
      <section className="google_map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107671.30068149016!2d-94.83771425184243!3d32.5066944202184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x863635ff97df3351%3A0xb30ff0f774195933!2sLongview%2C%20TX%2C%20USA!5e0!3m2!1sen!2sbd!4v1709976191256!5m2!1sen!2sbd" width="600" height="450" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </section>
    </>
  )
}
