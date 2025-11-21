import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { useTokenStore } from '../store/token.store'
import { useLoadingStore } from '../store/loading.store'
import { useLogout } from '../hooks/useAuth'
import ThemeToggle from '../components/ui/ThemeToggle'
import Sidebar from '../components/pages/dashboard/Sidebar'
import { useState, useRef, useEffect } from 'react'
import { Bell, User, UserCircle, Settings, LogOut, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import type { RefreshTokenResponse } from '../types/auth'
import { showRefreshLoader, removeRefreshLoader } from '../utils/loader-utils'

// This layout route protects all child routes
export const Route = createFileRoute('/_authenticated')({
  // beforeLoad runs before the route loads - perfect for auth checks
  beforeLoad: async ({ location }) => {
    // Check if access token exists in memory (Zustand store)
    let accessToken = useTokenStore.getState().accessToken

    // If no token, try to refresh (only attempt refresh when accessing protected routes)
    if (!accessToken) {
      // Show loader IMMEDIATELY and synchronously before any async operations
      // This prevents the white flash
      showRefreshLoader()
      // Also set loading state for React components
      useLoadingStore.getState().setRefreshingToken(true)
      
      try {
        // Attempt to refresh token using HttpOnly cookie
        // Use axios directly to avoid interceptor loop
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
        const response = await axios.post<RefreshTokenResponse>(
          `${baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        // Extract accessToken from nested response structure
        if (!response.data.success) {
          throw new Error('Refresh token failed')
        }

        const newAccessToken = response.data.data.accessToken

        if (!newAccessToken) {
          throw new Error('No access token received from refresh endpoint')
        }

        // Store the new access token
        useTokenStore.getState().setAccessToken(newAccessToken)
        accessToken = newAccessToken
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
      } finally {
        // Remove loader from DOM and clear loading state
        removeRefreshLoader()
        useLoadingStore.getState().setRefreshingToken(false)
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
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="relative min-h-screen  bg-gray-50 dark:bg-dark-bg transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence mode="wait">
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 35,
                mass: 0.8
              }}
              className="fixed left-0 top-0 bottom-0 w-[280px] z-50 lg:hidden"
            >
              <div className="h-full bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-gray-800">
                {/* Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Menu</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                <Sidebar isOpen={true} onToggle={() => setMobileSidebarOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-[80px]'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-primary/50">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left - Mobile Toggle + Logo */}
              <div className="flex items-center gap-3 flex-1">
                {/* Mobile Sidebar Toggle Button - Left Side */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-primary/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>

                {/* Logo */}
                <div>
                  <img 
                    src="/Tekko-logo/cover.png" 
                    className="h-8 dark:hidden" 
                    alt="TEKKO" 
                  />
                  <img 
                    src="/Tekko-logo/vector/default-monochrome-white.svg" 
                    className="h-8 hidden dark:block" 
                    alt="TEKKO" 
                  />
                </div>
              </div>

              {/* Right Side: Notifications, Theme, User */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-primary/30 cursor-pointer transition-colors"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Chidi</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                      <User className="w-5 h-5" />
                    </div>
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-52 backdrop-blur-xl bg-white/95 dark:bg-dark-surface/95 rounded-xl shadow-2xl border border-gray-200 dark:border-primary/30 py-2 overflow-hidden z-50"
                      >
                        <button
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserCircle className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Logging out...</span>
                            </>
                          ) : (
                            <>
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-3 md:p-4 lg:p-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
