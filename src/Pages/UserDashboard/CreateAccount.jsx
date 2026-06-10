import CreateAccountHeader from "../../Components/UserDashboard/CreateAccountHeader";
import CreateAccountContent from "../../Components/UserDashboard/CreateAccountContent";
import Footer from "../../Components/LandingComponents/Footer";

function CreateAccount() {
  return (
    <div className="flex flex-col min-h-screen">
      <CreateAccountHeader />
      <CreateAccountContent />
      <Footer />
    </div>
  );
}

export default CreateAccount;
