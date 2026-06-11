import { Outlet } from "react-router-dom";
import DashboardHeader from "../../Components/UserDashboard/DashboardHeader";
import Footer from "../../Components/LandingComponents/Footer";
import DashboardSidebar from "../../Components/UserDashboard/DashboardSidebar";

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="bg-gray-50">
        <main className="px-4 md:px-6 py-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            <DashboardSidebar />
            <section className="lg:col-span-9">
              <Outlet />
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
