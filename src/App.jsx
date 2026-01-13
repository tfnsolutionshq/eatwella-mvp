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
import WorkflowDetailsPage from './Pages/workflow-details'
import WorkflowAdminDetailsPage from './Pages/workflow-admin-details'
import ProfilePage from './Pages/profile'
import ActivityLogsPage from './Pages/activity-logs'
import RecordMemoPage from './Pages/RecordMemo/recordmemo'
import RecordExternalMemoPage from './Pages/RecordMemo/record-external'
import RecordExternalAttachmentsPage from './Pages/RecordMemo/record-external-attachments'
import RecordExternalAssignmentPage from './Pages/RecordMemo/record-external-assignment'
import RecordExternalReviewPage from './Pages/RecordMemo/record-external-review'
import RecordExternalSuccessPage from './Pages/RecordMemo/record-external-success'
import ViewExternalMemoPage from './Pages/ViewRecordMemo/view-external-memo'
import UsersPage from './Pages/Users/users'
import UserMemosPage from './Pages/Users/UserMemosPage'
import AllMemosPage from './Pages/Users/AllMemosPage'
import AdminMailContent from './Components/Users/AdminMailContent'

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
            <Route path="/record-memo" element={<RecordMemoPage />} />
            <Route path="/record-external-memo" element={<RecordExternalMemoPage />} />
            <Route path="/record-external-attachments" element={<RecordExternalAttachmentsPage />} />
            <Route path="/record-external-assignment" element={<RecordExternalAssignmentPage />} />
            <Route path="/record-external-review" element={<RecordExternalReviewPage />} />
            <Route path="/record-external-success" element={<RecordExternalSuccessPage />} />
            <Route path="/view-external-memo" element={<ViewExternalMemoPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/create-workflow" element={<CreateWorkflowPage />} />
            <Route path="/edit-workflow/:id" element={<CreateWorkflowPage />} />
            <Route path="/workflow/:id" element={<WorkflowDetailsPage />} />
            <Route path="/workflow-admin/:id" element={<WorkflowAdminDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:userId/memos" element={<UserMemosPage />} />
            <Route path="/admin/all-memos" element={<AllMemosPage />} />
            <Route path="/admin/mail-content/:id" element={<AdminMailContent />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
