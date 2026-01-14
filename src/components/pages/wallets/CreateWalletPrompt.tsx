import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Plus, CheckCircle, Sparkles } from 'lucide-react'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import { useMemo, useState, useEffect } from 'react'
import { useCreateWallet, useSupportedCurrencies } from '../../../hooks/useWallet'
import Alert from '../../ui/Alert'

interface CreateWalletPromptProps {
  currency: string
  currencyName: string
}

const CreateWalletPrompt = ({ currency, currencyName }: CreateWalletPromptProps) => {
  const { mutate: createWallet, isPending, isSuccess, isError, error } = useCreateWallet()
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('')
  const { data: supportedCurrencies } = useSupportedCurrencies()

  // Show alert when error occurs
  useEffect(() => {
    if (isError && error) {
      setShowErrorAlert(true)
    }
  }, [isError, error])

  // Set default currency if provided or first supported currency
  useEffect(() => {
    if (currency) {
      setSelectedCurrency(currency.toUpperCase())
    } else if (supportedCurrencies?.currencies && supportedCurrencies.currencies.length > 0) {
      setSelectedCurrency(supportedCurrencies.currencies[0].code)
    }
  }, [currency, supportedCurrencies])

  const iconConfig = useMemo(() => {
    return getCryptoIconConfig(selectedCurrency || 'BTC')
  }, [selectedCurrency])

  const Icon = iconConfig.icon
  const isNoWallets = !currency

  const handleCreateWallet = () => {
    if (selectedCurrency) {
      createWallet({ currency: selectedCurrency })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 max-w-3xl w-full max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide flex flex-col"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex flex-col items-center text-center p-6">
        {/* Icon */}
        <div className={`w-16 h-16 ${isNoWallets ? 'bg-primary/10 dark:bg-primary/20' : iconConfig.iconBg} rounded-full flex items-center justify-center mb-3`}>
          {isNoWallets ? (
            <Wallet className="w-8 h-8 text-primary" />
          ) : (
            <Icon className={`w-8 h-8 ${iconConfig.iconColor}`} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {isNoWallets ? 'Create Your First Wallet' : `No ${currencyName} Wallet Yet`}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          {isNoWallets 
            ? 'Get started by creating your first crypto wallet. Choose a currency below and start managing your digital assets securely.'
            : `You haven't created a ${currencyName} (${currency.toUpperCase()}) wallet yet. Create one now to start receiving and sending ${currency.toUpperCase()}.`
          }
        </p>

        {/* Currency Selection (only show if no wallets) */}
        {isNoWallets && supportedCurrencies?.currencies && (
          <div className="w-full mb-4">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Select Currency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {supportedCurrencies.currencies.slice(0, 6).map((curr) => {
                const currIconConfig = getCryptoIconConfig(curr.code)
                const CurrIcon = currIconConfig.icon
                const isSelected = selectedCurrency === curr.code
                
                return (
                  <button
                    key={curr.code}
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-7 h-7 ${currIconConfig.iconBg} rounded-lg flex items-center justify-center mx-auto mb-1.5`}>
                      <CurrIcon className={`w-3.5 h-3.5 ${currIconConfig.iconColor}`} />
                    </div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{curr.code}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{curr.name}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 w-full">
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-1.5">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Secure Storage</p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 text-center">Industry-standard security for your funds</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-1.5">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Instant Transactions</p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 text-center">Fast and reliable transfers</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-1.5">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">Easy to Use</p>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 text-center">Simple interface for everyone</p>
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          onClick={handleCreateWallet}
          disabled={isPending || isSuccess || !selectedCurrency}
          whileHover={{ scale: isPending || isSuccess || !selectedCurrency ? 1 : 1.02 }}
          whileTap={{ scale: isPending || isSuccess || !selectedCurrency ? 1 : 0.98 }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${
            isSuccess 
              ? 'bg-green-600 cursor-default' 
              : isPending 
              ? 'bg-primary/70 cursor-wait' 
              : !selectedCurrency
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 cursor-pointer'
          }`}
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Wallet...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Wallet Created!
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create {selectedCurrency || 'Wallet'}
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
              className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium"
            >
              Wallet created successfully! Loading your wallet...
            </motion.p>
          )}
          {!isSuccess && !isError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-gray-500 dark:text-gray-400 mt-2"
            >
              It's free and takes less than a minute
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Error Alert at Top */}
      <Alert
        message={error?.message || 'Failed to create wallet. Please try again.'}
        type="error"
        isVisible={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        duration={5000}
      />
    </motion.div>
  )
}

export default CreateWalletPrompt
