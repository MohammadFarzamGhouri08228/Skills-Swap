
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import CheckoutArea from './CheckoutArea'

export default function Checkout() {
  return (
    <>
      <HeaderOne />
      <Breadcrumb title="Checkout" />
      <CheckoutArea />
      <FooterOne />
    </>
  )
}
