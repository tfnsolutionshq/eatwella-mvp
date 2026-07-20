import AccountDeletionHeader from "../../Components/AccountDeletion/AccountDeletionHeader";
import AccountDeletionContent from "../../Components/AccountDeletion/AccountDeletionContent";
import Footer from "../../Components/LandingComponents/Footer";
import SEO from "../../Components/SEO";

function UserAccountDeletionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Delete Account"
        description="Request to delete your Eatwella account and personal data."
      />
      <AccountDeletionHeader />
      <AccountDeletionContent />
      <Footer />
    </div>
  );
}

export default UserAccountDeletionPage;
