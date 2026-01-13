"use client"
      
import { useAuth } from "../context/AuthContext"
import DashboardLayout from "../DashboardLayout/DashboardLayout"
import DashboardContent from "../Components/Dashboard/Dashboard"
import AdminDashboard from "../Components/Dashboard/AdminDashboard"

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <DashboardLayout>
      {isAdmin ? <AdminDashboard /> : <DashboardContent />}
    </DashboardLayout>
  )
}
