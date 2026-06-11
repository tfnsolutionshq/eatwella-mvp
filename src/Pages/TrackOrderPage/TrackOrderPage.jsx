import React from 'react'
import TrackOrderHeader from '../../Components/TrackOrder/TrackOrderHeader'
import TrackOrderContent from '../../Components/TrackOrder/TrackOrderContent'
import Footer from '../../Components/LandingComponents/Footer'
import SEO from '../../Components/SEO'

function TrackOrderPage() {
  return (
    <div className="flex flex-col min-h-screen">
        <SEO 
          title="Track Order" 
          description="Track the status of your Eatwella order in real-time. Enter your order ID to see updates."
        />
        <TrackOrderHeader />
        <TrackOrderContent />
        <Footer />
    </div>
  )
}

export default TrackOrderPage