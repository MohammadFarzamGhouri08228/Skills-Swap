
import React from 'react'
import CoursesArea from './CoursesArea'
import Breadcrumb from '../common/Breadcrumb'
import HeaderOne from '@/layouts/headers/HeaderOne'
import FooterOne from '@/layouts/footers/FooterOne'

export default function Courses() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Course Style 1" subtitle="Course Style 1" />
      <CoursesArea />
      <FooterOne />
    </>
  )
}
