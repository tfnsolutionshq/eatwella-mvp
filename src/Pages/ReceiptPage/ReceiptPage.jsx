import React from 'react'
import ReceiptHeader from '../../Components/ReceiptComponents/ReceiptHeader'
import ReceiptDetails from '../../Components/ReceiptComponents/ReceiptDetails'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function ReceiptPage() {
  return (
    <>
      <SEO 
        title="Order Receipt" 
        description="View your order receipt and details. Thank you for ordering from EatWella."
      />
      <ReceiptHeader />
      <ReceiptDetails />
      <Footer />
    </>
  )
}

export default ReceiptPage
