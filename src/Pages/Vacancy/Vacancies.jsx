import React from 'react'
import VacancyHeader from '../../Components/Vacancy/VacancyHeader'
import VacancyContent from '../../Components/Vacancy/VacancyItems'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function VacancyPage() {
  return (
    <>
      <SEO 
        title="Vacancy" 
        description="Apply for our available job positions. Get hired and start your career."
      />
      <VacancyHeader />
      <VacancyContent />
      <Footer />
    </>
  )
}

export default VacancyPage
