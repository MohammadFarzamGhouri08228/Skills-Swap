
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
import Breadcrumb from '../common/Breadcrumb'
import LoginForm from './LoginForm'
import FooterOne from '@/layouts/footers/FooterOne'

export default function Login() {
  return (
    <>
    <HeaderOne />
    <Breadcrumb title="Login" subtitle="Login" />
    <LoginForm />
    <FooterOne />

    </>
  )
}
