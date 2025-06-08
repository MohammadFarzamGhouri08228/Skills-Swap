
import React from 'react'
import HeaderOne from '@/layouts/headers/HeaderOne'
import Breadcrumb from '../common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import FeatureHomeOne from '../homes/home/FeatureHomeOne'
import AboutHomeOne from '../homes/home/AboutHomeOne'
import CounterHomeOne from '../homes/home/CounterHomeOne'
import InstructorsHomeOne from '../homes/home/InstructorsHomeOne'

export default function About() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="About Us" />
      <FeatureHomeOne />
      <AboutHomeOne />
      <CounterHomeOne />
      <InstructorsHomeOne style_2={true} />
      <FooterOne />
    </>
  )
}
