import { motion } from 'framer-motion'
import { useState } from 'react'
import { Monitor, Smartphone, Trash2, Loader2, AlertCircle, Laptop, Info, Grid3x3 } from 'lucide-react'
import Button from '../../ui/Button'
import Alert from '../../ui/Alert'
import { useSessions, useTerminateSession } from '../../../hooks/useSettings'
import { useLogoutAll } from '../../../hooks/useAuth'
import type { SessionData } from '../../../types/auth'

interface Session {
  id: string
  device: string
  deviceName: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
  icon: React.ComponentType<{ className?: string }>
  os: string
  browser: string
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

// Helper function to format location
const formatLocation = (city: string, country: string): string => {
  if (city === 'Unknown' && country === 'Unknown') {
    return 'Unknown location'
  }
  if (city === 'Unknown') {
    return country
  }
  if (country === 'Unknown') {
    return city
  }
  return `${city}, ${country}`
}

// Helper function to get device icon
const getDeviceIcon = (device: string, os: string): React.ComponentType<{ className?: string }> => {
  const deviceLower = device.toLowerCase()
  const osLower = os.toLowerCase()

  if (deviceLower.includes('mobile') || deviceLower.includes('iphone') || deviceLower.includes('android')) {
    return Smartphone
  } else if (deviceLower.includes('tablet') || osLower.includes('ipad')) {
    return Monitor // Using Monitor for tablets as fallback
  } else if (deviceLower.includes('laptop') || osLower.includes('mac') || osLower.includes('windows') || osLower.includes('linux')) {
    return Laptop
  }
  return Monitor
}

// Helper function to format device name
const formatDeviceName = (device: string): string => {
  // Extract a cleaner device name from the device string
  // Example: "Mobile Chrome 143 on Android 6.0" -> "Personal Computer" or "Mobile Device"
  const deviceLower = device.toLowerCase()
  
  if (deviceLower.includes('mobile') || deviceLower.includes('android') || deviceLower.includes('iphone')) {
    return 'Mobile Device'
  } else if (deviceLower.includes('tablet') || deviceLower.includes('ipad')) {
    return 'Tablet'
  } else if (deviceLower.includes('chrome') || deviceLower.includes('firefox') || deviceLower.includes('safari') || deviceLower.includes('edge')) {
    return 'Personal Computer'
  }
  return 'Personal Computer'
}

// Windows OS Icon Component
const WindowsIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <Grid3x3 className="w-5 h-5 text-[#0078D4]" />
  </div>
)

// macOS Icon Component (Apple logo)
const MacOSIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  </div>
)

// Chrome Browser Icon Component
const ChromeIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg className="w-5 h-5" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M128.003 199.216c39.335 0 71.221-31.888 71.221-71.223S167.338 56.77 128.003 56.77S56.78 88.658 56.78 127.993s31.887 71.223 71.222 71.223"/>
      <path fill="#229342" d="M35.89 92.997Q27.92 79.192 17.154 64.02a127.98 127.98 0 0 0 110.857 191.981q17.671-24.785 23.996-35.74q12.148-21.042 31.423-60.251v-.015a63.993 63.993 0 0 1-110.857.017Q46.395 111.19 35.89 92.998"/>
      <path fill="#fbc116" d="M128.008 255.996A127.97 127.97 0 0 0 256 127.997A128 128 0 0 0 238.837 64q-36.372-3.585-53.686-3.585q-19.632 0-57.152 3.585l-.014.01a63.99 63.99 0 0 1 55.444 31.987a63.99 63.99 0 0 1-.001 64.01z"/>
      <path fill="#1a73e8" d="M128.003 178.677c27.984 0 50.669-22.685 50.669-50.67s-22.685-50.67-50.67-50.67c-27.983 0-50.669 22.686-50.669 50.67s22.686 50.67 50.67 50.67"/>
      <path fill="#e33b2e" d="M128.003 64.004H238.84a127.973 127.973 0 0 0-221.685.015l55.419 95.99l.015.008a63.993 63.993 0 0 1 55.415-96.014z"/>
    </svg>
  </div>
)

// Safari Browser Icon Component (Compass)
const SafariIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      {/* Blue compass circle with gradient */}
      <defs>
        <linearGradient id="safariBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#357ABD" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#safariBlue)" />
      
      {/* White tick marks around the circumference */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 - 90) * (Math.PI / 180)
        const x1 = 12 + 9 * Math.cos(angle)
        const y1 = 12 + 9 * Math.sin(angle)
        const x2 = 12 + (i % 3 === 0 ? 7.5 : 8.5) * Math.cos(angle)
        const y2 = 12 + (i % 3 === 0 ? 7.5 : 8.5) * Math.sin(angle)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.8" />
        )
      })}
      
      {/* Compass needle - red upper right, white lower left */}
      <path d="M12 12 L18 6" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 12 L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="white" />
    </svg>
  </div>
)

// Helper function to get OS name and icon
const getOSInfo = (os: string): { name: string; icon: React.ReactNode } => {
  const osLower = os.toLowerCase()
  if (osLower.includes('windows')) {
    return {
      name: 'Windows',
      icon: <WindowsIcon className="w-5 h-5" />
    }
  } else if (osLower.includes('mac') || osLower.includes('ios')) {
    return {
      name: osLower.includes('ios') ? 'iOS' : 'macOS',
      icon: <MacOSIcon className="w-5 h-5 text-gray-900 dark:text-gray-100" />
    }
  } else if (osLower.includes('linux')) {
    return {
      name: 'Linux',
      icon: <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  } else if (osLower.includes('android')) {
    return {
      name: 'Android',
      icon: <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }
  return {
    name: os || 'Unknown',
    icon: <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
  }
}

// Helper function to get browser name and icon
const getBrowserInfo = (browser: string): { name: string; icon: React.ReactNode } => {
  const browserLower = browser.toLowerCase()
  if (browserLower.includes('chrome')) {
    return {
      name: 'Chrome',
      icon: <ChromeIcon className="w-5 h-5" />
    }
  } else if (browserLower.includes('firefox')) {
    return {
      name: 'Firefox',
      icon: <Monitor className="w-5 h-5 text-orange-500" />
    }
  } else if (browserLower.includes('safari')) {
    return {
      name: 'Safari',
      icon: <SafariIcon className="w-5 h-5 text-blue-500" />
    }
  } else if (browserLower.includes('edge')) {
    return {
      name: 'Edge',
      icon: <Monitor className="w-5 h-5 text-blue-600" />
    }
  }
  return {
    name: browser || 'Unknown',
    icon: <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
  }
}

// Helper function to map API session data to component session
const mapSessionData = (sessionData: SessionData, isCurrent: boolean): Session & { os: string; browser: string; deviceName: string } => {
  return {
    id: sessionData.id,
    device: sessionData.device,
    deviceName: formatDeviceName(sessionData.device),
    location: formatLocation(sessionData.city, sessionData.country),
    ip: sessionData.ipAddress,
    lastActive: formatRelativeTime(sessionData.lastActive),
    isCurrent,
    icon: getDeviceIcon(sessionData.device, sessionData.os),
    os: sessionData.os,
    browser: sessionData.browser
  }
}

const SessionsTab = () => {
  const { data: sessionsData, isLoading, error, refetch } = useSessions()
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')
  const [showAlert, setShowAlert] = useState(false)
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null)

  const { mutate: terminateSession } = useTerminateSession()
  const { mutate: logoutAll, isPending: isLoggingOutAll } = useLogoutAll()

  const handleTerminateSession = (sessionId: string) => {
    setTerminatingSessionId(sessionId)
    terminateSession(sessionId, {
      onSuccess: () => {
        setAlertMessage('Session terminated successfully')
        setAlertType('success')
        setShowAlert(true)
        setTerminatingSessionId(null)
      },
      onError: (error: Error) => {
        setAlertMessage(error.message || 'Failed to terminate session')
        setAlertType('error')
        setShowAlert(true)
        setTerminatingSessionId(null)
      },
    })
  }

  // Determine current session (most recently active session is likely the current one)
  const mappedSessions: Session[] = sessionsData
    ? sessionsData
        .filter(session => session.isActive)
        .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
        .map((session, index) => mapSessionData(session, index === 0))
    : []

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center min-h-[200px] bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4 md:p-6"
      >
        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-primary" />
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-2">Loading sessions...</p>
      </motion.div>
    )
  }

  if (error || !sessionsData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center min-h-[200px] bg-white dark:bg-dark-surface rounded-xl border border-red-200 dark:border-red-900/50 p-4 md:p-6 text-red-600 dark:text-red-400"
      >
        <AlertCircle className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3" />
        <p className="text-xs md:text-sm font-medium text-center mb-2 md:mb-3">
          {error instanceof Error ? error.message : 'Failed to load sessions'}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Retry
        </Button>
      </motion.div>
    )
  }

  if (mappedSessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center min-h-[200px] bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4 md:p-6"
      >
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">No active sessions found</p>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4"
    >
      {/* Main Content - Active Sessions */}
      <div className="lg:col-span-2">
        <motion.div
          whileHover={{ scale: 1.002, transition: { duration: 0.15 } }}
          className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4 md:p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-0.5 md:mb-1">
                Active Sessions
              </h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Manage your active sessions across devices
              </p>
            </div>
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              {mappedSessions.length} active session{mappedSessions.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Advice Message */}
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50">
            <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
              The devices and browsers you're signed in to are listed below. If you see unfamiliar locations, click "X" and then change your password.
            </p>
          </div>

          <div className="space-y-3">
            {mappedSessions.map((session) => {
              const DeviceIcon = session.icon
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Device Icon */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-[#1E3A8A] dark:bg-[#1E3A8A] flex items-center justify-center">
                        <DeviceIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Left-Center: Device Name and Time */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                        {session.deviceName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.lastActive}
                      </p>
                    </div>

                    {/* Center: OS and Browser Icons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="group relative">
                        {getOSInfo(session.os).icon}
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                          {getOSInfo(session.os).name}
                        </div>
                      </div>
                      <div className="group relative">
                        {getBrowserInfo(session.browser).icon}
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                          {getBrowserInfo(session.browser).name}
                        </div>
                      </div>
                    </div>

                    {/* Right-Center: Location with Info Icon */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {session.location}
                      </span>
                      <Info className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </div>

                    {/* Far Right: Status Badge or Terminate Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {session.isCurrent ? (
                        <span className="px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full">
                          Current Session
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTerminateSession(session.id)}
                          disabled={terminatingSessionId === session.id}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Terminate session"
                        >
                          {terminatingSessionId === session.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Sidebar - Terminate Sessions Actions */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.002, transition: { duration: 0.15 } }}
          className="lg:sticky lg:top-4"
        >
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4 md:p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150 cursor-default">
            <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Terminate Sessions
            </h2>
            <div className="space-y-2 md:space-y-3">
              <div className="p-3 md:p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
                <div className="flex flex-col gap-2 md:gap-3">
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-0.5 md:mb-1">
                      Terminate all sessions
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      End all active sessions across all devices
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={isLoggingOutAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    fullWidth
                    onClick={() => {
                      logoutAll(undefined, {
                        onSuccess: () => {
                          setAlertMessage('All sessions terminated successfully')
                          setAlertType('success')
                          setShowAlert(true)
                        },
                        onError: (error: Error) => {
                          setAlertMessage(error.message || 'Failed to terminate all sessions')
                          setAlertType('error')
                          setShowAlert(true)
                        },
                      })
                    }}
                    disabled={isLoggingOutAll}
                  >
                    {isLoggingOutAll ? 'Terminating...' : 'Terminate All'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alert for session termination */}
      <Alert
        message={alertMessage}
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertType}
        duration={4000}
      />
    </motion.div>
  )
}

export default SessionsTab

