import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface AlertProps {
  message: string
  isVisible: boolean
  onClose: () => void
  type?: 'error' | 'success' | 'warning' | 'info'
  duration?: number
}

const Alert = ({ 
  message, 
  isVisible, 
  onClose, 
  type = 'error',
  duration = 5000 
}: AlertProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const typeStyles = {
    error: 'bg-white/90 dark:bg-dark-surface/90 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300',
    success: 'bg-white/90 dark:bg-dark-surface/90 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300',
    warning: 'bg-white/90 dark:bg-dark-surface/90 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
    info: 'bg-white/90 dark:bg-dark-surface/90 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
  }

  const iconStyles = {
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const alertContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30 
          }}
          className={`
            fixed top-4 right-4 z-[9999]
            max-w-md w-[calc(100%-2rem)]
            sm:w-auto
            rounded-xl border-2
            shadow-2xl
            backdrop-blur-xl
            ${typeStyles[type]}
            p-4
            flex items-start gap-3
          `}
        >
          <div className={`flex-shrink-0 ${iconStyles[type]}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`
              flex-shrink-0
              ${iconStyles[type]}
              hover:opacity-70
              transition-opacity
            `}
            aria-label="Close alert"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document body level for proper positioning
  if (typeof document !== 'undefined') {
    return createPortal(alertContent, document.body)
  }

  return alertContent
}

export default Alert

