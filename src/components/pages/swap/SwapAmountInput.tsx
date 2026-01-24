import { useState, useEffect, useRef } from 'react'
import { Wallet } from 'lucide-react'
import Input from '../../ui/Input'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import { useCoinImages } from '../../../hooks/useCoinImage'
import CryptoImage from '../../ui/CryptoImage'
import { formatNumber } from '../../../utils/time.utils'
import type { Wallet as WalletType } from '../../../types/wallet'

interface SwapAmountInputProps {
  label: 'Sell' | 'Buy'
  amount: string
  onAmountChange: (amount: string) => void
  currency: string
  balance: string
  availableWallets: WalletType[]
  onCurrencyChange: (currency: string) => void
  disabled?: boolean
  readOnly?: boolean
}

const SwapAmountInput = ({
  label,
  amount,
  onAmountChange,
  currency,
  balance,
  availableWallets,
  onCurrencyChange,
  disabled = false,
  readOnly = false
}: SwapAmountInputProps) => {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const coinImages = useCoinImages([currency, ...availableWallets.map(w => w.currency)])
  const currentImageUrl = coinImages[currency.toUpperCase()]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false)
      }
    }

    if (isCurrencyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCurrencyDropdownOpen])

  // Normalize amount by removing trailing zeros after decimal point
  const normalizeAmount = (value: string): string => {
    if (!value || value === '') return ''
    // Remove commas
    let cleanValue = value.replace(/,/g, '')
    // Remove trailing zeros after decimal point (e.g., "1500.00" -> "1500", "1500.50" -> "1500.5")
    if (cleanValue.includes('.')) {
      // Remove trailing zeros, but keep at least one digit if there are non-zero digits
      // This handles: "1500.50" -> "1500.5", "1500.00" -> "1500"
      const parts = cleanValue.split('.')
      if (parts.length === 2) {
        const integerPart = parts[0]
        let decimalPart = parts[1]
        // Remove trailing zeros from decimal part
        decimalPart = decimalPart.replace(/0+$/, '')
        // If decimal part is empty or all zeros, don't include the decimal point
        cleanValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart
      }
    }
    return cleanValue
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Remove commas for processing
    value = value.replace(/,/g, '')
    // Allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value)
    }
  }
  
  // Format amount for display (with commas)
  // Always show formatted value with commas, even when focused
  // For read-only inputs, always show formatted
  const displayAmount = amount ? formatNumber(amount) : ''

  const handleHalf = () => {
    // Strip commas from balance before parsing
    const cleanBalance = balance.replace(/,/g, '')
    const halfAmount = (parseFloat(cleanBalance) / 2).toFixed(8)
    // Normalize to remove trailing zeros
    onAmountChange(normalizeAmount(halfAmount))
  }

  const handleMax = () => {
    // Strip commas from balance before using
    const cleanBalance = balance.replace(/,/g, '')
    // Normalize to remove trailing zeros if present
    onAmountChange(normalizeAmount(cleanBalance))
  }

  const handleCurrencySelect = (selectedCurrency: string) => {
    onCurrencyChange(selectedCurrency)
    setIsCurrencyDropdownOpen(false)
  }

  return (
    <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3 border border-gray-200 dark:border-primary/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Wallet className="w-3.5 h-3.5" />
          <span>{formatNumber(balance)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          value={displayAmount}
          onChange={handleAmountChange}
          onBlur={(e) => {
            // Ensure state has the raw value (strip any commas that might have been displayed)
            const rawValue = e.target.value.replace(/,/g, '')
            // Normalize the value to remove trailing zeros
            const normalizedValue = normalizeAmount(rawValue)
            if (normalizedValue !== amount && (normalizedValue === '' || /^\d*\.?\d*$/.test(normalizedValue))) {
              onAmountChange(normalizedValue)
            }
          }}
          placeholder="0.00"
          disabled={disabled || readOnly}
          readOnly={readOnly}
          className="flex-1 text-xl font-semibold bg-transparent border-0 p-0 focus:ring-0 dark:bg-transparent"
        />
        {!readOnly && (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={handleHalf}
              disabled={disabled || parseFloat(balance) === 0}
              className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Half
            </button>
            <button
              type="button"
              onClick={handleMax}
              disabled={disabled || parseFloat(balance) === 0}
              className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Max
            </button>
          </div>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
          disabled={disabled}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 shrink-0">
            <CryptoImage 
              symbol={currency}
              imageUrl={currentImageUrl}
              size="md"
              className="rounded-full"
            />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{currency}</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isCurrencyDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto w-72" style={{ maxHeight: '192px' }}>
            {availableWallets.map((wallet) => {
              const walletIconConfig = getCryptoIconConfig(wallet.currency)
              const walletImageUrl = coinImages[wallet.currency.toUpperCase()]
              const isSelected = wallet.currency.toUpperCase() === currency.toUpperCase()

              return (
                <button
                  key={wallet.currency}
                  type="button"
                  onClick={() => handleCurrencySelect(wallet.currency)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-primary/30 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/10 dark:bg-dark-bg text-primary dark:text-gray-300' : ''
                  }`}
                >
                  <div className="w-8 h-8 shrink-0">
                    <CryptoImage 
                      symbol={wallet.currency}
                      imageUrl={walletImageUrl}
                      size="md"
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className={`text-sm font-medium ${isSelected ? 'text-primary dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>{wallet.currency}</div>
                    <div className={`text-xs truncate ${isSelected ? 'text-primary/70 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{walletIconConfig.name}</div>
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SwapAmountInput
