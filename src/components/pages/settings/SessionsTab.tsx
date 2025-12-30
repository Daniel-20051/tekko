import { motion } from 'framer-motion'
import { useState } from 'react'
import { Monitor, Smartphone, Globe, Trash2, Loader2, AlertCircle, Laptop } from 'lucide-react'
import Button from '../../ui/Button'
import Alert from '../../ui/Alert'
import { useSessions, useTerminateSession } from '../../../hooks/useSettings'
import type { SessionData } from '../../../types/auth'

interface Session {
  id: string
  device: string
  location: string
  ip: string
  lastActive: string
  isCurrent: boolean
  icon: React.ComponentType<{ className?: string }>
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

// Helper function to map API session data to component session
const mapSessionData = (sessionData: SessionData, isCurrent: boolean): Session => {
  return {
    id: sessionData.id,
    device: sessionData.device,
    location: formatLocation(sessionData.city, sessionData.country),
    ip: sessionData.ipAddress,
    lastActive: formatRelativeTime(sessionData.lastActive),
    isCurrent,
    icon: getDeviceIcon(sessionData.device, sessionData.os)
  }
}

const SessionsTab = () => {
  const { data: sessionsData, isLoading, error, refetch } = useSessions()
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')
  const [showAlert, setShowAlert] = useState(false)
  const [terminatingSessionId, setTerminatingSessionId] = useState<string | null>(null)

  const { mutate: terminateSession } = useTerminateSession()

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

  // Find the current session ID
  const currentSession = mappedSessions.find(session => session.isCurrent)
  const currentSessionId = currentSession?.id || null

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center min-h-[200px] bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6"
      >
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">Loading sessions...</p>
      </motion.div>
    )
  }

  if (error || !sessionsData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center min-h-[200px] bg-white dark:bg-dark-surface rounded-xl border border-red-200 dark:border-red-900/50 p-6 text-red-600 dark:text-red-400"
      >
        <AlertCircle className="w-8 h-8 mb-3" />
        <p className="text-sm font-medium text-center mb-3">
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
        className="flex items-center justify-center min-h-[200px] bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">No active sessions found</p>
      </motion.div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      {/* Main Content - Active Sessions */}
      <div className="lg:col-span-2">
        <motion.div
          whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
          className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Active Sessions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your active sessions across devices
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {mappedSessions.length} active session{mappedSessions.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="space-y-3">
            {mappedSessions.map((session) => {
              const DeviceIcon = session.icon
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02, x: 4, transition: { duration: 0.15 } }}
                  className={`
                    p-4 rounded-lg border transition-all duration-150 cursor-default
                    ${session.isCurrent
                      ? 'border-primary/50 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 hover:shadow-md hover:bg-primary/10 dark:hover:bg-primary/15'
                      : 'border-gray-200 dark:border-primary/30 bg-gray-50 dark:bg-gray-800/30 hover:shadow-md hover:border-primary/40 dark:hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`
                        p-2 rounded-lg
                        ${session.isCurrent
                          ? 'bg-primary/20 dark:bg-primary/30'
                          : 'bg-gray-200 dark:bg-gray-700'
                        }
                      `}>
                        <DeviceIcon className={`
                          w-5 h-5
                          ${session.isCurrent
                            ? 'text-primary dark:text-primary'
                            : 'text-gray-600 dark:text-gray-400'
                          }
                        `} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {session.device}
                          </h3>
                          {session.isCurrent && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded-full">
                              Current Session
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Globe className="w-3.5 h-3.5" />
                            <span>{session.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span>IP: {session.ip}</span>
                            <span>•</span>
                            <span>Last active: {session.lastActive}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        disabled={terminatingSessionId === session.id}
                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
          className="lg:sticky lg:top-4"
        >
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150 cursor-default">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Terminate Sessions
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-primary/30 bg-gray-50 dark:bg-gray-800/30">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Terminate current session
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      End your current session only
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={terminatingSessionId === currentSessionId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    fullWidth
                    onClick={() => {
                      if (currentSessionId) {
                        handleTerminateSession(currentSessionId)
                      }
                    }}
                    disabled={!currentSessionId || terminatingSessionId === currentSessionId}
                  >
                    {terminatingSessionId === currentSessionId ? 'Terminating...' : 'Terminate'}
                  </Button>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Terminate all sessions
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      End all active sessions across all devices
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    fullWidth
                  >
                    Terminate All
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

