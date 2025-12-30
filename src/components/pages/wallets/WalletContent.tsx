import { motion } from 'framer-motion'
import { Download, Repeat2 } from 'lucide-react'

interface Transaction {
  id: string
  type: 'buy' | 'transfer' | 'swap'
  asset: string
  amount: string
  amountUSD: string
  date: string
  time: string
  status: 'pending' | 'completed'
}

const pendingTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'buy',
    asset: 'USDT',
    amount: '1024.53',
    amountUSD: '-1002.96',
    date: '23 Jul at',
    time: '12:59 AM',
    status: 'pending'
  }
]

const completedTransactions: Transaction[] = [
  {
    id: 'tx-2',
    type: 'buy',
    asset: 'USDT',
    amount: '7104.23',
    amountUSD: '-7050.47',
    date: '23 Jul at',
    time: '12:59 AM',
    status: 'completed'
  },
  {
    id: 'tx-3',
    type: 'buy',
    asset: 'USDT',
    amount: '601.77',
    amountUSD: '-590.34',
    date: '23 Jul at',
    time: '12:59 AM',
    status: 'completed'
  },
  {
    id: 'tx-4',
    type: 'transfer',
    asset: 'USDT',
    amount: '863.12',
    amountUSD: '+853.12',
    date: '20 Jul at',
    time: '12:00 AM',
    status: 'completed'
  },
  {
    id: 'tx-5',
    type: 'buy',
    asset: 'USDT',
    amount: '123.74',
    amountUSD: '-120',
    date: '19 Jul at',
    time: '12:00 AM',
    status: 'completed'
  },
  {
    id: 'tx-6',
    type: 'buy',
    asset: 'USDT',
    amount: '490.41',
    amountUSD: '-482.65',
    date: '19 Jul at',
    time: '12:00 AM',
    status: 'completed'
  }
]

interface WalletContentProps {
  selectedTransaction: string | null
  onSelectTransaction: (txId: string) => void
}

const WalletContent = ({ selectedTransaction, onSelectTransaction }: WalletContentProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return Download
      case 'transfer':
        return Repeat2
      default:
        return Download
    }
  }

  return (
    <div className="flex-1 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto wallet-transactions-scrollbar shadow-sm">
      {/* Pending Execution */}
      <div className="mb-4">
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-2">Pending Execution (1)</h3>
        <div className="space-y-1.5">
          {pendingTransactions.map((tx) => {
            const Icon = getTransactionIcon(tx.type)
            const isSelected = selectedTransaction === tx.id

            return (
              <motion.button
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                whileHover={{ x: 4, scale: 1.01 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all duration-150 ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-500/30'
                    : 'bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-900/15'
                }`}
              >
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">Buy {tx.asset}</span>
                    <span className="text-sm text-gray-900 dark:text-white font-semibold">{tx.amount} {tx.asset}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{tx.date} {tx.time}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400">{tx.amountUSD} USD</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-2">Completed (2)</h3>
        <div className="space-y-1.5">
          {completedTransactions.map((tx) => {
            const Icon = getTransactionIcon(tx.type)
            const isSelected = selectedTransaction === tx.id

            return (
              <motion.button
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id)}
                whileHover={{ x: 4, scale: 1.01 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`w-full p-3 rounded-lg flex cursor-pointer items-center gap-3 transition-all duration-150 ${
                  isSelected
                    ? 'bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-primary/50'
                    : 'bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-dark-bg hover:bg-gray-100 dark:hover:bg-dark-bg'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  tx.type === 'buy' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">{tx.type} {tx.asset}</span>
                    <span className="text-sm text-gray-900 dark:text-white font-semibold">{tx.amount} {tx.asset}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{tx.date} {tx.time}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{tx.amountUSD} USD</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WalletContent

