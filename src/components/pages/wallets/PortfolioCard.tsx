import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSupportedCurrencies } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import type { SingleCurrencyBalance } from '../../../types/wallet'

interface PortfolioCardProps {
  selectedAsset: string
  balanceData?: SingleCurrencyBalance
}

const PortfolioCard = ({ selectedAsset, balanceData }: PortfolioCardProps) => {
  const { data: supportedCurrencies } = useSupportedCurrencies()

  // Get the selected currency data
  const selectedCurrency = useMemo(() => {
    return supportedCurrencies?.currencies.find(
      c => c.code.toLowerCase() === selectedAsset.toLowerCase()
    )
  }, [supportedCurrencies, selectedAsset])

  // Get icon config
  const iconConfig = useMemo(() => {
    return getCryptoIconConfig(selectedAsset.toUpperCase())
  }, [selectedAsset])

  const Icon = iconConfig.icon
  const balance = balanceData?.balance || '0'
  const currencyCode = selectedCurrency?.code || selectedAsset.toUpperCase()
  const currencyName = selectedCurrency?.name || selectedAsset

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      {/* Portfolio Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${iconConfig.iconBg} rounded-full flex items-center justify-center shrink-0`}>
            <Icon className={`w-6 h-6 ${iconConfig.iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {balance} {currencyCode}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currencyName}</p>
          </div>
        </div>
        
        {/* Settings Icon */}
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-24 mb-4 -mx-1">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
          <defs>
            <linearGradient id={`chartGradient${currencyCode}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={iconConfig.iconColor.replace('text-', 'rgb-')} stopOpacity="0.4" />
              <stop offset="100%" stopColor={iconConfig.iconColor.replace('text-', 'rgb-')} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Chart line path */}
          <path
            d="M 0 80 L 40 75 L 80 85 L 120 60 L 160 65 L 200 55 L 240 45 L 280 35 L 320 40 L 360 30 L 400 35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`drop-shadow-lg ${iconConfig.iconColor}`}
          />
          {/* Filled area */}
          <path
            d="M 0 80 L 40 75 L 80 85 L 120 60 L 160 65 L 200 55 L 240 45 L 280 35 L 320 40 L 360 30 L 400 35 L 400 100 L 0 100 Z"
            fill="currentColor"
            className={`${iconConfig.iconColor} opacity-10`}
          />
        </svg>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-3 rounded-xl text-white text-base font-semibold transition-colors ${
            selectedAsset === 'btc' ? 'bg-orange-500 hover:bg-orange-600' :
            selectedAsset === 'eth' ? 'bg-gray-500 hover:bg-gray-600' :
            selectedAsset === 'usdt' || selectedAsset === 'usdc' ? 'bg-green-600 hover:bg-green-700' :
            selectedAsset === 'bnb' ? 'bg-yellow-600 hover:bg-yellow-700' :
            selectedAsset === 'trx' ? 'bg-red-600 hover:bg-red-700' :
            'bg-primary hover:bg-primary/90'
          }`}
        >
          Send
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white text-base font-semibold transition-colors"
        >
          Receive
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PortfolioCard

