import React from 'react'
import MealPlansHeader from '../../Components/MealPlansComponents/MealPlansHeader'
import MealPlansContent from '../../Components/MealPlansComponents/MealPlansContent'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function MealPlansPage() {
  return (
    <>
      <SEO 
        title="Meal Plans" 
        description="Subscribe to our convenient meal plans. Get healthy, home-cooked Nigerian meals delivered to you regularly."
      />
      <MealPlansHeader />
      <MealPlansContent />
      <Footer />
    </>
  )
}

export default MealPlansPage
