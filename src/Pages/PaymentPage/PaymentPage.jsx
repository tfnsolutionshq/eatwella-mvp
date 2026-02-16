import React from 'react'
import PaymentHeader from '../../Components/PaymentComponents/PaymentHeader'
import PaymentMethods from '../../Components/PaymentComponents/PaymentMethods'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function PaymentPage() {
  return (
    <>
      <SEO 
        title="Payment" 
        description="Securely pay for your EatWella order. Choose from multiple payment options including card and cash."
      />
      <PaymentHeader />
      <PaymentMethods />
      <Footer />
    </>
  )
}

export default PaymentPage
