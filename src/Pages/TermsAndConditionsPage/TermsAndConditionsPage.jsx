import TermsAndConditionsHeader from "../../Components/TermsAndConditions/TermsAndConditionsHeader";
import TermsAndConditionsContent from "../../Components/TermsAndConditions/TermsAndConditionsContent";
import Footer from "../../Components/LandingComponents/Footer";
import SEO from "../../Components/SEO";

function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Terms & Conditions"
        description="Read Eatwella's terms and conditions to understand your rights and obligations when using our services."
      />
      <TermsAndConditionsHeader />
      <TermsAndConditionsContent />
      <Footer />
    </div>
  );
}

export default TermsAndConditionsPage;
