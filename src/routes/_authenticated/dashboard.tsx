import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Dashboard Overview</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          🔒 This is a protected page! You can only see this if you're logged in.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-semibold text-green-900">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">$45.2K</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-semibold text-purple-900">Orders</h3>
            <p className="text-3xl font-bold text-purple-600">892</p>
          </div>
        </div>
      </div>
    </div>
  )
}
