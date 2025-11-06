import { createFileRoute } from '@tanstack/react-router'
import CreateAccount from '../../pages/authentication/createAccount/CreateAccount'

export const Route = createFileRoute('/_auth/create-account')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <CreateAccount/>
  </div>
}
