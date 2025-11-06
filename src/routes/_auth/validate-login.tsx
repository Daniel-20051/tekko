import { createFileRoute } from '@tanstack/react-router'
import ValidateLogin from '../../pages/authentication/validateLogin/ValidateLogin'

export const Route = createFileRoute('/_auth/validate-login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || undefined,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ValidateLogin />
}
