import React from 'react'
import PaymentHeader from '../../Components/PaymentComponents/PaymentHeader'
import PaymentMethods from '../../Components/PaymentComponents/PaymentMethods'
import Footer from '../../Components/LandingComponents/Footer'

function PaymentPage() {
  return (
    <>
      <PaymentHeader />
      <PaymentMethods />
      <Footer />
    </>
  )
}

export default PaymentPage
