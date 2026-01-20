import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { withdrawCrypto } from '../../../../api/wallet.api'
import { walletKeys } from '../../../../hooks/useWallet'
import { useNavigate } from '@tanstack/react-router'
import { getCryptoIconConfig } from '../../../../utils/crypto-icons'
import Button from '../../../ui/Button'
import Input from '../../../ui/Input'

interface CryptoWithdrawDetailsProps {
  currency: string
  availableBalance: string
  onBack: () => void
}

type Step = 'details' | 'pin'

const CryptoWithdrawDetails = ({ currency, availableBalance, onBack: _onBack }: CryptoWithdrawDetailsProps) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const withdrawMutation = useMutation({
    mutationFn: withdrawCrypto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
      queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      setCurrentStep('pin')
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to initiate withdrawal')
    },
  })

  const handleNextToPin = () => {
    setError(null)
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
      currency,
      amount,
      toAddress,
      pin,
    })
  }

  const formatBalance = (balance: string) => {
    if (!balance || balance === '0' || balance === '0.00') return '0.00000000'
    const [integerPart, decimalPart = ''] = balance.split('.')
    const paddedDecimal = decimalPart.padEnd(8, '0').substring(0, 8)
    return `${parseFloat(integerPart).toLocaleString('en-US')}.${paddedDecimal}`
  }

  const iconConfig = getCryptoIconConfig(currency)
  const Icon = iconConfig.icon

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <AnimatePresence mode="wait">
        {currentStep === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Selected Wallet Info */}
            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${iconConfig.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconConfig.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{currency}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Available Balance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatBalance(availableBalance)} {currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">
                Amount
              </label>
              <Input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setError(null)
                }}
                placeholder="0.00000000"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Available: {formatBalance(availableBalance)} {currency}
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
                onChange={(e) => {
                  setToAddress(e.target.value)
                  setError(null)
                }}
                placeholder="Enter recipient address"
                className="font-mono"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Make sure this address supports {currency} network
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Continue Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleNextToPin}
              disabled={!amount || !toAddress}
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
            className="space-y-4"
          >
            {withdrawMutation.isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Withdrawal Initiated Successfully
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your withdrawal is being processed. You will be redirected shortly.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate({ to: '/wallets' })}
                >
                  Back to Wallets
                </Button>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Currency</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatBalance(amount)} {currency}
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
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, '').substring(0, 6))
                      setError(null)
                    }}
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

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                )}

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

export default CryptoWithdrawDetails
