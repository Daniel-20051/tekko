import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { withdrawNGN } from '../../../../api/wallet.api'
import { walletKeys } from '../../../../hooks/useWallet'
import { useQueryClient } from '@tanstack/react-query'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import type { NGNWithdrawalFeesData, NGNWithdrawalData } from '../../../../types/wallet'

interface NGNWithdrawSummaryStepProps {
  amount: string
  feesData: NGNWithdrawalFeesData
  bankDetails: {
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
  }
  currency: string
  onBack: () => void
  onSuccess: (data: NGNWithdrawalData) => void
}

const NGNWithdrawSummaryStep = ({
  amount,
  feesData,
  bankDetails,
  currency,
  onBack: _onBack,
  onSuccess,
}: NGNWithdrawSummaryStepProps) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const withdrawMutation = useMutation({
    mutationFn: (transferPin: string) =>
      withdrawNGN({
        currency,
        amount,
        destinationAddress: bankDetails.accountNumber,
        transferPin,
        bankDetails,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
      queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      onSuccess(data)
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to initiate withdrawal')
    },
  })

  const handleWithdraw = () => {
    setError(null)
    if (!pin || pin.length !== 4) {
      setError('Please enter a valid 4-digit PIN')
      return
    }

    withdrawMutation.mutate(pin)
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
      {/* Summary */}
      <div className="space-y-3">
        {/* Amount */}
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatBalance(amount)} {currency}
            </span>
          </div>
        </div>

        {/* Fees */}
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Fees</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatBalance(feesData.fees.total)} {currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Required</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatBalance(feesData.totalRequired)} {currency}
            </span>
          </div>
        </div>

        {/* Net Amount */}
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">You'll Receive</span>
            <span className="text-sm font-semibold text-primary">
              {formatBalance(feesData.netAmount)} {currency}
            </span>
          </div>
        </div>

        {/* Bank Details */}
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Number</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {bankDetails.accountNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Account Name</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {bankDetails.accountName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bank</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {bankDetails.bankName}
              </span>
            </div>
          </div>
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
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
            setError(null)
          }}
          placeholder="Enter 4-digit PIN"
          maxLength={4}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Error</p>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleWithdraw}
        disabled={withdrawMutation.isPending || !pin || pin.length !== 4}
      >
        {withdrawMutation.isPending ? 'Processing...' : 'Confirm Withdrawal'}
      </Button>
    </motion.div>
  )
}

export default NGNWithdrawSummaryStep
