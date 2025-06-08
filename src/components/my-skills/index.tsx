
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import CoursesTwoArea from './CoursesTwoArea'

export default function CoursesTwo() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="My Skills"/>
      <CoursesTwoArea />
      <FooterOne />
    </>
  )
}
