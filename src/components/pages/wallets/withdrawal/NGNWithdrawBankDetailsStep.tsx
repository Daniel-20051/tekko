import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import Spinner from '../../../ui/Spinner'
import BankDropdown from './BankDropdown'
import { getBanks, verifyBankAccount } from '../../../../api/wallet.api'
import type { Bank } from '../../../../types/bank'
import type { NGNWithdrawalFeesData } from '../../../../types/wallet'

interface NGNWithdrawBankDetailsStepProps {
  amount: string
  feesData: NGNWithdrawalFeesData
  currency: string
  onNext: (bankDetails: {
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
    institutionId: string
  }) => void
  onBack: () => void
}

const NGNWithdrawBankDetailsStep = ({ amount, feesData: _feesData, currency, onNext, onBack }: NGNWithdrawBankDetailsStepProps) => {
  const [accountNumber, setAccountNumber] = useState('')
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [verifiedAccountName, setVerifiedAccountName] = useState<string | null>(null)
  const [verifiedInstitutionId, setVerifiedInstitutionId] = useState<string | null>(null)

  const { data: banks = [], isLoading: isLoadingBanks, error: banksError } = useQuery<Bank[]>({
    queryKey: ['banks'],
    queryFn: getBanks,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    enabled: true, // Explicitly enable the query
    retry: 2,
  })

  // Log for debugging
  useEffect(() => {
    console.log('🔍 Banks Query State:', {
      isLoading: isLoadingBanks,
      hasData: !!banks,
      banksCount: Array.isArray(banks) ? banks.length : 0,
      error: banksError,
    })
  }, [isLoadingBanks, banks, banksError])

  // Reset verification when account number or bank changes
  useEffect(() => {
    if (verifiedAccountName || verifiedInstitutionId) {
      setVerifiedAccountName(null)
      setVerifiedInstitutionId(null)
      setError(null)
    }
  }, [accountNumber, selectedInstitutionId])

  // Auto-verify when account number has 10 digits and bank is selected
  useEffect(() => {
    // Don't auto-verify if already verified, pending, or conditions not met
    if (
      verifyMutation.isPending ||
      verifiedAccountName ||
      verifiedInstitutionId ||
      accountNumber.length !== 10 ||
      !selectedInstitutionId ||
      banks.length === 0
    ) {
      return
    }

    const bank = banks.find(b => b.institutionId === selectedInstitutionId)
    if (!bank || !bank.institutionId) {
      return
    }

    // Use institutionId directly (required)
    const verifyPayload = {
      accountNumber: accountNumber.trim(),
      institutionId: bank.institutionId,
    }

    verifyMutation.mutate(verifyPayload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber, selectedInstitutionId, banks])

  // Verify account mutation
  const verifyMutation = useMutation({
    mutationFn: verifyBankAccount,
    onSuccess: (data) => {
      setVerifiedAccountName(data.accountName)
      setVerifiedInstitutionId(data.institution.id)
      setError(null)
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to verify account. Please check your account number and try again.')
      setVerifiedAccountName(null)
      setVerifiedInstitutionId(null)
    },
  })

  const handleNext = () => {
    if (!verifiedAccountName || !verifiedInstitutionId) {
      setError('Please verify your account first')
      return
    }

    const bank = banks.find(b => b.institutionId === selectedInstitutionId)
    if (!bank || !bank.institutionId) {
      setError('Invalid bank selected')
      return
    }

    onNext({
      accountNumber: accountNumber.trim(),
      accountName: verifiedAccountName,
      bankName: bank.name,
      bankCode: bank.code, // Keep for backward compatibility if needed
      institutionId: verifiedInstitutionId,
    })
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
      {/* Back Button */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Amount Display */}
      <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Withdrawal Amount</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{currency}</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {formatBalance(amount)} {currency}
            </p>
          </div>
        </div>
      </div>

      {/* Account Number */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Account Number
        </label>
        <Input
          type="text"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
            setError(null)
          }}
          placeholder="Enter account number"
          maxLength={10}
        />
      </div>

      {/* Bank Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Bank
        </label>
        {banksError ? (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
            <p className="text-sm text-red-800 dark:text-red-300">
              Failed to load banks: {banksError instanceof Error ? banksError.message : 'Unknown error'}
            </p>
          </div>
        ) : (
          <BankDropdown
            banks={banks}
            selectedInstitutionId={selectedInstitutionId}
            onSelectBank={(institutionId) => {
              setSelectedInstitutionId(institutionId)
              setError(null)
            }}
            isLoading={isLoadingBanks}
          />
        )}
      </div>

      {/* Verification Status */}
      {verifyMutation.isPending && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Spinner size="md" variant="primary" className="shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-300">Verifying account...</p>
          </div>
        </div>
      )}

      {/* Verified Account Name Display */}
      {verifiedAccountName && verifiedInstitutionId && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">Account Verified</p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Account Name: <span className="font-semibold">{verifiedAccountName}</span>
              </p>
            </div>
          </div>
        </div>
      )}

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
        disabled={!verifiedAccountName || !verifiedInstitutionId || isLoadingBanks}
      >
        Continue
      </Button>
    </motion.div>
  )
}

export default NGNWithdrawBankDetailsStep
