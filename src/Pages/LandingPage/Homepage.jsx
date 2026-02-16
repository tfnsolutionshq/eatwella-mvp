import Header from "../../Components/LandingComponents/Header"
import Feeling from "../../Components/LandingComponents/Feeling"
import Menu from "../../Components/LandingComponents/Menu"
import Footer from "../../Components/LandingComponents/Footer"
import SEO from "../../Components/SEO"

function Homepage() {
  return (
    <>
      <SEO 
        title="Home" 
        description="EatWella - Delicious, healthy, and affordable meals delivered to your doorstep. Experience the best of Nigerian cuisine."
      />
      <Header />
      <Menu />
      <Feeling />
      <Footer />
    </>
  )
}

export default Homepage