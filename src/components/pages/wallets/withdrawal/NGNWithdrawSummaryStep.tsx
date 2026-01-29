import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { withdrawNGN } from '../../../../api/wallet.api'
import { walletKeys } from '../../../../hooks/useWallet'
import { useQueryClient } from '@tanstack/react-query'
import Button from '../../../ui/Button'
import Modal from '../../../ui/Modal'
import PinInput from '../../../ui/PinInput'
import Spinner from '../../../ui/Spinner'
import type { NGNWithdrawalFeesData, NGNWithdrawalData } from '../../../../types/wallet'

interface NGNWithdrawSummaryStepProps {
  amount: string
  feesData: NGNWithdrawalFeesData
  bankDetails: {
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
    institutionId: string
  }
  currency: string
  availableBalance: string
  onBack: () => void
  onSuccess: (data: NGNWithdrawalData) => void
}

const NGNWithdrawSummaryStep = ({
  amount,
  feesData,
  bankDetails,
  currency,
  availableBalance,
  onBack: _onBack,
  onSuccess,
}: NGNWithdrawSummaryStepProps) => {
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const withdrawMutation = useMutation({
    mutationFn: (transferPin: string) =>
      withdrawNGN({
        currency,
        amount,
        destinationAddress: bankDetails.accountNumber,
        transferPin,
        bankDetails: {
          accountNumber: bankDetails.accountNumber,
          institutionId: bankDetails.institutionId, // Use institutionId from verification
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
      queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      setShowPinModal(false)
      onSuccess(data)
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to initiate withdrawal')
    },
  })

  const handleConfirmClick = () => {
    setShowPinModal(true)
    setPin(['', '', '', ''])
    setError(null)
  }

  const handlePinComplete = (pinValue: string) => {
    withdrawMutation.mutate(pinValue)
  }

  const handlePinChange = (newPin: string[]) => {
    setPin(newPin)
    setError(null)
  }

  const handleClosePinModal = () => {
    if (!withdrawMutation.isPending) {
      setShowPinModal(false)
      setPin(['', '', '', ''])
      setError(null)
    }
  }

  const formatBalance = (balance: string) => {
    if (!balance || balance === '0' || balance === '0.00') return '0.00'
    const num = parseFloat(balance)
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  // Calculate balance after withdrawal
  const calculateBalanceAfter = () => {
    const currentBalance = parseFloat(availableBalance) || 0
    const totalRequired = parseFloat(feesData.totalRequired) || 0
    const balanceAfter = currentBalance - totalRequired
    return Math.max(0, balanceAfter).toFixed(2)
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

        {/* Balance After */}
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Balance After</span>
            <span className="text-sm font-semibold text-primary">
              {formatBalance(calculateBalanceAfter())} {currency}
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

      {/* Confirm Withdrawal Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleConfirmClick}
        disabled={withdrawMutation.isPending}
      >
        Confirm Withdrawal
      </Button>

      {/* PIN Modal */}
      <Modal
        isOpen={showPinModal}
        onClose={handleClosePinModal}
        title="Enter Transaction PIN"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your 4-digit PIN to confirm the withdrawal
            </p>
          </div>

          <PinInput
            value={pin}
            onChange={handlePinChange}
            onComplete={handlePinComplete}
            length={4}
            autoFocus={true}
            disabled={withdrawMutation.isPending}
            label="Transaction PIN"
          />

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

          {withdrawMutation.isPending && (
            <div className="flex items-center justify-center gap-2">
              <Spinner size="md" variant="primary" />
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  )
}

export default NGNWithdrawSummaryStep
