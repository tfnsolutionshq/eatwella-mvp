import React from 'react'
import CartHeader from '../../Components/CartComponents/CartHeader'
import CartItems from '../../Components/CartComponents/CartItems'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Your Cart" 
        description="Review your order and proceed to checkout. Eatwella - Healthy meals delivered."
      />
      <CartHeader />
      <CartItems />
      <Footer />
    </div>
  )
}

export default CartPage
