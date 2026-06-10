import Footer from "../../Components/LandingComponents/Footer";
import LoginAccountHeader from "../../Components/UserDashboard/LoginAccountHeader";
import LoginContent from "../../Components/UserDashboard/LoginContent";

function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <LoginAccountHeader />
      <LoginContent />
      <Footer />
    </div>
  );
}

export default Login;
