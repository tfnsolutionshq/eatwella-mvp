import React from "react";
import PrivacyPolicyHeader from "../../Components/PrivacyPolicy/PrivacyPolicyHeader";
import PrivacyPolicyContent from "../../Components/PrivacyPolicy/PrivacyPolicyContent";
import Footer from "../../Components/LandingComponents/Footer";
import SEO from "../../Components/SEO";

function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Privacy Policy"
        description="Read Eatwella's privacy policy to understand how we collect, use, and protect your personal information."
      />
      <PrivacyPolicyHeader />
      <PrivacyPolicyContent />
      <Footer />
    </div>
  );
}

export default PrivacyPolicyPage;
