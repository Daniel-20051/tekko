import { createFileRoute} from '@tanstack/react-router'
import Login from '../../pages/authentication/login/Login'

export const Route = createFileRoute('/_auth/')({
  component: LoginRoute,
})

function LoginRoute() {
  return <Login />
}