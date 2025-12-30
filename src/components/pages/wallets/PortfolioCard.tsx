import { motion } from 'framer-motion'
import { Bitcoin } from 'lucide-react'

const PortfolioCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      {/* Portfolio Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-orange-500/10 dark:bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Bitcoin className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">1.95232 BTC</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">$47,148.42</p>
          </div>
        </div>
        
        {/* Settings Icon */}
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-24 mb-4 -mx-1">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
          <defs>
            <linearGradient id="chartGradientOrange" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Chart line path */}
          <path
            d="M 0 80 L 40 75 L 80 85 L 120 60 L 160 65 L 200 55 L 240 45 L 280 35 L 320 40 L 360 30 L 400 35"
            fill="none"
            stroke="rgb(249, 115, 22)"
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          {/* Filled area */}
          <path
            d="M 0 80 L 40 75 L 80 85 L 120 60 L 160 65 L 200 55 L 240 45 L 280 35 L 320 40 L 360 30 L 400 35 L 400 100 L 0 100 Z"
            fill="url(#chartGradientOrange)"
          />
        </svg>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-base font-semibold transition-colors"
        >
          Send
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white text-base font-semibold transition-colors"
        >
          Receive
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PortfolioCard

