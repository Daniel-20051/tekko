import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCryptoIconConfig } from '../../../../utils/crypto-icons'
import Button from '../../../ui/Button'
import type { Wallet } from '../../../../types/wallet'

interface CurrencyDropdownProps {
  wallets: Wallet[]
  selectedCurrency: string
  onSelectCurrency: (currency: string) => void
}

const CurrencyDropdown = ({ wallets, selectedCurrency, onSelectCurrency }: CurrencyDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedWallet = wallets.find(w => w.currency.toUpperCase() === selectedCurrency.toUpperCase())
  const iconConfig = selectedWallet ? getCryptoIconConfig(selectedWallet.currency) : null
  const Icon = iconConfig?.icon

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (currency: string) => {
    onSelectCurrency(currency)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 h-[42px]"
      >
        <div className="flex items-center gap-2">
          {Icon && iconConfig && (
            <div className={`w-6 h-6 ${iconConfig.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${iconConfig.iconColor}`} />
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {selectedWallet ? `${selectedWallet.currency} - ${iconConfig?.name || selectedWallet.currency}` : 'Select Currency'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto"
          >
            {wallets.map((wallet) => {
              const walletIconConfig = getCryptoIconConfig(wallet.currency)
              const WalletIcon = walletIconConfig.icon
              const isSelected = selectedCurrency === wallet.currency.toUpperCase()

              return (
                <button
                  key={wallet.currency}
                  onClick={() => handleSelect(wallet.currency)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${walletIconConfig.iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                      <WalletIcon className={`w-3.5 h-3.5 ${walletIconConfig.iconColor}`} />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {wallet.currency} - {walletIconConfig.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CurrencyDropdown
