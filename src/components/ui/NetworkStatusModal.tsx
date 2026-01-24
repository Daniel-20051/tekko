import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { WifiOff } from 'lucide-react'
import Spinner from './Spinner'

interface NetworkStatusModalProps {
  isOnline: boolean
}

const NetworkStatusModal = ({ isOnline }: NetworkStatusModalProps) => {
  // Only show modal when offline
  const isOpen = !isOnline

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              max-w-md
              w-[calc(100%-2rem)] sm:w-full
              bg-white dark:bg-dark-surface
              rounded-xl border border-gray-200 dark:border-primary/50
              shadow-2xl z-9999
              overflow-hidden
            "
          >
            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20">
                  <WifiOff className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Network Connection
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please check your internet connection and try again.
              </p>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Spinner size="sm" variant="gray" />
                <span>Waiting for connection...</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

export default NetworkStatusModal
