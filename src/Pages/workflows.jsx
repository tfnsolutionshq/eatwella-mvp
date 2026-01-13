import Workflows from '../Components/Workflows/Workflows'
import OtherUsersScreen from '../Components/Workflows/OtherUsersScreen'
import Dashboardlayout from '../DashboardLayout/DashboardLayout'
import { useAuth } from '../context/AuthContext'

function workflows() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  return (
    <Dashboardlayout>
      {isAdmin ? <Workflows /> : <OtherUsersScreen />}
    </Dashboardlayout>
  )
}

export default workflows