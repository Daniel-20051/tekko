import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCryptoIconConfig } from '../../../../utils/crypto-icons'
import { useCoinImages } from '../../../../hooks/useCoinImage'
import CryptoImage from '../../../ui/CryptoImage'
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
  const coinImages = useCoinImages([selectedCurrency, ...wallets.map(w => w.currency)])

  const selectedWallet = wallets.find(w => w.currency.toUpperCase() === selectedCurrency.toUpperCase())
  const iconConfig = selectedWallet ? getCryptoIconConfig(selectedWallet.currency) : null
  const selectedImageUrl = coinImages[selectedCurrency.toUpperCase()]

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
        <div className="flex items-center gap-3">
          {selectedWallet && (
            <div className="w-8 h-8 shrink-0">
              <CryptoImage 
                symbol={selectedWallet.currency}
                imageUrl={selectedImageUrl}
                size="md"
                className="rounded-lg"
              />
            </div>
          )}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {selectedWallet ? `${selectedWallet.currency} - ${iconConfig?.name || selectedWallet.currency}` : 'Select Currency'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
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
              const walletImageUrl = coinImages[wallet.currency.toUpperCase()]
              const isSelected = selectedCurrency === wallet.currency.toUpperCase()

              return (
                <button
                  key={wallet.currency}
                  onClick={() => handleSelect(wallet.currency)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-primary/30 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/10 dark:bg-dark-bg text-primary dark:text-gray-300' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 shrink-0">
                      <CryptoImage 
                        symbol={wallet.currency}
                        imageUrl={walletImageUrl}
                        size="md"
                        className="rounded-lg"
                      />
                    </div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {wallet.currency} - {walletIconConfig.name}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary shrink-0" />
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
