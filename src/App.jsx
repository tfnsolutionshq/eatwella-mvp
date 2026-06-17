import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { useAuth } from "./context/AuthContext";

import AdminGuard from "./Components/RoutingComponents/AdminGuard";
import StaffGuard from "./Components/RoutingComponents/StaffGuard";
import PublicRouteGuard from "./Components/RoutingComponents/PublicRouteGuard";
import AdminOrSupervisorGuard from "./Components/RoutingComponents/AdminOrSupervisorGuard";
import FloatingCartButton from "./Components/FloatingCartButton";
import FloatingWhatsAppButton from "./Components/FloatingWhatsAppButton";

import Dashboard from "./Pages/Admin/Dashboard";
import AdminMenu from "./Pages/Admin/Menu";
import OutletManagement from "./Pages/Admin/OutletManagement";
import OrderManagement from "./Pages/Admin/OrderManagement";
import DiscountManagement from "./Pages/Admin/DiscountManagement";
import StaffManagement from "./Pages/Admin/StaffManagement";
import Vacancies from "./Pages/Admin/Vacancies";
import CareerOpenings from "./Pages/Admin/CareerOpenings";
import LoyaltySettings from "./Pages/Admin/LoyaltySettings";
import AllUsers from "./Pages/Admin/AllUsers";
import SingleUser from "./Pages/Admin/SingleUser";
import BankDetails from "./Pages/Admin/BankDetails";
import Payments from "./Pages/Admin/Payments";
import TaxAndVat from "./Pages/Admin/TaxAndVat";
import CreateOrder from "./Pages/Admin/CreateOrder";
import Login from "./Pages/Admin/Login";
import DeliveryLocationManagement from "./Pages/Admin/DeliveryLocationManagement";
import FoodPackaging from "./Pages/Admin/FoodPackaging";
import Settings from "./Pages/Admin/Settings";
import Campaigns from "./Pages/Admin/Campaigns";
import UserLogin from "./Pages/UserDashboard/Login";
import CreateAccount from "./Pages/UserDashboard/CreateAccount";
import UserDashboard from "./Pages/UserDashboard/Dashboard";
import OverviewPage from "./Pages/UserDashboard/OverviewPage";
import OrdersPage from "./Pages/UserDashboard/OrdersPage";
import ProfilePage from "./Pages/UserDashboard/ProfilePage";
import SettingsPage from "./Pages/UserDashboard/SettingsPage";
import EditProfile from "./Pages/UserDashboard/EditProfile";
import Homepage from "./Pages/LandingPage/Homepage";
import MenuPage from "./Pages/MenuPage/MenuPage";
import CartPage from "./Pages/CartPage/CartPage";
import OrderTypePage from "./Pages/OrderTypePage/OrderTypePage";
import ReceiptPage from "./Pages/ReceiptPage/ReceiptPage";
import MealPlansPage from "./Pages/MealPlansPage/MealPlansPage";
import LoyaltyBoardPage from "./Pages/LoyaltyBoardPage/LoyaltyBoardPage";
import TrackOrderPage from "./Pages/TrackOrderPage/TrackOrderPage";
import VacancyPage from "./Pages/Vacancy/Vacancies";
import VacancyItemDetails from "./Components/Vacancy/VacancyItemDetails";
import RidersPage from "./Pages/RidersPage/RidersPage";
import NotFound from "./Pages/NotFound/NotFound";
import ScrollToTop from "./Components/ScrollToTop";
import ScrollToTopButton from "./Components/ScrollToTopButton";

function AppRoutes() {
  const { routePrefix } = useAuth();
  const p = routePrefix; // e.g. "/admin", "/supervisor", "/kitchen", etc.

  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
      <FloatingCartButton />
      <FloatingWhatsAppButton />
      <Routes>
        {/* ── Customer Routes ── */}
        <Route element={<PublicRouteGuard />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/meal-plans" element={<MealPlansPage />} />
          <Route path="/loyalty-board" element={<LoyaltyBoardPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-type" element={<OrderTypePage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="/receipt/:orderId" element={<ReceiptPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/account/create" element={<CreateAccount />} />
          <Route path="/account/login" element={<UserLogin />} />
          <Route path="/account/dashboard" element={<UserDashboard />}>
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="/account/edit-profile" element={<EditProfile />} />
          <Route path="/careers" element={<VacancyPage />} />
          <Route path="/careers/:careerId" element={<VacancyItemDetails />} />
          <Route path="/riders" element={<RidersPage />} />
        </Route>

        {/* ── Staff Login (always /admin/login regardless of role) ── */}
        <Route path="/admin/login" element={<Login />} />

        {/* ── Admin-only Routes ── */}
        <Route element={<AdminGuard />}>
          <Route
            path={`${p}/outlet-management`}
            element={<OutletManagement />}
          />
          <Route path={`${p}/dashboard`} element={<Dashboard />} />
          <Route path={`${p}/users`} element={<AllUsers />} />
          <Route path={`${p}/users/:userId`} element={<SingleUser />} />
          <Route path={`${p}/payments`} element={<Payments />} />
          <Route path={`${p}/tax-vat`} element={<TaxAndVat />} />
          <Route path={`${p}/staff`} element={<StaffManagement />} />
          <Route path={`${p}/careers`} element={<Vacancies />} />
          <Route path={`${p}/discounts`} element={<DiscountManagement />} />
          <Route path={`${p}/career-openings`} element={<CareerOpenings />} />
          <Route path={`${p}/loyalty-settings`} element={<LoyaltySettings />} />
          <Route
            path={`${p}/locations`}
            element={<DeliveryLocationManagement />}
          />
          <Route path={`${p}/food-packaging`} element={<FoodPackaging />} />
          <Route path={`${p}/campaigns`} element={<Campaigns />} />
          <Route path={`${p}/settings`} element={<Settings />} />
        </Route>

        {/* ── Admin + Supervisor Routes ── */}
        <Route element={<AdminOrSupervisorGuard />}>
          {/* Nothing for now */}
        </Route>

        {/* ── Staff Routes (all roles) ── */}
        <Route element={<StaffGuard />}>
          <Route path={`${p}/create-order`} element={<CreateOrder />} />
          <Route path={`${p}/orders`} element={<OrderManagement />} />
          <Route path={`${p}/menu`} element={<AdminMenu />} />
          <Route path="/admin/bank-details" element={<BankDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Router>
              <AppRoutes />
            </Router>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
