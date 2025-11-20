import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Login from './Pages/login'
import ForgotPassword from './Pages/forgot-password'
import ResetPassword from './Pages/reset-password'
import Dashboard from './Pages/dashboard'
import ComposeMemoPage from './Pages/ComposeMemoPage'
import Mailbox from './Pages/mailbox'
import Reports from './Pages/reports'
import MailContent from './Components/Mailbox/MailContent'
import Administration from './Pages/administration'
import Settings from './Pages/settings'
import Workflows from './Pages/workflows'
import CreateWorkflowPage from './Pages/create-workflow'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compose-memo" element={<ComposeMemoPage />} />
            <Route path="/mailbox" element={<Mailbox />} />
            <Route path="/mail-content/:id" element={<MailContent />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/create-workflow" element={<CreateWorkflowPage />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
