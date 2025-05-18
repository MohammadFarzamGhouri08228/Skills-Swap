
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import HeaderOne from '@/layouts/headers/HeaderOne'
import FooterOne from '@/layouts/footers/FooterOne'
import GridBlogArea from './GridBlogArea'

export default function GridBlog() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Grid Blog" subtitle="Grid Blog" />
      <GridBlogArea />
      <FooterOne />
    </>
  )
}
