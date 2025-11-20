import { motion } from 'framer-motion'
import { Bitcoin, Waves, DollarSign, Landmark, TrendingUp, ArrowUpRight } from 'lucide-react'

const wallets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '0.00521',
    value: 150000,
    change: '+2.4%',
    changeType: 'positive' as const,
    icon: Bitcoin,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '0.0125',
    value: 40000,
    change: '-1.2%',
    changeType: 'negative' as const,
    icon: Waves,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    balance: '60.50',
    value: 60000,
    change: '+0.1%',
    changeType: 'positive' as const,
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    name: 'Naira',
    symbol: 'NGN',
    balance: '0.00',
    value: 0,
    change: '0%',
    changeType: 'neutral' as const,
    icon: Landmark,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10'
  }
]

const WalletsSectionCompact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Your Wallets
        </h2>
        <button className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors">
          Manage
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {wallets.map((wallet, index) => {
          const Icon = wallet.icon
          const isPositive = wallet.changeType === 'positive'
          
          return (
            <motion.div
              key={wallet.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${wallet.bgColor}`}>
                    <Icon className={`w-4 h-4 ${wallet.color}`} />
                  </div>
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
                  <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isPositive 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-2.5 h-2.5 ${isPositive ? '' : 'rotate-180'}`} />
                    {wallet.change}
                  </div>
                )}
              </div>
              
              <div className="space-y-0.5">
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
  )
}

export default WalletsSectionCompact

