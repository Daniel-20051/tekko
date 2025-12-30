import { motion } from 'framer-motion'
import { Bitcoin, Waves, DollarSign, Circle, Search } from 'lucide-react'

interface Asset {
  id: string
  name: string
  symbol: string
  balance: string
  icon: any
  iconColor: string
  iconBg: string
}

const assets: Asset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '1.95232',
    icon: Bitcoin,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/20'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '3',
    icon: Waves,
    iconColor: 'text-gray-400',
    iconBg: 'bg-gray-500/20'
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    balance: '657.67',
    icon: DollarSign,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/20'
  },
  {
    id: 'binance',
    name: 'Binance Coin',
    symbol: 'BNB',
    balance: '3',
    icon: Circle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-500/20'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    balance: '3,662',
    icon: Circle,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/20'
  },
  {
    id: 'ethereum-classic',
    name: 'Ethereum Classic',
    symbol: 'ETC',
    balance: '657.67',
    icon: Waves,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-600/20'
  },
  {
    id: 'dai',
    name: 'Dai',
    symbol: 'DAI',
    balance: '265.72',
    icon: Circle,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-400/20'
  },
  {
    id: 'uniswap',
    name: 'Uniswap',
    symbol: 'UNI',
    balance: '7',
    icon: Circle,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-500/20'
  },
  {
    id: 'fantom',
    name: 'Fantom',
    symbol: 'FTM',
    balance: '291.88',
    icon: Circle,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/20'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    balance: '5',
    icon: Circle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/20'
  }
]

interface AssetsSidebarProps {
  selectedAsset: string
  onSelectAsset: (assetId: string) => void
}

const AssetsSidebar = ({ selectedAsset, onSelectAsset }: AssetsSidebarProps) => {
  return (
    <div className="w-80 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-sm">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-dark-bg rounded-lg text-sm text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 transition-colors"
          />
        </div>
      </div>

      {/* Assets List */}
      <div className="flex-1 overflow-y-auto wallet-assets-scrollbar">
        {assets.map((asset, index) => {
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance {asset.balance} {asset.symbol}</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default AssetsSidebar

