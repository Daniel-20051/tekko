import { motion } from 'framer-motion'
import { Download, Upload, Repeat2, ArrowUpDown, DollarSign } from 'lucide-react'
import { useMemo } from 'react'
import { useTransactions } from '../../../hooks/useWallet'
import type { TransactionType } from '../../../types/transaction'

interface WalletContentProps {
  selectedAsset: string
  selectedTransaction: string | null
  onSelectTransaction: (txId: string) => void
}

const WalletContent = ({ selectedAsset, selectedTransaction, onSelectTransaction }: WalletContentProps) => {
  // Fetch transactions with currency filter
  const { data: transactionsData, isLoading } = useTransactions({ 
    currency: selectedAsset.toUpperCase() as any
  })

  // Filter pending and completed transactions
  const { pendingTransactions, completedTransactions } = useMemo(() => {
    const transactions = transactionsData?.transactions || []
    
    return {
      pendingTransactions: transactions.filter(tx => tx.status === 'pending' || tx.status === 'processing'),
      completedTransactions: transactions.filter(tx => tx.status === 'completed')
    }
  }, [transactionsData])

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return Download
      case 'withdrawal':
        return Upload
      case 'transfer':
        return Repeat2
      case 'trade':
        return ArrowUpDown
      case 'fee':
        return DollarSign
      default:
        return Download
    }
  }

  return (
    <div className="flex-1 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto wallet-transactions-scrollbar shadow-sm">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      ) : (
        <>
          {/* Pending Execution */}
          {pendingTransactions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-2">
                Pending Execution ({pendingTransactions.length})
              </h3>
              <div className="space-y-1.5">
                {pendingTransactions.map((tx) => {
            const Icon = getTransactionIcon(tx.type)
            const isSelected = selectedTransaction === tx.id.toString()

            return (
              <motion.button
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id.toString())}
                whileHover={{ x: 4, scale: 1.01 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all duration-150 ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-500/30'
                    : 'bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-900/15'
                }`}
              >
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-500/30 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">{tx.type} {tx.currency}</span>
                    <span className="text-sm text-gray-900 dark:text-white font-semibold">{tx.amount} {tx.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                      {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      {tx.type === 'deposit' ? '+' : '-'}{Math.abs(parseFloat(tx.amount)).toFixed(2)} {tx.currency}
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
            </div>
          )}

          {/* Completed */}
          {completedTransactions.length > 0 && (
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-2">
                Completed ({completedTransactions.length})
              </h3>
              <div className="space-y-1.5">
                {completedTransactions.map((tx) => {
            const Icon = getTransactionIcon(tx.type)
            const isSelected = selectedTransaction === tx.id.toString()

            return (
              <motion.button
                key={tx.id}
                onClick={() => onSelectTransaction(tx.id.toString())}
                whileHover={{ x: 4, scale: 1.01 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`w-full p-3 rounded-lg flex cursor-pointer items-center gap-3 transition-all duration-150 ${
                  isSelected
                    ? 'bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-primary/50'
                    : 'bg-gray-50 dark:bg-dark-bg/50 border border-gray-200 dark:border-dark-bg hover:bg-gray-100 dark:hover:bg-dark-bg'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  tx.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/20' :
                  tx.type === 'withdrawal' ? 'bg-red-100 dark:bg-red-900/20' :
                  'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' :
                    tx.type === 'withdrawal' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-600 dark:text-gray-300'
                  }`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">{tx.type} {tx.currency}</span>
                    <span className="text-sm text-gray-900 dark:text-white font-semibold">{tx.amount} {tx.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                      {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {tx.type === 'deposit' ? '+' : '-'}{Math.abs(parseFloat(tx.amount)).toFixed(2)} {tx.currency}
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
            </div>
          )}

          {/* Empty State */}
          {pendingTransactions.length === 0 && completedTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found for {selectedAsset.toUpperCase()}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WalletContent

