import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import { useMemo } from 'react'
import { useCreateWallet } from '../../../hooks/useWallet'

interface CreateWalletPromptProps {
  currency: string
  currencyName: string
}

const CreateWalletPrompt = ({ currency, currencyName }: CreateWalletPromptProps) => {
  const { mutate: createWallet, isPending, isSuccess, isError, error } = useCreateWallet()

  const iconConfig = useMemo(() => {
    return getCryptoIconConfig(currency.toUpperCase())
  }, [currency])

  const Icon = iconConfig.icon

  const handleCreateWallet = () => {
    createWallet({ currency: currency.toUpperCase() })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm max-w-3xl"
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${iconConfig.iconBg} rounded-full flex items-center justify-center mb-3`}>
          <Icon className={`w-8 h-8 ${iconConfig.iconColor}`} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No {currencyName} Wallet Yet
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 max-w-md">
          You haven't created a {currencyName} ({currency.toUpperCase()}) wallet yet. 
          Create one now to start receiving and sending {currency.toUpperCase()}.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 w-full max-w-2xl">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <Wallet className="w-7 h-7 text-primary mb-1.5" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Secure Storage</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">Your funds are protected with industry-standard security</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <svg className="w-7 h-7 text-primary mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Instant Transactions</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">Send and receive {currency.toUpperCase()} quickly</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <svg className="w-7 h-7 text-primary mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Easy to Use</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">Simple interface for all experience levels</p>
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          onClick={handleCreateWallet}
          disabled={isPending || isSuccess}
          whileHover={{ scale: isPending || isSuccess ? 1 : 1.02 }}
          whileTap={{ scale: isPending || isSuccess ? 1 : 0.98 }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors shadow-lg ${
            isSuccess 
              ? 'bg-green-600 cursor-default' 
              : isPending 
              ? 'bg-primary/70 cursor-wait' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Wallet Created!
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create {currency.toUpperCase()} Wallet
            </>
          )}
        </motion.button>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {isSuccess && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-green-600 dark:text-green-400 mt-3 font-medium"
            >
              Wallet created successfully! Loading your wallet...
            </motion.p>
          )}
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 mt-3"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error?.message || 'Failed to create wallet. Please try again.'}</span>
            </motion.div>
          )}
          {!isSuccess && !isError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-gray-500 dark:text-gray-400 mt-3"
            >
              It's free and takes less than a minute
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CreateWalletPrompt
