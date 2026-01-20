import { motion } from 'framer-motion'
import { TrendingUp, PieChart, Download, Upload } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface PortfolioCardNewProps {
  totalValue: number
  change24h: number
  changeAmount: number
}

const PortfolioCardNew = ({ totalValue, change24h, changeAmount }: PortfolioCardNewProps) => {
  const navigate = useNavigate()
  const isPositive = change24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-xl bg-white dark:bg-black p-4 shadow-xl border border-gray-200 dark:border-gray-800"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium mb-1">
          Total Portfolio Value
        </p>
        
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            ₦{totalValue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
              isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${isPositive ? '' : 'rotate-180'}`} />
            <span className="font-bold text-sm">
              {isPositive ? '+' : ''}{change24h.toFixed(1)}%
            </span>
          </motion.div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            (₦{changeAmount.toLocaleString('en-NG')}) Last 24h
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors border border-gray-300 dark:border-gray-700"
          >
            <PieChart className="w-3.5 h-3.5" />
            View Analytics
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate({ to: '/deposit' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors shadow-lg shadow-primary/30"
          >
            <Download className="w-3.5 h-3.5" />
            Deposit
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate({ to: '/withdraw' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors border border-gray-300 dark:border-gray-700"
          >
            <Upload className="w-3.5 h-3.5" />
            Withdraw
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default PortfolioCardNew

