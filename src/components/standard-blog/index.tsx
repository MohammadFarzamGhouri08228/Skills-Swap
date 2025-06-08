

import React from 'react'
import HeaderOne from '@/layouts/headers/HeaderOne'
import Breadcrumb from '../common/Breadcrumb'
import StandardBlogArea from './StandardBlogArea'
import FooterOne from '@/layouts/footers/FooterOne'

export default function StandardBlog() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Standard Blog" />
      <StandardBlogArea />
      <FooterOne />
    </>
  )
}
