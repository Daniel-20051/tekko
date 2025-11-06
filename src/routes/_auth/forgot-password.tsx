import { createFileRoute } from '@tanstack/react-router'
import PasswordReset from '../../pages/authentication/passwordReset/passwordReset'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PasswordReset />
}
