import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from 'lucide-react'

const activities = [
  {
    type: 'buy',
    asset: 'Bitcoin',
    amount: '0.0002 BTC',
    value: '₦18,500',
    time: '2 hours ago',
    icon: TrendingUp,
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  {
    type: 'sell',
    asset: 'Ethereum',
    amount: '0.005 ETH',
    value: '₦16,000',
    time: 'Yesterday',
    icon: TrendingDown,
    color: 'text-red-500 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  },
  {
    type: 'deposit',
    asset: 'Naira',
    amount: '₦50,000',
    value: '₦50,000',
    time: '2 days ago',
    icon: Wallet,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    type: 'buy',
    asset: 'USDT',
    amount: '30.50 USDT',
    value: '₦50,325',
    time: '3 days ago',
    icon: TrendingUp,
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  }
]

const ActivityCard = () => {
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
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={index}
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
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {activity.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ActivityCard

