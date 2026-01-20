import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Download, Upload, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Bitcoin, Waves, DollarSign, Landmark } from 'lucide-react'
import { useBalanceStore } from '../../../store/balance.store'
import { useCurrencyStore } from '../../../store/currency.store'
import type { Wallet, PortfolioTotal } from '../../../types/wallet'

interface PortfolioWithWalletsProps {
  wallets: Wallet[]
  portfolioTotal: PortfolioTotal
  isLoading?: boolean
}

// Currency configuration mapping
const currencyConfig: Record<string, { name: string; icon: typeof Bitcoin; color: string; bgColor: string }> = {
  BTC: {
    name: 'Bitcoin',
    icon: Bitcoin,
    color: 'text-orange-500 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/20'
  },
  ETH: {
    name: 'Ethereum',
    icon: Waves,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20'
  },
  USDT: {
    name: 'USDT',
    icon: DollarSign,
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-500/10 dark:bg-green-500/20'
  },
  NGN: {
    name: 'Naira',
    icon: Landmark,
    color: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-500/10 dark:bg-gray-500/20'
  },
  USD: {
    name: 'US Dollar',
    icon: DollarSign,
    color: 'text-green-600 dark:text-green-500',
    bgColor: 'bg-green-500/10 dark:bg-green-500/20'
  }
}

const PortfolioWithWallets = ({ wallets, portfolioTotal, isLoading }: PortfolioWithWalletsProps) => {
  const navigate = useNavigate()
  const [showWallets, setShowWallets] = useState(false)
  const { isBalanceHidden, toggleBalanceVisibility } = useBalanceStore()
  const { selectedCurrency } = useCurrencyStore()
  
  // Use 'portfolio' as the key for portfolio total balance visibility
  const portfolioKey = 'portfolio'
  const hideBalance = isBalanceHidden(portfolioKey)
  const toggleHideBalance = () => toggleBalanceVisibility(portfolioKey)
  
  // Get total portfolio value based on selected currency
  const totalValue = useMemo(() => {
    // Remove commas and other formatting characters before parsing
    const value = portfolioTotal[selectedCurrency] || '0'
    const cleanValue = value.replace(/,/g, '')
    return parseFloat(cleanValue) || 0
  }, [portfolioTotal, selectedCurrency])
  
  // Get currency symbol
  const currencySymbol = selectedCurrency === 'NGN' ? '₦' : '$'
  
  // Map API wallets to display format
  const displayWallets = useMemo(() => {
    return wallets.map((wallet) => {
      const config = currencyConfig[wallet.currency] || {
        name: wallet.currency,
        icon: DollarSign,
        color: 'text-gray-500 dark:text-gray-400',
        bgColor: 'bg-gray-500/10 dark:bg-gray-500/20'
      }
      
      // Get fiat value if available (from extended wallet type)
      const walletWithFiat = wallet as Wallet & { fiatValue?: { NGN: string; USD: string } }
      const fiatValue = walletWithFiat.fiatValue?.[selectedCurrency] || '0.00'
      const cleanFiatValue = fiatValue.replace(/,/g, '')
      const fiatValueNum = parseFloat(cleanFiatValue) || 0
      
      return {
        name: config.name,
        symbol: wallet.currency,
        balance: wallet.availableBalance,
        fiatValue: fiatValueNum,
        icon: config.icon,
        color: config.color,
        bgColor: config.bgColor
      }
    })
  }, [wallets, selectedCurrency])
  
  // For now, we'll show static change data (you can enhance this with historical data)
  const change24h: number = 0
  const changeAmount: number = 0
  const isPositive = change24h >= 0

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

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
        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium">
            Total Portfolio Value
          </p>
          
          {/* Currency Selector Pill */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-dark-bg rounded-full p-0.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => useCurrencyStore.getState().setCurrency('NGN')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                selectedCurrency === 'NGN'
                  ? 'bg-white dark:bg-primary/50 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              NGN
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => useCurrencyStore.getState().setCurrency('USD')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                selectedCurrency === 'USD'
                  ? 'bg-white dark:bg-primary/50 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              USD
            </motion.button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-all duration-300"
            animate={{ scale: hideBalance ? 1 : [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            key={selectedCurrency}
          >
            {hideBalance ? '*****' : `${currencySymbol}${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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

        {change24h !== 0 && (
          <div className="flex items-center gap-2 mb-4 transition-all duration-300">
            {hideBalance ? (
              <span className="text-gray-500 dark:text-gray-400 text-xs">*****</span>
            ) : (
              <>
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
                  ({currencySymbol}{changeAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) Last 24h
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-1.5 mb-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-1.5 px-2 py-3 rounded-md bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors shadow-lg shadow-primary/30"
          >
            <Download className="w-4 h-4" />
            Deposit
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate({ to: '/withdraw' })}
            className="flex items-center justify-center gap-1.5 px-2 py-3 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold transition-colors border border-gray-300 dark:border-gray-700"
          >
            <Upload className="w-4 h-4" />
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
              View Wallet Breakdown ({displayWallets.length})
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
                  {displayWallets.length > 0 ? (
                    displayWallets.map((wallet, index) => {
                      const Icon = wallet.icon
                      
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
                          </div>
                          
                          <div className="space-y-0.5 transition-all duration-300">
                            <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                              {hideBalance ? '*****' : `${wallet.balance} ${wallet.symbol}`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {hideBalance ? '*****' : `≈ ${currencySymbol}${wallet.fiatValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </p>
                          </div>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="col-span-2 text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                      No wallet balances found
                    </div>
                  )}
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

