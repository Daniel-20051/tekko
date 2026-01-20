import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, Check, ChevronRight } from 'lucide-react'
import Button from '../../ui/Button'

interface WalletDropdownProps {
  walletFilter: 'all' | 'fiat' | 'digital'
  showWalletDropdown: boolean
  onToggle: () => void
  onSelectFilter: (filter: 'all' | 'fiat' | 'digital') => void
  dropdownRef: React.RefObject<HTMLDivElement | null> | React.RefObject<HTMLDivElement>
}

const WalletDropdown = ({
  walletFilter,
  showWalletDropdown,
  onToggle,
  onSelectFilter,
  dropdownRef
}: WalletDropdownProps) => {
  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        icon={<Wallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
        onClick={onToggle}
        className="w-full justify-between bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 h-[38px]"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">Wallets</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto transition-transform ${showWalletDropdown ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {showWalletDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden"
          >
            <button
              onClick={() => onSelectFilter('all')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
            >
              <span className={`text-sm font-medium ${walletFilter === 'all' ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                All
              </span>
              {walletFilter === 'all' && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
            <button
              onClick={() => onSelectFilter('fiat')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
            >
              <span className={`text-sm font-medium ${walletFilter === 'fiat' ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                Fiat
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
            <button
              onClick={() => onSelectFilter('digital')}
              className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
            >
              <span className={`text-sm font-medium ${walletFilter === 'digital' ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                Digital
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WalletDropdown
