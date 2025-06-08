
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import InstructorsHomeOne from '../homes/home/InstructorsHomeOne'
import FooterOne from '@/layouts/footers/FooterOne'

export default function Instructors() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Instructors" />
      <InstructorsHomeOne />
      <InstructorsHomeOne style_2={true} style_3={true} />
      <FooterOne />
    </>
  )
}
