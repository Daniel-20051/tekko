import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useTokenStore } from '../store/token.store'
import { useLogout } from '../hooks/useAuth'
import axios from 'axios'

// This layout route protects all child routes
export const Route = createFileRoute('/_authenticated')({
  // beforeLoad runs before the route loads - perfect for auth checks
  beforeLoad: async ({ location }) => {
    // Check if access token exists in memory (Zustand store)
    let accessToken = useTokenStore.getState().accessToken
    
    // If no token, try to refresh (only attempt refresh when accessing protected routes)
    if (!accessToken) {
      try {
        // Attempt to refresh token using HttpOnly cookie
        // Use axios directly to avoid interceptor loop
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
        const response = await axios.post<{ accessToken: string }>(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        // Store the new access token
        useTokenStore.getState().setAccessToken(response.data.accessToken)
        accessToken = response.data.accessToken
      } catch (error) {
        // Refresh failed - no valid session, redirect to login
        useTokenStore.getState().clearAccessToken()
        throw redirect({
          to: '/',
          search: {
            // Save the page they tried to visit so we can redirect back after login
            redirect: location.href,
          },
        })
      }
    }

    // If still no token after refresh attempt, redirect to login
    if (!accessToken) {
      throw redirect({
        to: '/',
        search: {
          // Save the page they tried to visit so we can redirect back after login
          redirect: location.href,
        },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
          <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
          <nav className="space-y-2">
            <a href="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Overview
            </a>
            <a href="/dashboard/settings" className="block p-2 hover:bg-gray-700 rounded">
              Settings
            </a>
            <a href="/dashboard/profile" className="block p-2 hover:bg-gray-700 rounded">
              Profile
            </a>
          </nav>
          
          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
