import { motion, useAnimationControls } from 'framer-motion'
import { Bitcoin, Waves, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'

const marketData = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '₦95.5M',
    change: 2.4,
    icon: Bitcoin,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: '₦3.2M',
    change: -1.2,
    icon: Waves,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    price: '₦1,650',
    change: 0.1,
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  }
]

const MarketOverviewCompact = () => {
  const controls = useAnimationControls()

  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    }))
  }, [controls])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Market Overview
        </h2>
        <button className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors">
          View All
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {marketData.map((crypto, index) => {
          const Icon = crypto.icon
          const isPositive = crypto.change >= 0
          
          return (
            <motion.div
              key={crypto.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-primary/5 border border-gray-200 dark:border-primary/5 hover:border-primary dark:hover:border-primary hover:bg-gray-100 dark:hover:bg-primary/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <motion.div 
                  className={`p-2 rounded-md ${crypto.bgColor}`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={`w-4 h-4 ${crypto.color}`} />
                </motion.div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {crypto.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {crypto.symbol}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                    {crypto.price}
                  </p>
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${
                    isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
                    {isPositive ? '+' : ''}{crypto.change.toFixed(1)}%
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors"
                >
                  Trade
                </motion.button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default MarketOverviewCompact

