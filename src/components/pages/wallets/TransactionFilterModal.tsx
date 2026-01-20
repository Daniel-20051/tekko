import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TransactionType, TransactionStatus, Currency } from '../../../types/transaction'

interface TransactionFilterDropdownProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: TransactionFilters) => void
  initialFilters?: TransactionFilters
  availableCurrencies?: Currency[]
  buttonRef: React.RefObject<HTMLButtonElement | null>
  selectedAsset?: string // The currently selected wallet/asset
}

export interface TransactionFilters {
  currency?: Currency
  type?: TransactionType
  status?: TransactionStatus
  startDate?: string
  endDate?: string
}

const TransactionFilterDropdown = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {},
  availableCurrencies = ['BTC', 'ETH', 'USDT'],
  buttonRef,
  selectedAsset
}: TransactionFilterDropdownProps) => {
  // Determine if we should show currency selector (only if no specific wallet is selected)
  const shouldShowCurrencySelector = !selectedAsset
  // Auto-set currency from selected asset if available
  const autoCurrency = selectedAsset ? (selectedAsset.toUpperCase() as Currency) : undefined

  const [filters, setFilters] = useState<TransactionFilters>({
    currency: initialFilters.currency || autoCurrency,
    type: initialFilters.type,
    status: initialFilters.status,
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate
  })

  // Update currency when selectedAsset changes
  useEffect(() => {
    if (selectedAsset && autoCurrency) {
      setFilters(prev => ({
        ...prev,
        currency: autoCurrency
      }))
    }
  }, [selectedAsset, autoCurrency])

  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const serviceDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const currencyDropdownRef = useRef<HTMLDivElement>(null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update position when dropdown opens (desktop only)
  useEffect(() => {
    if (isOpen && buttonRef.current && !isMobile) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: buttonRect.bottom + 8,
        right: window.innerWidth - buttonRect.right
      })
    }
  }, [isOpen, buttonRef, isMobile])

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
          onClose()
        }
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setShowServiceDropdown(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false)
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, buttonRef])

  const serviceOptions: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'trade', label: 'Trade' },
    { value: 'fee', label: 'Fee' }
  ]

  const typeOptions: { value: TransactionStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const currencyOptions: { value: Currency | 'all'; label: string }[] = [
    { value: 'all', label: 'All Currencies' },
    ...availableCurrencies.map(currency => ({ value: currency, label: currency }))
  ]

  const selectedService = serviceOptions.find(opt => opt.value === (filters.type || 'all'))
  const selectedType = typeOptions.find(opt => opt.value === (filters.status || 'all'))
  const selectedCurrency = currencyOptions.find(opt => opt.value === (filters.currency || 'all'))

  const handleServiceSelect = (value: TransactionType | 'all') => {
    setFilters(prev => ({
      ...prev,
      type: value === 'all' ? undefined : value
    }))
    setShowServiceDropdown(false)
  }

  const handleTypeSelect = (value: TransactionStatus | 'all') => {
    setFilters(prev => ({
      ...prev,
      status: value === 'all' ? undefined : value
    }))
    setShowTypeDropdown(false)
  }

  const handleCurrencySelect = (value: Currency | 'all') => {
    setFilters(prev => ({
      ...prev,
      currency: value === 'all' ? undefined : value
    }))
    setShowCurrencyDropdown(false)
  }

  const handleApply = () => {
    // Clean up filters - remove undefined values
    const cleanedFilters: TransactionFilters = {}
    // Always include currency if a wallet is selected, or if user explicitly set it
    if (autoCurrency) {
      cleanedFilters.currency = autoCurrency
    } else if (filters.currency) {
      cleanedFilters.currency = filters.currency
    }
    if (filters.type) cleanedFilters.type = filters.type
    if (filters.status) cleanedFilters.status = filters.status
    if (filters.startDate) cleanedFilters.startDate = filters.startDate
    if (filters.endDate) cleanedFilters.endDate = filters.endDate

    onApplyFilters(cleanedFilters)
    onClose()
  }

  const handleReset = () => {
    // Reset to default: keep currency if wallet is selected, otherwise clear all
    setFilters({
      currency: autoCurrency,
      type: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-40 bg-black/50 lg:bg-transparent"
            onClick={onClose}
          />
          
          {/* Dropdown Menu */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`fixed z-50 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl min-w-[320px] max-w-[90vw] lg:max-w-none ${
              isMobile 
                ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' 
                : ''
            }`}
            style={!isMobile ? {
              top: `${position.top}px`,
              right: `${position.right}px`
            } : undefined}
          >
            <div className="p-4 space-y-4">
              {/* Title */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Transaction Filter</h3>
              </div>

              {/* Service and Type Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
          {/* Service Dropdown */}
          <div className="relative" ref={serviceDropdownRef}>
            <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
              Service
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowServiceDropdown(!showServiceDropdown)
                  setShowTypeDropdown(false)
                  setShowCurrencyDropdown(false)
                }}
                className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{selectedService?.label || 'All'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showServiceDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showServiceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {serviceOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleServiceSelect(option.value as TransactionType | 'all')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Type Dropdown */}
          <div className="relative" ref={typeDropdownRef}>
            <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
              Type
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown)
                  setShowServiceDropdown(false)
                  setShowCurrencyDropdown(false)
                }}
                className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{selectedType?.label || 'All'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {typeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTypeSelect(option.value as TransactionStatus | 'all')}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Currency Filter - Only show if no specific wallet is selected */}
        {shouldShowCurrencySelector && availableCurrencies.length > 0 && (
          <div className="relative" ref={currencyDropdownRef}>
            <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
              Currency
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown)
                  setShowServiceDropdown(false)
                  setShowTypeDropdown(false)
                }}
                className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{selectedCurrency?.label || 'All Currencies'}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCurrencySelect(option.value as Currency | 'all')}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        option.value === (filters.currency || 'all')
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-bg'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

              {/* Date Range Filters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={filters.startDate ? (() => {
                      const date = new Date(filters.startDate)
                      // Convert UTC to local time for display
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const day = String(date.getDate()).padStart(2, '0')
                      const hours = String(date.getHours()).padStart(2, '0')
                      const minutes = String(date.getMinutes()).padStart(2, '0')
                      return `${year}-${month}-${day}T${hours}:${minutes}`
                    })() : ''}
                    onChange={(e) => {
                      // Convert local datetime to ISO 8601 UTC format
                      const value = e.target.value ? new Date(e.target.value).toISOString() : undefined
                      setFilters(prev => ({ ...prev, startDate: value }))
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-900 dark:text-white mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={filters.endDate ? (() => {
                      const date = new Date(filters.endDate)
                      // Convert UTC to local time for display
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const day = String(date.getDate()).padStart(2, '0')
                      const hours = String(date.getHours()).padStart(2, '0')
                      const minutes = String(date.getMinutes()).padStart(2, '0')
                      return `${year}-${month}-${day}T${hours}:${minutes}`
                    })() : ''}
                    onChange={(e) => {
                      // Convert local datetime to ISO 8601 UTC format
                      const value = e.target.value ? new Date(e.target.value).toISOString() : undefined
                      setFilters(prev => ({ ...prev, endDate: value }))
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TransactionFilterDropdown
