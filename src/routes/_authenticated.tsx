import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'


// This layout route protects all child routes
export const Route = createFileRoute('/_authenticated')({
  // beforeLoad runs before the route loads - perfect for auth checks
  beforeLoad: async ({ location }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    
    if (!isAuthenticated) {
      // Redirect to login (root) if not authenticated
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
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    window.location.href = '/'
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
