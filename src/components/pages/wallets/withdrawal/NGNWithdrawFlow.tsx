import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import NGNWithdrawAmountStep from './NGNWithdrawAmountStep'
import NGNWithdrawBankDetailsStep from './NGNWithdrawBankDetailsStep'
import NGNWithdrawSummaryStep from './NGNWithdrawSummaryStep'
import type { NGNWithdrawalFeesData, NGNWithdrawalData } from '../../../../types/wallet'

interface NGNWithdrawFlowProps {
  availableBalance: string
  currency: string
}

type Step = 'amount' | 'bank' | 'summary' | 'success'

const NGNWithdrawFlow = ({ availableBalance, currency }: NGNWithdrawFlowProps) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('amount')
  const [amount, setAmount] = useState('')
  const [feesData, setFeesData] = useState<NGNWithdrawalFeesData | null>(null)
  const [bankDetails, setBankDetails] = useState<{
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
  } | null>(null)
  const [withdrawalData, setWithdrawalData] = useState<NGNWithdrawalData | null>(null)

  const handleAmountNext = (enteredAmount: string, calculatedFees: NGNWithdrawalFeesData) => {
    setAmount(enteredAmount)
    setFeesData(calculatedFees)
    setCurrentStep('bank')
  }

  const handleBankNext = (details: {
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
  }) => {
    setBankDetails(details)
    setCurrentStep('summary')
  }

  const handleWithdrawSuccess = (data: NGNWithdrawalData) => {
    setWithdrawalData(data)
    setCurrentStep('success')
    setTimeout(() => {
      navigate({ to: '/wallets' })
    }, 3000)
  }

  return (
    <div className="w-full">
      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'amount' && (
          <NGNWithdrawAmountStep
            key="amount"
            availableBalance={availableBalance}
            currency={currency}
            onNext={handleAmountNext}
            onBack={() => navigate({ to: '/wallets' })}
          />
        )}

        {currentStep === 'bank' && feesData && (
          <NGNWithdrawBankDetailsStep
            key="bank"
            onNext={handleBankNext}
            onBack={() => setCurrentStep('amount')}
          />
        )}

        {currentStep === 'summary' && feesData && bankDetails && (
          <NGNWithdrawSummaryStep
            key="summary"
            amount={amount}
            feesData={feesData}
            bankDetails={bankDetails}
            currency={currency}
            onBack={() => setCurrentStep('bank')}
            onSuccess={handleWithdrawSuccess}
          />
        )}

        {currentStep === 'success' && withdrawalData && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-surface rounded-xl border border-green-200 dark:border-green-900/50 p-8 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Withdrawal Initiated Successfully!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Your withdrawal is being processed. You'll receive {withdrawalData.netAmount} {currency} in your bank account.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Estimated completion: {new Date(withdrawalData.estimatedCompletion).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Redirecting to wallets...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NGNWithdrawFlow
