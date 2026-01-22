import { motion } from 'framer-motion'
import { TrendingUp, X, ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const Tier2UpgradeBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  if (!isVisible) return null

  const handleUpgradeNow = () => {
    navigate({ to: '/settings' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/30 dark:border-primary/50 p-4"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/70 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start gap-3 mb-3">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 bg-primary/20 dark:bg-primary/30 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary dark:text-primary" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Upgrade to Tier 2 - It's Quick & Easy!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Add your BVN in just one step and unlock powerful benefits. Takes less than a minute!
            </p>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Higher Limits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-gray-700 dark:text-gray-300">NGN Deposits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-gray-700 dark:text-gray-300">More Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-gray-700 dark:text-gray-300">Faster Processing</span>
              </div>
            </div>

            <button
              onClick={handleUpgradeNow}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors duration-150"
            >
              Upgrade Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="shrink-0 p-1.5 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Tier2UpgradeBanner
