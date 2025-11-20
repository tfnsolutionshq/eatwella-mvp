import MailboxLayout from "../Components/Mailbox/MailboxLayout"
import DashboardLayout from "../DashboardLayout/DashboardLayout"

function mailbox() {
  return (
    <DashboardLayout>
      <MailboxLayout />
    </DashboardLayout>
  )
}

export default mailbox