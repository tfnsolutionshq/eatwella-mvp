import React from 'react'
import OrderTypeHeader from '../../Components/OrderTypeComponents/OrderTypeHeader'
import OrderTypeForm from '../../Components/OrderTypeComponents/OrderTypeForm'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function OrderTypePage() {
  return (
    <>
      <SEO 
        title="Checkout Details" 
        description="Enter your details to complete your order. Choose between delivery or dine-in options."
      />
      <OrderTypeHeader />
      <OrderTypeForm />
      <Footer />
    </>
  )
}

export default OrderTypePage
