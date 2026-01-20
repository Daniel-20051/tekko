import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Clock, CheckCircle, X, Copy, Loader2 } from 'lucide-react'
import Button from '../../ui/Button'
import { useSingleTransaction } from '../../../hooks/useWallet'
import { getServiceName } from '../../../utils/transaction-utils'

interface TransactionDetailsProps {
  selectedTransaction: string | null
  onClose: () => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400'
    case 'pending':
    case 'processing':
      return 'text-amber-600 dark:text-amber-400'
    case 'failed':
    case 'cancelled':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'failed':
      return 'Failed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

const TransactionDetails = ({ selectedTransaction, onClose }: TransactionDetailsProps) => {
  const { data: transaction, isLoading, error } = useSingleTransaction(selectedTransaction)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatAddress = (address?: string) => {
    if (!address) return 'N/A'
    if (address.length <= 12) return address
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  return (
    <AnimatePresence>
      {selectedTransaction && (
        <>
          {/* Mobile backdrop - positioned below header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[73px] left-0 right-0 bottom-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className="fixed top-[73px] left-0 right-0 bottom-0 lg:relative lg:top-auto lg:left-auto lg:right-auto lg:bottom-auto lg:inset-auto w-full lg:w-80 bg-white dark:bg-dark-surface lg:rounded-xl border-0 lg:border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto wallet-details-scrollbar z-50 lg:z-auto"
          >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Transaction Details</h3>
            <Button
              variant="ghost"
              size="sm"
              icon={<X className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
              onClick={onClose}
              className="p-1.5"
              aria-label="Close details"
            >
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Loading transaction details...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-xs text-red-500 dark:text-red-400 text-center">
                Failed to load transaction details
              </p>
            </div>
          ) : transaction ? (
            <>
              {/* Transaction Info */}
              <div className="space-y-3 mb-4 p-4 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-800">
                {/* Transaction Hash / Blockchain TX ID */}
                {(transaction.blockchainTxId || transaction.txHash) && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Transaction Hash:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-primary break-all flex-1">
                        {transaction.blockchainTxId || transaction.txHash || 'N/A'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Copy className="w-3 h-3" />}
                        onClick={() => handleCopy(transaction.blockchainTxId || transaction.txHash || '')}
                        className="p-1 shrink-0"
                        title="Copy transaction hash"
                      >
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Status:</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Type:</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {getServiceName(transaction.type)}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount:</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {parseFloat(transaction.amount).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 8 
                    })} {transaction.currency}
                  </p>
                </div>

                {/* Fee */}
                {parseFloat(transaction.fee) > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fee:</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {parseFloat(transaction.fee).toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 8 
                      })} {transaction.currency}
                    </p>
                  </div>
                )}

                {/* Balance Before/After */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Balance:</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Before: {parseFloat(transaction.balanceBefore).toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 8 
                      })} {transaction.currency}
                    </p>
                    <p className="text-xs text-gray-900 dark:text-white font-medium">
                      After: {parseFloat(transaction.balanceAfter).toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 8 
                      })} {transaction.currency}
                    </p>
                  </div>
                </div>

                {/* Network */}
                {(transaction.network || transaction.metadata?.network) && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Network:</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {transaction.network || transaction.metadata?.network}
                    </p>
                  </div>
                )}

                {/* From Address */}
                {(transaction.metadata?.fromAddress || transaction.address) && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">From Address:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 dark:text-white font-medium break-all flex-1">
                        {formatAddress(transaction.metadata?.fromAddress || transaction.address)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Copy className="w-3 h-3" />}
                        onClick={() => handleCopy(transaction.metadata?.fromAddress || transaction.address || '')}
                        className="p-1 shrink-0"
                        title="Copy address"
                      >
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* To Address */}
                {transaction.metadata?.toAddress && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">To Address:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 dark:text-white font-medium break-all flex-1">
                        {formatAddress(transaction.metadata.toAddress)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Copy className="w-3 h-3" />}
                        onClick={() => handleCopy(transaction.metadata?.toAddress || '')}
                        className="p-1 shrink-0"
                        title="Copy address"
                      >
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Confirmations */}
                {(transaction.blockchainConfirmations !== undefined || transaction.confirmations !== undefined) && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Confirmations:</p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {transaction.blockchainConfirmations ?? transaction.confirmations ?? 0}
                      {transaction.requiredConfirmations && ` / ${transaction.requiredConfirmations}`}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Created:</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(transaction.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {transaction.completedAt && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Completed:</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.completedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                {/* Transaction Created */}
                <div className="flex gap-2.5">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="w-0.5 h-10 bg-gray-200 dark:bg-gray-800 mt-1.5"></div>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">Transaction created</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Processing/Pending */}
                {(transaction.status === 'pending' || transaction.status === 'processing') && (
                  <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="w-0.5 h-10 bg-gray-200 dark:bg-gray-800 mt-1.5"></div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">
                        {transaction.status === 'processing' ? 'Processing' : 'Pending'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.status === 'processing' 
                          ? 'Transaction is being processed'
                          : 'Waiting for confirmation'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Completed/Failed/Cancelled */}
                {transaction.status === 'completed' && (
                  <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-0.5">Transaction completed</p>
                      {transaction.completedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(transaction.completedAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {(transaction.status === 'failed' || transaction.status === 'cancelled') && (
                  <div className="flex gap-2.5">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-0.5">
                        Transaction {transaction.status === 'failed' ? 'failed' : 'cancelled'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TransactionDetails

