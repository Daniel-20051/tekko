import { motion } from 'framer-motion'
import { useState } from 'react'
import { Monitor, Smartphone, Trash2, Loader2, AlertCircle } from 'lucide-react'
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
    return MobilePhoneIcon
  } else if (deviceLower.includes('tablet') || osLower.includes('ipad')) {
    return Monitor // Using Monitor for tablets as fallback
  } else if (deviceLower.includes('laptop') || osLower.includes('mac') || osLower.includes('windows') || osLower.includes('linux')) {
    return PersonalComputerIcon
  }
  return PersonalComputerIcon
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

// Mobile Phone Icon Component
const MobilePhoneIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" className="w-full h-full">
      <g fill="none">
        <path fill="#1eb1a8" fillOpacity="0.16" d="M15.6 2H8.4A2.4 2.4 0 0 0 6 4.4v15.2A2.4 2.4 0 0 0 8.4 22h7.2a2.4 2.4 0 0 0 2.4-2.4V4.4A2.4 2.4 0 0 0 15.6 2"/>
        <path stroke="#1eb1a8" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M11 5h2M8.4 2h7.2A2.4 2.4 0 0 1 18 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H8.4A2.4 2.4 0 0 1 6 19.6V4.4A2.4 2.4 0 0 1 8.4 2"/>
      </g>
    </svg>
  </div>
)

// Personal Computer Icon Component
const PersonalComputerIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 128 128" className="w-full h-full">
      <path fill="#b7d5e5" d="M106 24.79H22.15c-1.92 0-3.48 1.56-3.48 3.48v57.59c0 1.92 1.56 3.48 3.48 3.48H106c1.92 0 3.48-1.56 3.48-3.48V28.27c0-1.92-1.55-3.48-3.48-3.48"/>
      <radialGradient id="SVG8yic8bdE" cx="48.408" cy="13.024" r="75.465" gradientTransform="matrix(1 0 0 1.0843 0 -10.19)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2f7889"/>
        <stop offset="1" stopColor="#424242"/>
      </radialGradient>
      <path fill="url(#SVG8yic8bdE)" d="M104.75 83.2H23.4l.96-52.27h79.43z"/>
      <path fill="#2f7889" d="M121.09 123.82H7.59q-.645 0-1.2-.09c-2.88-.44-4.21-4.18-2.5-6.74l.39-.59h119.59l.4.6c1.86 2.78.12 6.76-3.04 6.81c-.04.01-.09.01-.14.01"/>
      <path fill="#eee" d="M106.84 90.41H20.6c-1.27 0-2.54.77-3.25 1.99l-14 25.48c-.59.88-.01 2.12.99 2.12H123.8c1 0 1.58-1.24.99-2.12l-14.71-25.63c-.7-1.08-1.97-1.84-3.24-1.84"/>
      <path fill="#b7d5e5" d="M86.36 115.52H41.8l2.85-7.98h39.07z"/>
      <path fill="#69a1ba" d="m72.69 94.84l-.27-2.2h-3.44l.13 2.2zm-5.55 0l-.14-2.2h-3.45v2.2zm26.47 0l-.81-2.2h-3.26l.68 2.2zm-5.25 0l-.68-2.2h-3.32l.54 2.2zm-5.18 0l-.54-2.2h-3.37l.41 2.2zm18.93 0l-.95-2.2h-6.71l.82 2.2zm-24.5 0l-.41-2.2h-3.41l.28 2.2zm-43.85 0l.68-2.2h-3.26l-.81 2.2zm16.75 0l.27-2.2h-3.41l-.4 2.2zm-11.16 0l.54-2.2h-3.32l-.67 2.2zm-11.18 0l.81-2.2H25.8l-.95 2.2zm16.76 0l.41-2.2h-3.37l-.54 2.2zm11.15 0l.14-2.2h-3.44l-.27 2.2zm5.57 0v-2.2H58.2l-.14 2.2zm22.13 8.89H44.36l-.75 2.2h41.08zm18.37 2.2l-1.21-2.2h6.54l.95 2.2zm-15.4 0l-.83-2.2h6.29l.96 2.2zm8.64 0l-.96-2.2h4.31l1.1 2.2zm-69.72 0l1.21-2.2h-6.54l-.95 2.2zm15.4 0l.83-2.2h-6.29l-.96 2.2zm-8.65 0l.97-2.2h-4.31l-1.11 2.2zm-2.71-7.42l.82-2.19h-6.67l-.95 2.19zm68.24 0l-.81-2.19h6.66l.95 2.19zm-1.7 0l-.96-2.19h-3.85l.82 2.19zm-10.02 0l-.65-2.19h3.85l.78 2.19zm-6.04 0l-.47-2.19h3.85l.6 2.19zm-6.04 0l-.28-2.19h3.84l.43 2.19zm-6.03 0l-.11-2.19h3.85l.24 2.19zm-6.04 0l.07-2.19H66l.06 2.19zm-6.04 0l.25-2.19h3.85l-.11 2.19zm-6.03 0l.42-2.19h3.85l-.29 2.19zm-6.04 0l.6-2.19h3.85l-.47 2.19zm-6.04 0l.78-2.19h3.85l-.64 2.19zm-6.03 0l.95-2.19h3.85l-.82 2.19zm-2.2 3.71l.81-2.2h-8.75l-.95 2.2zm66.17 0l-.77-2.2h-4.17l.64 2.2zm-10.94 0l-.48-2.2h4.16l.62 2.2zm-6.65 0l-.32-2.2h4.17l.45 2.2zm-6.64 0l-.17-2.2h4.17l.3 2.2zm-6.64 0l-.01-2.2h4.16l.15 2.2zm-6.64 0l.14-2.2h4.17l-.01 2.2zm-6.65 0l.3-2.2h4.17l-.17 2.2zm-6.64 0l.46-2.2h4.16l-.32 2.2zm-6.64 0l.61-2.2h4.17l-.48 2.2zm-6.65 0l.77-2.2h4.17l-.63 2.2zm65.69 0l-.82-2.2h8.75l.95 2.2z" opacity="0.57"/>
      <path fill="#b7d5e5" d="M124.73 117.88L110.39 92.4c-.71-1.07-1.98-1.84-3.25-1.84c0 0 1.22 1.1 1.59 1.63l12.59 23.59c.56 1.02-.18 2.26-1.34 2.26H7.96c-1.15 0-1.89-1.23-1.35-2.24l11.95-23.18c.35-.6 1.88-1.99 1.88-1.99h-.45c-1.27 0-2.54.77-3.25 1.99L3.28 117.88c-.59.88-.01 2.12.99 2.12h119.46c1.01 0 1.59-1.24 1-2.12"/>
      <path fill="none" stroke="#eee" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2.936" d="M25.97 28.02h13.21"/>
      <path fill="#75a7bc" d="M109.37 30.11c0-1.04-1.01-1.12-1.01.11v55.8c0 1.34-1.09 2.43-2.43 2.43H22.08c-1.34 0-2.43-1.09-2.43-2.43v-55.8c0-1.23-1.01-1.15-1.01-.11l-.95 55.91c0 2.42 1.24 4.39 4.39 4.39h83.85c2.73 0 4.39-1.97 4.39-4.39z"/>
    </svg>
  </div>
)

// Windows OS Icon Component
const WindowsIcon = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 256 256" className="w-5 h-5">
      <g fill="none">
        <g clipPath="url(#SVG9PUMWdIu)">
          <path fill="#242938" d="M196 0H60C26.863 0 0 26.863 0 60v136c0 33.137 26.863 60 60 60h136c33.137 0 60-26.863 60-60V60c0-33.137-26.863-60-60-60"/>
          <path fill="#00adef" d="m40 65.663l70.968-9.665l.032 68.455l-70.934.404zm70.935 66.677l.055 68.515l-70.934-9.753l-.004-59.221zm8.602-77.607L213.636 41v82.582l-94.099.748zm94.121 78.251l-.022 82.211l-94.099-13.281l-.131-69.083z"/>
        </g>
        <defs>
          <clipPath id="SVG9PUMWdIu">
            <path fill="#fff" d="M0 0h256v256H0z"/>
          </clipPath>
        </defs>
      </g>
    </svg>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 md:mb-6">
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
                  {/* Mobile Layout: Stacked */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Top Row: Icon, Device Name, and Action */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Device Icon */}
                      <div className="shrink-0 flex items-center">
                        <DeviceIcon className="w-14 h-14" />
                      </div>

                      {/* Device Name and Time */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                          {session.deviceName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session.lastActive}
                        </p>
                      </div>

                      {/* Action Button/Badge - Mobile: Right aligned */}
                      <div className="flex items-center shrink-0 sm:hidden">
                        {session.isCurrent ? (
                          <span className="px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full whitespace-nowrap">
                            Current
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

                    {/* Bottom Row: OS, Browser, Location - Mobile: Stacked */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pl-[60px] sm:pl-0">
                      {/* OS and Browser Icons */}
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

                      {/* Location */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          {session.location}
                        </span>
                      </div>
                    </div>

                    {/* Action Button/Badge - Desktop: Right aligned */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      {session.isCurrent ? (
                        <span className="px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full whitespace-nowrap">
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

