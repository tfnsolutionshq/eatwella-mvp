import React from 'react'
import CartHeader from '../../Components/CartComponents/CartHeader'
import CartItems from '../../Components/CartComponents/CartItems'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function CartPage() {
  return (
    <>
      <SEO 
        title="Your Cart" 
        description="Review your order and proceed to checkout. EatWella - Healthy meals delivered."
      />
      <CartHeader />
      <CartItems />
      <Footer />
    </>
  )
}

export default CartPage
