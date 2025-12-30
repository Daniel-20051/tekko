import { motion } from 'framer-motion'
import { AlertCircle, Clock, CheckCircle } from 'lucide-react'

interface TransactionDetailsProps {
  selectedTransaction: string | null
}

const TransactionDetails = ({ selectedTransaction }: TransactionDetailsProps) => {
  if (!selectedTransaction) {
    return (
      <div className="w-80 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-center shadow-sm">
        <p className="text-gray-500 dark:text-gray-400 text-xs">Select a transaction to view details</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto wallet-details-scrollbar shadow-sm"
    >
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Buy Details</h3>

      {/* Transaction Info */}
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">txHash:</p>
          <p className="text-sm text-primary break-all">
            ec8b7522102675fc6588c71c 4bed35db2b/ab38ae...
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Intercept Status:</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Pending execution</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Purchased from the card:</p>
          <p className="text-sm text-gray-900 dark:text-white font-medium">** 3232</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">To USDT Wallet</p>
          <p className="text-sm text-gray-900 dark:text-white font-medium">**98378bfms</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="space-y-3">
        {/* NGN Sent */}
        <div className="flex gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="w-0.5 h-10 bg-gray-200 dark:bg-gray-800 mt-1.5"></div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">NGN sent- Waiting for seller confirm</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Seller has confirmed the receipt</p>
          </div>
        </div>

        {/* USDT Transaction */}
        <div className="flex gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="w-0.5 h-10 bg-gray-200 dark:bg-gray-800 mt-1.5"></div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">USDT sent</p>
          </div>
        </div>

        {/* Transaction Complete */}
        <div className="flex gap-2.5">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-400 dark:text-gray-600 mb-0.5">Transaction complete</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionDetails

