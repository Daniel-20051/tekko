import { motion } from 'framer-motion'
import { ShieldAlert, X, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const KycVerificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  if (!isVisible) return null

  const handleVerifyNow = () => {
    navigate({ to: '/settings/kyc' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-500/30 p-4"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-500/30 rounded-lg flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Complete Your KYC Verification
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Verify your identity to unlock higher transaction limits and access all platform features.
          </p>
          <button
            onClick={handleVerifyNow}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
          >
            Verify Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default KycVerificationBanner
