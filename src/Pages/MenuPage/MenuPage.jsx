import React from 'react'
import MenuHeader from '../../Components/MenuComponents/MenuHeader'
import MenuItems from '../../Components/MenuComponents/MenuItems'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function MenuPage() {
  return (
    <>
      <SEO 
        title="Our Menu" 
        description="Explore our diverse menu of authentic Nigerian dishes, healthy meal plans, and delicious sides. Order online for delivery or pickup."
      />
      <MenuHeader />
      <MenuItems />
      <Footer />
    </>
  )
}

export default MenuPage
