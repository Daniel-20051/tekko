import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Camera, DollarSign, CheckCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCreateWallet, useSupportedCurrencies, useWalletBalances } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import Alert from '../../ui/Alert'
import Button from '../../ui/Button'

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateWalletModal = ({ isOpen, onClose }: CreateWalletModalProps) => {
  const [walletType, setWalletType] = useState<'fiat' | 'digital'>('digital')
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [creatingCurrency, setCreatingCurrency] = useState<string | null>(null)
  const [successCurrency, setSuccessCurrency] = useState<string | null>(null)
  
  const { mutate: createWallet, isPending, isSuccess, isError, error } = useCreateWallet()
  const { data: supportedCurrencies, isLoading: isLoadingCurrencies } = useSupportedCurrencies()
  const { data: walletBalances } = useWalletBalances()

  // Get currencies that already have wallets (both fiat and crypto)
  const existingCurrencies = useMemo(() => {
    if (!walletBalances?.wallets) return new Set<string>()
    return new Set(walletBalances.wallets.map(w => w.currency.toUpperCase()))
  }, [walletBalances])

  // Filter available currencies (exclude already created wallets)
  const availableCurrencies = useMemo(() => {
    if (!supportedCurrencies?.currencies) return []
    
    return supportedCurrencies.currencies.filter(
      currency => !existingCurrencies.has(currency.code.toUpperCase())
    )
  }, [supportedCurrencies, existingCurrencies])

  // Filter by wallet type (for now, we'll show all as digital)
  const filteredCurrencies = useMemo(() => {
    // For now, we'll show all currencies. You can add fiat/digital filtering later
    return availableCurrencies
  }, [availableCurrencies])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Show alert when error occurs
  useEffect(() => {
    if (isError && error) {
      setShowErrorAlert(true)
    }
  }, [isError, error])

  // Close modal on success
  useEffect(() => {
    if (isSuccess && successCurrency) {
      setTimeout(() => {
        onClose()
        setCreatingCurrency(null)
        setSuccessCurrency(null)
      }, 1500)
    }
  }, [isSuccess, successCurrency, onClose])

  const handleCreateWallet = (currencyCode: string) => {
    setCreatingCurrency(currencyCode)
    createWallet(
      { currency: currencyCode },
      {
        onSuccess: () => {
          setSuccessCurrency(currencyCode)
          setCreatingCurrency(null)
        },
        onError: () => {
          setCreatingCurrency(null)
        },
      }
    )
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setCreatingCurrency(null)
              setSuccessCurrency(null)
              setShowErrorAlert(false)
              onClose()
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              max-w-2xl
              w-[calc(100%-1rem)] sm:w-full
              bg-white dark:bg-dark-surface
              rounded-xl border border-gray-200 dark:border-primary/50
              shadow-2xl z-50
              max-h-[90vh] overflow-hidden flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-primary/50">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Create Wallet
              </h2>
              <Button
                variant="ghost"
                size="sm"
                icon={<X className="w-5 h-5" />}
                onClick={() => {
                  setCreatingCurrency(null)
                  setSuccessCurrency(null)
                  setShowErrorAlert(false)
                  onClose()
                }}
                aria-label="Close modal"
                className="p-2"
              />
            </div>

            {/* Wallet Type Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-4 border-b border-gray-200 dark:border-primary/50">
              <button
                onClick={() => setWalletType('fiat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                  walletType === 'fiat'
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Fiat</span>
              </button>
              <button
                onClick={() => setWalletType('digital')}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                  walletType === 'digital'
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Digital</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {isLoadingCurrencies ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredCurrencies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {existingCurrencies.size > 0
                      ? 'You have already created wallets for all available currencies.'
                      : 'No currencies available.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {filteredCurrencies.map((currency) => {
                    const iconConfig = getCryptoIconConfig(currency.code)
                    const Icon = iconConfig.icon
                    const isCreating = creatingCurrency === currency.code
                    const isSuccessState = isSuccess && successCurrency === currency.code
                    const isDisabled = (isPending && isCreating) || isSuccessState

                    return (
                      <motion.button
                        key={currency.code}
                        onClick={() => !isDisabled && handleCreateWallet(currency.code)}
                        disabled={isDisabled}
                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        className={`
                          relative flex flex-col items-center gap-2 p-3 sm:p-4
                          rounded-lg border-2 transition-all
                          ${
                            isSuccessState
                              ? 'border-green-500 bg-green-500/10 dark:bg-green-500/20 cursor-default'
                              : isCreating
                              ? 'border-primary bg-primary/10 dark:bg-primary/20 cursor-wait'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 cursor-pointer'
                          }
                        `}
                      >
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 ${iconConfig.iconBg} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconConfig.iconColor}`} />
                        </div>

                        {/* Currency Code */}
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                          {currency.code}
                        </p>

                        {/* Plus Icon or Success Check */}
                        <div className="absolute top-2 right-2">
                          {isSuccessState ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : isCreating ? (
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer Message */}
            <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-primary/50 bg-gray-50 dark:bg-dark-bg">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Wallets are subject to compliance and may not be available for transactions until KYC is completed.
              </p>
            </div>
          </motion.div>

          {/* Error Alert */}
          <Alert
            message={error?.message || 'Failed to create wallet. Please try again.'}
            type="error"
            isVisible={showErrorAlert}
            onClose={() => setShowErrorAlert(false)}
            duration={5000}
          />
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

export default CreateWalletModal
