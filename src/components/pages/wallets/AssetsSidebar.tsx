import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useSupportedCurrencies, useWalletBalances } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'

interface Asset {
  id: string
  name: string
  code: string
  balance: string
  icon: any
  iconColor: string
  iconBg: string
}

interface AssetsSidebarProps {
  selectedAsset: string
  onSelectAsset: (assetId: string) => void
}

const AssetsSidebar = ({ selectedAsset, onSelectAsset }: AssetsSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: supportedCurrencies, isLoading: isLoadingCurrencies } = useSupportedCurrencies()
  const { data: walletBalances, isLoading: isLoadingBalances } = useWalletBalances()

  // Build assets list from supported currencies and balances
  const assets: Asset[] = useMemo(() => {
    if (!supportedCurrencies?.currencies) return []

    return supportedCurrencies.currencies.map((currency) => {
      const iconConfig = getCryptoIconConfig(currency.code)
      // Find the wallet balance for this currency
      const wallet = walletBalances?.wallets?.find(w => w.currency === currency.code)
      const balance = wallet?.balance || '0'

      return {
        id: currency.code.toLowerCase(),
        name: currency.name,
        code: currency.code,
        balance: balance,
        icon: iconConfig.icon,
        iconColor: iconConfig.iconColor,
        iconBg: iconConfig.iconBg
      }
    })
  }, [supportedCurrencies, walletBalances])

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return assets

    const query = searchQuery.toLowerCase()
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.code.toLowerCase().includes(query)
    )
  }, [assets, searchQuery])

  const isLoading = isLoadingCurrencies || isLoadingBalances

  return (
    <div className="w-80 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-sm">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-dark-bg rounded-lg text-sm text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 transition-colors"
          />
        </div>
      </div>

      {/* Assets List */}
      <div className="flex-1 overflow-y-auto wallet-assets-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Loading currencies...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No assets found' : 'No assets available'}
            </p>
          </div>
        ) : (
          filteredAssets.map((asset, index) => {
            const Icon = asset.icon
            const isSelected = selectedAsset === asset.id

            return (
              <motion.button
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectAsset(asset.id)}
                className={`w-full p-3 flex items-center cursor-pointer gap-2.5 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors border-l-3 ${
                  isSelected 
                    ? 'bg-primary/5 dark:bg-dark-bg border-primary' 
                    : 'border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${asset.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${asset.iconColor}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{asset.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Balance {asset.balance} {asset.code}</p>
                </div>
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default AssetsSidebar
