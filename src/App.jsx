import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './Pages/Admin/Dashboard'
import Menu from './Pages/Admin/Menu'
import OrderManagement from './Pages/Admin/OrderManagement'
import DiscountManagement from './Pages/Admin/DiscountManagement'
import StaffManagement from './Pages/Admin/StaffManagement'
import Login from './Pages/Admin/Login'
import Homepage from './Pages/LandingPage/Homepage'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/discounts" element={<DiscountManagement />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
