import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Wallet, CheckCircle2, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCryptoBalances, useSingleCurrencyBalance, walletKeys } from '../../hooks/useWallet'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { withdrawCrypto } from '../../api/wallet.api'
import { getCryptoIconConfig } from '../../utils/crypto-icons'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

type Step = 'select' | 'details' | 'pin'

const WithdrawPage = () => {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/withdraw' })
  const { currency: initialCurrency } = search

  const [currentStep, setCurrentStep] = useState<Step>(initialCurrency ? 'details' : 'select')
  const [selectedCurrency, setSelectedCurrency] = useState<string>(initialCurrency?.toUpperCase() || '')
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const { data: cryptoBalances } = useCryptoBalances()
  const { data: balanceData, isLoading: isLoadingBalance } = useSingleCurrencyBalance(selectedCurrency)
  const availableBalance = balanceData?.wallet?.availableBalance || '0'

  const withdrawMutation = useMutation({
    mutationFn: withdrawCrypto,
    onSuccess: () => {
      // Invalidate balance queries to refresh data
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
      queryClient.invalidateQueries({ queryKey: walletKeys.singleBalance(selectedCurrency) })
      queryClient.invalidateQueries({ queryKey: walletKeys.cryptoBalances() })
      
      // Show success state (stays on pin step but shows success message)
      // Navigate to wallets after 2 seconds
      setTimeout(() => {
        navigate({ to: '/wallets' })
      }, 2000)
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to initiate withdrawal')
    },
  })

  // Auto-select currency if provided in URL
  useEffect(() => {
    if (initialCurrency && !selectedCurrency) {
      setSelectedCurrency(initialCurrency.toUpperCase())
    }
  }, [initialCurrency, selectedCurrency])

  const handleSelectCurrency = (currency: string) => {
    setSelectedCurrency(currency)
    setCurrentStep('details')
    setError(null)
  }

  const handleNextToPin = () => {
    setError(null)
    // Validate amount and address
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (parseFloat(amount) > parseFloat(availableBalance)) {
      setError('Amount exceeds available balance')
      return
    }
    if (!toAddress || toAddress.trim().length === 0) {
      setError('Please enter a valid withdrawal address')
      return
    }
    setCurrentStep('pin')
  }

  const handleWithdraw = () => {
    setError(null)
    if (!pin || pin.length !== 6) {
      setError('Please enter a valid 6-digit PIN')
      return
    }

    withdrawMutation.mutate({
      currency: selectedCurrency,
      amount: amount,
      toAddress: toAddress.trim(),
      pin: pin,
    })
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance || '0')
    if (isNaN(num) || num === 0) {
      return '0.00000000'
    }
    const [integerPart, decimalPart = ''] = balance.split('.')
    const paddedDecimal = decimalPart.padEnd(8, '0').substring(0, 8)
    return `${parseFloat(integerPart).toLocaleString('en-US')}.${paddedDecimal}`
  }

  const availableAssets = cryptoBalances?.balances || []

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Withdraw</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Transfer your crypto to an external wallet
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          <div className={`flex items-center gap-2 ${currentStep === 'select' ? 'text-primary' : currentStep === 'details' || currentStep === 'pin' ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              currentStep === 'select' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              1
            </div>
            <span className="text-sm font-medium hidden sm:inline">Select Wallet</span>
          </div>
          <div className={`w-12 h-0.5 transition-colors ${
            currentStep === 'details' || currentStep === 'pin'
              ? 'bg-primary' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`} />
          <div className={`flex items-center gap-2 ${currentStep === 'details' ? 'text-primary' : currentStep === 'pin' ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              currentStep === 'details' 
                ? 'bg-primary text-white' 
                : currentStep === 'pin'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </div>
            <span className="text-sm font-medium hidden sm:inline">Details</span>
          </div>
          <div className={`w-12 h-0.5 transition-colors ${
            currentStep === 'pin'
              ? 'bg-primary' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`} />
          <div className={`flex items-center gap-2 ${currentStep === 'pin' ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              currentStep === 'pin' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              3
            </div>
            <span className="text-sm font-medium hidden sm:inline">Confirm</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Error</p>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Wallet
            </h2>
            {availableAssets.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No wallets available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableAssets.map((balance) => {
                  const iconConfig = getCryptoIconConfig(balance.currency)
                  const Icon = iconConfig.icon
                  const isSelected = selectedCurrency === balance.currency.toUpperCase()
                  
                  return (
                    <motion.button
                      key={balance.currency}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectCurrency(balance.currency)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 ${iconConfig.iconBg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <Icon className={`w-5 h-5 ${iconConfig.iconColor}`} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{balance.currency}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatBalance(balance.availableBalance)} {balance.currency}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 'details' && selectedCurrency && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Withdrawal Details
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep('select')}
              >
                Change Wallet
              </Button>
            </div>

            {/* Selected Wallet Info */}
            {balanceData && (
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const iconConfig = getCryptoIconConfig(selectedCurrency)
                      const Icon = iconConfig.icon
                      return (
                        <div className={`w-10 h-10 ${iconConfig.iconBg} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${iconConfig.iconColor}`} />
                        </div>
                      )
                    })()}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCurrency}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Available Balance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatBalance(availableBalance)} {selectedCurrency}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                Amount
              </label>
              <Input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00000000"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Available: {formatBalance(availableBalance)} {selectedCurrency}
                </span>
                <button
                  onClick={() => setAmount(availableBalance)}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Use Max
                </button>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                Withdrawal Address
              </label>
              <Input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Enter recipient address"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Make sure this address supports {selectedCurrency} network
              </p>
            </div>

            {/* Continue Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleNextToPin}
              disabled={!amount || !toAddress || isLoadingBalance}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {currentStep === 'pin' && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 space-y-6"
          >
            {withdrawMutation.isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Withdrawal Initiated Successfully
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your withdrawal is being processed. You will be redirected shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirm Withdrawal
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep('details')}
                  >
                    Back
                  </Button>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Currency</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedCurrency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatBalance(amount)} {selectedCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">To Address</span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white break-all text-right max-w-[60%]">
                      {toAddress.substring(0, 10)}...{toAddress.substring(toAddress.length - 10)}
                    </span>
                  </div>
                </div>

                {/* PIN Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Transaction PIN
                  </label>
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter 6-digit PIN"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your 6-digit transaction PIN to confirm
                  </p>
                </div>

                {/* Warning */}
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                        Double-check the address
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Sending to the wrong address may result in permanent loss of funds. Make sure the address is correct.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleWithdraw}
                  disabled={!pin || pin.length !== 6 || withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? 'Processing...' : 'Confirm Withdrawal'}
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WithdrawPage
