import React from 'react'
import LoyaltyBoardHeader from '../../Components/LoyaltyBoardComponents/LoyaltyBoardHeader'
import LoyaltyBoardContent from '../../Components/LoyaltyBoardComponents/LoyaltyBoardContent'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function LoyaltyBoardPage() {
  return (
    <>
      <SEO 
        title="Loyalty Board" 
        description="Join our loyalty program and earn rewards for every meal you order. Eat healthy, save more."
      />
      <LoyaltyBoardHeader />
      <LoyaltyBoardContent />
      <Footer />
    </>
  )
}

export default LoyaltyBoardPage
