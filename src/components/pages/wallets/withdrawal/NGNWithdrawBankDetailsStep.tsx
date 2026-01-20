import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import { nigerianBanks } from '../../../../utils/nigerian-banks'

interface NGNWithdrawBankDetailsStepProps {
  onNext: (bankDetails: {
    accountNumber: string
    accountName: string
    bankName: string
    bankCode: string
  }) => void
  onBack: () => void
}

const NGNWithdrawBankDetailsStep = ({ onNext, onBack: _onBack }: NGNWithdrawBankDetailsStepProps) => {
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleNext = () => {
    setError(null)
    
    if (!accountNumber || accountNumber.trim().length < 10) {
      setError('Please enter a valid account number (minimum 10 digits)')
      return
    }
    
    if (!accountName || accountName.trim().length < 3) {
      setError('Please enter account name')
      return
    }
    
    if (!selectedBank) {
      setError('Please select a bank')
      return
    }

    const bank = nigerianBanks.find(b => b.code === selectedBank)
    if (!bank) {
      setError('Invalid bank selected')
      return
    }

    onNext({
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      bankName: bank.name,
      bankCode: bank.code,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {/* Account Number */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Account Number
        </label>
        <Input
          type="text"
          value={accountNumber}
          onChange={(e) => {
            setAccountNumber(e.target.value.replace(/\D/g, ''))
            setError(null)
          }}
          placeholder="Enter account number"
          maxLength={10}
        />
      </div>

      {/* Account Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Account Name
        </label>
        <Input
          type="text"
          value={accountName}
          onChange={(e) => {
            setAccountName(e.target.value)
            setError(null)
          }}
          placeholder="Enter account name"
        />
      </div>

      {/* Bank Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Bank
        </label>
        <select
          value={selectedBank}
          onChange={(e) => {
            setSelectedBank(e.target.value)
            setError(null)
          }}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select a bank</option>
          {nigerianBanks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
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
        disabled={!accountNumber || !accountName || !selectedBank}
      >
        Continue
      </Button>
    </motion.div>
  )
}

export default NGNWithdrawBankDetailsStep
