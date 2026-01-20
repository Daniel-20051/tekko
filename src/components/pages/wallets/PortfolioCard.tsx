import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSupportedCurrencies } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import type { SingleCurrencyBalance } from '../../../types/wallet'
import { useBalanceStore } from '../../../store/balance.store'
import { useCurrencyStore } from '../../../store/currency.store'

interface PortfolioCardProps {
  selectedAsset: string
  balanceData?: SingleCurrencyBalance
}

const PortfolioCard = ({ selectedAsset, balanceData }: PortfolioCardProps) => {
  const { data: supportedCurrencies } = useSupportedCurrencies()
  const { isBalanceHidden } = useBalanceStore()
  const { selectedCurrency: displayCurrency } = useCurrencyStore()

  // Get the selected currency data
  const selectedCurrency = useMemo(() => {
    return supportedCurrencies?.currencies.find(
      c => c.code.toLowerCase() === selectedAsset.toLowerCase()
    )
  }, [supportedCurrencies, selectedAsset])
  
  // Get currency symbol for display
  const currencySymbol = displayCurrency === 'NGN' ? '₦' : '$'

  // Get icon config
  const iconConfig = useMemo(() => {
    return getCryptoIconConfig(selectedAsset.toUpperCase())
  }, [selectedAsset])

  const Icon = iconConfig.icon
  const wallet = balanceData?.wallet
  const currencyCode = selectedCurrency?.code || selectedAsset.toUpperCase()
  const currencyName = selectedCurrency?.name || selectedAsset
  
  // Get balance values
  const totalBalance = wallet?.balance || '0.00000000'
  const availableBalance = wallet?.availableBalance || '0.00000000'
  const lockedBalance = wallet?.lockedBalance || '0'
  const fiatValueNGN = wallet?.fiatValue?.NGN || '0.00'
  const fiatValueUSD = wallet?.fiatValue?.USD || '0.00'
  const pricePerUnitNGN = wallet?.pricePerUnit?.NGN || '0.00'
  const pricePerUnitUSD = wallet?.pricePerUnit?.USD || '0.00'
  
  // Get fiat value based on selected display currency
  const fiatValue = displayCurrency === 'NGN' ? fiatValueNGN : fiatValueUSD
  const pricePerUnit = displayCurrency === 'NGN' ? pricePerUnitNGN : pricePerUnitUSD
  const otherCurrencySymbol = displayCurrency === 'NGN' ? '$' : '₦'
  const otherPricePerUnit = displayCurrency === 'NGN' ? pricePerUnitUSD : pricePerUnitNGN
  
  const isHidden = isBalanceHidden(selectedAsset.toLowerCase())

  // Format numbers with proper decimal places
  const formatBalance = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return '0.00000000'
    return num.toFixed(8)
  }

  const formatFiat = (value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) return '0.00'
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-surface rounded-xl p-4 border border-gray-200 dark:border-gray-800"
    >
      {/* Header with Icon and Total Balance */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconConfig.iconBg} rounded-full flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${iconConfig.iconColor}`} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {isHidden ? '••••' : `${formatBalance(totalBalance)}`} {currencyCode}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{currencyName}</p>
          </div>
        </div>
      </div>

      {/* Balance Details */}
      <div className="space-y-2 mb-4">
        {/* Available Balance */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {isHidden ? '••••' : `${formatBalance(availableBalance)} ${currencyCode}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isHidden ? '••••' : `≈ ${currencySymbol}${formatFiat(fiatValue)}`}
            </p>
          </div>
        </div>

        {/* Locked Balance */}
        {parseFloat(lockedBalance) > 0 && (
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Locked</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {isHidden ? '••••' : `${formatBalance(lockedBalance)} ${currencyCode}`}
              </p>
            </div>
          </div>
        )}

        {/* Price Per Unit */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Price per unit</span>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {isHidden ? '••••' : `${currencySymbol}${formatFiat(pricePerUnit)}`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isHidden ? '••••' : `${otherCurrencySymbol}${formatFiat(otherPricePerUnit)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-colors cursor-pointer ${
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
          className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Receive
        </motion.button>
      </div>
    </motion.div>
  )
}

export default PortfolioCard

