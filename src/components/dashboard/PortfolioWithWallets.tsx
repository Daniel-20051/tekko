import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, PieChart, Download, Upload, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Bitcoin, Waves, DollarSign, Landmark } from 'lucide-react'
import { useBalanceStore } from '../../store/balance.store'

interface PortfolioWithWalletsProps {
  totalValue: number
  change24h: number
  changeAmount: number
}

const wallets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '0.00521',
    value: 150000,
    change: '+2.4%',
    changeType: 'positive' as const,
    icon: Bitcoin,
    color: 'text-orange-500 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/20'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '0.0125',
    value: 40000,
    change: '-1.2%',
    changeType: 'negative' as const,
    icon: Waves,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20'
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    balance: '60.50',
    value: 60000,
    change: '+0.1%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-500/10 dark:bg-green-500/20'
  },
  {
    name: 'Naira',
    symbol: 'NGN',
    balance: '0.00',
    value: 0,
    change: '0%',
    changeType: 'neutral' as const,
    icon: Landmark,
    color: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-500/10 dark:bg-gray-500/20'
  }
]

const PortfolioWithWallets = ({ totalValue, change24h, changeAmount }: PortfolioWithWalletsProps) => {
  const [showWallets, setShowWallets] = useState(false)
  const { hideBalance, toggleHideBalance } = useBalanceStore()
  const isPositive = change24h >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 p-4">
        <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium mb-1">
          Total Portfolio Value
        </p>
        
        <div className="flex items-center gap-3 mb-2">
          <motion.h2 
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${hideBalance ? 'blur-md select-none' : ''} transition-all duration-300`}
            animate={{ scale: hideBalance ? 1 : [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            ₦{totalValue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.h2>
          
          {/* Hide/Show Balance Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleHideBalance}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={hideBalance ? 'Show balance' : 'Hide balance'}
          >
            {hideBalance ? (
              <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </motion.button>
        </div>

        <div className={`flex items-center gap-2 mb-4 ${hideBalance ? 'blur-md select-none' : ''} transition-all duration-300`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
            <span className="font-bold text-xs">
              {isPositive ? '+' : ''}{change24h.toFixed(1)}%
            </span>
          </motion.div>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            (₦{changeAmount.toLocaleString('en-NG')}) Last 24h
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-1.5 mb-3">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors shadow-lg shadow-primary/30"
          >
            <Download className="w-3.5 h-3.5" />
            Deposit
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors border border-gray-300 dark:border-gray-700"
          >
            <Upload className="w-3.5 h-3.5" />
            Withdraw
          </motion.button>
        </div>

        {/* Expandable Wallets Section */}
        <div className="border-t  border-gray-200 dark:border-primary/50 pt-3">
          <motion.button
            onClick={() => setShowWallets(!showWallets)}
            className="w-full flex items-center cursor-pointer justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-primary/30 transition-colors"
            whileHover={{ x: 4 }}
          >
            <span className="text-xs  font-semibold text-gray-900 dark:text-white">
              View Wallet Breakdown ({wallets.length})
            </span>
            <motion.div
              animate={{ rotate: showWallets ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showWallets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {wallets.map((wallet, index) => {
                    const Icon = wallet.icon
                    const isPositive = wallet.changeType === 'positive'
                    
                    return (
                      <motion.div
                        key={wallet.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.005, y: -1 }}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-primary/50 hover:border-primary dark:hover:border-primary hover:bg-gray-100 dark:hover:bg-primary/10 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <motion.div 
                              className={`p-1.5 rounded-md ${wallet.bgColor}`}
                              whileHover={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon className={`w-4 h-4 ${wallet.color}`} />
                            </motion.div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-xs">
                                {wallet.name}
                              </h3>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                {wallet.symbol}
                              </p>
                            </div>
                          </div>
                          
                          {wallet.changeType !== 'neutral' && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                isPositive 
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                                  : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              }`}
                            >
                              <TrendingUp className={`w-2.5 h-2.5 ${isPositive ? '' : 'rotate-180'}`} />
                              {wallet.change}
                            </motion.div>
                          )}
                        </div>
                        
                        <div className={`space-y-0.5 ${hideBalance ? 'blur-md select-none' : ''} transition-all duration-300`}>
                          <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                            {wallet.balance} {wallet.symbol}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ≈ ₦{wallet.value.toLocaleString('en-NG')}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default PortfolioWithWallets

