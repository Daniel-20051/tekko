import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, Copy, Info } from 'lucide-react'
import { useMemo } from 'react'
import { useTransactions } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
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

  // Calculate running balance for each transaction
  const transactionsWithBalance = useMemo(() => {
    const allTransactions = [...completedTransactions, ...pendingTransactions]
    let runningBalance = 0
    
    return allTransactions.map((tx, index) => {
      const amount = parseFloat(tx.amount)
      if (tx.type === 'deposit') {
        runningBalance += amount
      } else {
        runningBalance -= amount
      }
      
      const previousBalance = index > 0 ? runningBalance - (tx.type === 'deposit' ? amount : -amount) : runningBalance
      
      return {
        ...tx,
        currentBalance: runningBalance,
        previousBalance
      }
    })
  }, [completedTransactions, pendingTransactions])

  const getServiceName = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'BANK TRANSFER DIRECT DEPOSIT'
      case 'withdrawal':
        return 'WITHDRAWAL'
      case 'transfer':
        return 'TRANSFER'
      case 'trade':
        return 'TRADE'
      case 'fee':
        return 'FEE'
      default:
        return (type as string).toUpperCase()
    }
  }

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 flex-1">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
          <p className="text-xs text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      ) : transactionsWithBalance.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found for {selectedAsset.toUpperCase()}</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto wallet-transactions-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Wallet</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Service</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {transactionsWithBalance.map((tx) => {
                const iconConfig = getCryptoIconConfig(tx.currency)
                const CurrencyIcon = iconConfig.icon
                const isDeposit = tx.type === 'deposit'
                const isSelected = selectedTransaction === tx.id.toString()
                const isPending = tx.status === 'pending' || tx.status === 'processing'

                return (
                  <motion.tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx.id.toString())}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-primary/5 dark:bg-primary/10'
                        : 'hover:bg-gray-50 dark:hover:bg-dark-bg/50'
                    } ${isPending ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                    whileHover={{ backgroundColor: isSelected ? undefined : 'rgba(0, 0, 0, 0.02)' }}
                  >
                    {/* Wallet Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${iconConfig.iconBg} flex items-center justify-center shrink-0`}>
                          <CurrencyIcon className={`w-4 h-4 ${iconConfig.iconColor}`} />
                        </div>
                      </div>
                    </td>

                    {/* Service Column */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {getServiceName(tx.type)}
                      </span>
                    </td>

                    {/* Amount Column */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isDeposit ? (
                          <ArrowDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className={`text-sm font-semibold ${
                          isDeposit 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {isDeposit ? '+' : '-'}{Math.abs(parseFloat(tx.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                        </span>
                      </div>
                    </td>

                    {/* Balance Column */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {tx.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.previousBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                        </span>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(tx.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleCopy(tx.id.toString(), e)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                          title="Copy transaction ID"
                        >
                          <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => onSelectTransaction(tx.id.toString())}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                          title="View details"
                        >
                          <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default WalletContent

