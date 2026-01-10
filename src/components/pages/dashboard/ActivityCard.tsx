import { motion } from 'framer-motion'
import { TrendingUp, ArrowUpRight, ArrowDownLeft, ArrowUpFromLine, Repeat2, Wallet } from 'lucide-react'
import { useTransactions } from '../../../hooks/useWallet'
import { formatRelativeTime, formatCurrency } from '../../../utils/time.utils'
import type { Transaction, TransactionType } from '../../../types/transaction'
import { useMemo } from 'react'

// Currency name mapping
const currencyNames: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'USDT',
  NGN: 'Naira',
  USD: 'US Dollar'
}

// Transaction type configuration
const transactionConfig: Record<TransactionType, { 
  icon: typeof TrendingUp
  color: string
  bgColor: string
}> = {
  deposit: {
    icon: ArrowDownLeft,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  withdrawal: {
    icon: ArrowUpFromLine,
    color: 'text-orange-500 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  },
  transfer: {
    icon: Repeat2,
    color: 'text-purple-500 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  trade: {
    icon: TrendingUp,
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  fee: {
    icon: Wallet,
    color: 'text-gray-500 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30'
  }
}

const ActivityCard = () => {
  // Fetch recent transactions (limit to 4 for dashboard)
  const { data: transactionsData, isLoading } = useTransactions({ limit: 4 })
  
  // Format transactions for display
  const activities = useMemo(() => {
    if (!transactionsData?.transactions) return []
    
    return transactionsData.transactions.map((tx: Transaction) => {
      const config = transactionConfig[tx.type]
      const currencyName = currencyNames[tx.currency] || tx.currency
      const formattedAmount = formatCurrency(tx.amount, tx.currency)
      
      // Calculate NGN value (placeholder - you may want to fetch real exchange rates)
      const exchangeRates: Record<string, number> = {
        BTC: 50000000, // Example rate
        ETH: 3000000,  // Example rate
        USDT: 1650,    // Example rate
        USD: 1650,     // Example rate
        NGN: 1
      }
      
      const valueNGN = parseFloat(tx.amount) * (exchangeRates[tx.currency] || 1)
      
      return {
        id: tx.id,
        type: tx.type,
        asset: currencyName,
        currency: tx.currency,
        amount: `${formattedAmount} ${tx.currency}`,
        value: tx.currency === 'NGN' ? '' : `₦${valueNGN.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        time: formatRelativeTime(tx.createdAt),
        status: tx.status,
        icon: config.icon,
        color: config.color,
        bgColor: config.bgColor
      }
    })
  }, [transactionsData])

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-b-xl border border-gray-200 dark:border-primary/50 p-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="space-y-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-2 p-2 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-dark-surface rounded-b-xl border border-gray-200 dark:border-primary/50 p-3 flex-1"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <button className="text-[10px] text-primary hover:text-primary/80 font-semibold flex items-center gap-0.5 transition-colors">
          View All
          <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>

      <div className="space-y-1.5">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
            No recent activity
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-primary/30 transition-colors cursor-pointer group"
              >
                <motion.div 
                  className={`p-1.5 rounded-md ${activity.bgColor}`}
                  whileHover={{ rotate: 15 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} {activity.asset}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`text-xs font-bold ${activity.color}`}>
                    {activity.amount}
                  </p>
                  {activity.value && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {activity.value}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}

export default ActivityCard

