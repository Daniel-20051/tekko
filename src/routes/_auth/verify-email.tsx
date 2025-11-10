import { createFileRoute } from '@tanstack/react-router'
import VerifyEmail from '../../pages/authentication/verifyEmail/VerifyEmail'

export const Route = createFileRoute('/_auth/verify-email')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <VerifyEmail />
}
