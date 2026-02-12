import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Pages/Admin/Dashboard'
import AdminMenu from './Pages/Admin/Menu'
import OrderManagement from './Pages/Admin/OrderManagement'
import DiscountManagement from './Pages/Admin/DiscountManagement'
import StaffManagement from './Pages/Admin/StaffManagement'
import Login from './Pages/Admin/Login'
import Homepage from './Pages/LandingPage/Homepage'
import MenuPage from './Pages/MenuPage/MenuPage'
import CartPage from './Pages/CartPage/CartPage'
import OrderTypePage from './Pages/OrderTypePage/OrderTypePage'
import PaymentPage from './Pages/PaymentPage/PaymentPage'
import ReceiptPage from './Pages/ReceiptPage/ReceiptPage'
import MealPlansPage from './Pages/MealPlansPage/MealPlansPage'
import LoyaltyBoardPage from './Pages/LoyaltyBoardPage/LoyaltyBoardPage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/meal-plans" element={<MealPlansPage />} />
        <Route path="/loyalty-board" element={<LoyaltyBoardPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-type" element={<OrderTypePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/discounts" element={<DiscountManagement />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
