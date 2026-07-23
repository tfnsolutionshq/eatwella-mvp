import ForgotPasswordHeader from "../../Components/ForgotPassword/ForgotPasswordHeader";
import ForgotPasswordContent from "../../Components/ForgotPassword/ForgotPasswordContent";
import Footer from "../../Components/LandingComponents/Footer";
import SEO from "../../Components/SEO";

function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Forgot Password"
        description="Reset your Eatwella account password. Enter your email address to receive a password reset link."
      />
      <ForgotPasswordHeader />
      <ForgotPasswordContent />
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;
