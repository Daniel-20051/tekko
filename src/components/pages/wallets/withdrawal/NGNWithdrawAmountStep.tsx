import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { calculateNGNWithdrawalFees } from '../../../../api/wallet.api'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import Spinner from '../../../ui/Spinner'
import type { NGNWithdrawalFeesData } from '../../../../types/wallet'

interface NGNWithdrawAmountStepProps {
  availableBalance: string
  currency: string
  onNext: (amount: string, feesData: NGNWithdrawalFeesData) => void
  onBack: () => void
}

const NGNWithdrawAmountStep = ({ availableBalance, currency, onNext, onBack: _onBack }: NGNWithdrawAmountStepProps) => {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  const feesMutation = useMutation({
    mutationFn: (amount: string) => calculateNGNWithdrawalFees({ currency, amount }),
    onSuccess: (feesData) => {
      if (parseFloat(amount) > parseFloat(availableBalance)) {
        setError('Amount exceeds available balance')
        return
      }
      if (parseFloat(feesData.totalRequired) > parseFloat(availableBalance)) {
        setError(`Insufficient balance. Required: ${feesData.totalRequired} ${currency} (Amount: ${feesData.amount} + Fees: ${feesData.fees.total}), Available: ${availableBalance} ${currency}`)
        return
      }
      onNext(amount, feesData)
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to calculate fees')
    },
  })

  const handleNext = () => {
    setError(null)
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    feesMutation.mutate(amount)
  }

  const formatBalance = (balance: string) => {
    if (!balance || balance === '0' || balance === '0.00') return '0.00'
    const num = parseFloat(balance)
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Available Balance */}
      <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{currency}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Available Balance</p>
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
          step="0.01"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setError(null)
          }}
          placeholder="0.00"
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

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
          <div className="flex items-start gap-2">
            <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleNext}
        disabled={feesMutation.isPending || !amount || parseFloat(amount) <= 0}
        icon={feesMutation.isPending ? <Spinner size="sm" variant="white" /> : undefined}
      >
        {feesMutation.isPending ? '' : 'Continue'}
      </Button>
    </motion.div>
  )
}

export default NGNWithdrawAmountStep
