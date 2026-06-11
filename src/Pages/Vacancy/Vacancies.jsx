import React from 'react'
import VacancyHeader from '../../Components/Vacancy/VacancyHeader'
import VacancyContent from '../../Components/Vacancy/VacancyItems'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function VacancyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Vacancy" 
        description="Apply for our available job positions. Get hired and start your career."
      />
      <VacancyHeader />
      <VacancyContent />
      <Footer />
    </div>
  )
}

export default VacancyPage
