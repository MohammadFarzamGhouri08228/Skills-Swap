
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import CourseDetailsArea from './CourseDetailsArea'
import FooterOne from '@/layouts/footers/FooterOne'

export default function CourseDetails() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Course Details" subtitle="Course Details" />
      <CourseDetailsArea />
      <FooterOne />
    </>
  )
}
