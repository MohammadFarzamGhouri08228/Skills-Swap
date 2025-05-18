

import React from 'react'
import CartArea from './CartArea'
import Breadcrumb from '../common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import HeaderOne from '@/layouts/headers/HeaderOne'

export default function Cart() {
  return (
    <>
    <HeaderOne />
    <Breadcrumb title="Cart" subtitle="Cart" />
    <CartArea />
    <FooterOne />

    </>
  )
}
