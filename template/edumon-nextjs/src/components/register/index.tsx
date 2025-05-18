
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import FooterOne from '@/layouts/footers/FooterOne'
import RegisterForm from './RegisterForm'

export default function Register() {
  return (
    <>
    <HeaderOne />
    <Breadcrumb title="Register" subtitle="Register" />
    <RegisterForm />
    <FooterOne />

    </>
  )
}
