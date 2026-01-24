import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { getCryptoIconConfig } from '../../../../utils/crypto-icons'
import { useCoinImages } from '../../../../hooks/useCoinImage'
import CryptoImage from '../../../ui/CryptoImage'
import type { Wallet } from '../../../../types/wallet'

interface WalletListProps {
  wallets: Wallet[]
  selectedCurrency: string
  onSelectCurrency: (currency: string) => void
}

const WalletList = ({ wallets, selectedCurrency, onSelectCurrency }: WalletListProps) => {
  const coinImages = useCoinImages(wallets.map(w => w.currency))

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 overflow-hidden flex flex-col max-h-[600px]">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          WALLETS
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <Info className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">No wallets available</p>
          </div>
        ) : (
          <div className="p-2">
            {wallets.map((wallet) => {
              const iconConfig = getCryptoIconConfig(wallet.currency)
              const imageUrl = coinImages[wallet.currency.toUpperCase()]
              const isSelected = selectedCurrency === wallet.currency.toUpperCase()
              
              return (
                <motion.button
                  key={wallet.currency}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectCurrency(wallet.currency)}
                  className={`w-full p-3 rounded-lg transition-all text-left ${
                    isSelected
                      ? 'bg-primary/10 dark:bg-dark-bg text-primary dark:text-gray-300 border-2 border-primary'
                      : 'bg-transparent hover:bg-gray-100 dark:hover:bg-primary/30 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 shrink-0">
                      <CryptoImage 
                        symbol={wallet.currency}
                        imageUrl={imageUrl}
                        size="md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {wallet.currency}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {iconConfig.name}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletList
