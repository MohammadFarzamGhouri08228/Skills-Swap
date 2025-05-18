

import React from 'react'
import HeaderOne from '@/layouts/headers/HeaderOne'
import Breadcrumb from '../common/Breadcrumb'
import BlogDetailsArea from './BlogDetailsArea'
import FooterOne from '@/layouts/footers/FooterOne'

export default function BlogDetails() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Blog Details" subtitle="Blog Details" />
      <BlogDetailsArea />
      <FooterOne />
    </>
  )
}
