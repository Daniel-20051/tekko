import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, ArrowUpDown, Eye, EyeOff, Star, ChevronRight, Plus, Wallet, ChevronDown, Check } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useCryptoBalances } from '../../../hooks/useWallet'
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
  const [hiddenBalances, setHiddenBalances] = useState<Record<string, boolean>>({})
  const [showWalletDropdown, setShowWalletDropdown] = useState(false)
  const [walletFilter, setWalletFilter] = useState<'all' | 'fiat' | 'digital'>('all')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: cryptoBalances, isLoading: isLoadingBalances } = useCryptoBalances()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWalletDropdown(false)
      }
    }

    if (showWalletDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWalletDropdown])

  // Build assets list from crypto balances - only show wallets with balances
  const assets: Asset[] = useMemo(() => {
    if (!cryptoBalances?.balances) return []

    return cryptoBalances.balances
      .filter(balance => parseFloat(balance.balance) > 0) // Only show wallets with balance > 0
      .map((balance) => {
        const iconConfig = getCryptoIconConfig(balance.currency)
        
        // Get currency name from icon config or use currency code
        const currencyName = iconConfig.name || balance.currency

        return {
          id: balance.currency.toLowerCase(),
          name: currencyName,
          code: balance.currency,
          balance: balance.balance,
          icon: iconConfig.icon,
          iconColor: iconConfig.iconColor,
          iconBg: iconConfig.iconBg
        }
      })
  }, [cryptoBalances])

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

  const isLoading = isLoadingBalances

  const toggleBalanceVisibility = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHiddenBalances(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }))
  }

  const formatBalance = (balance: string, code: string, isHidden: boolean) => {
    if (isHidden) return '••••'
    const numBalance = parseFloat(balance)
    if (numBalance === 0) return `0 ${code}`
    return `${numBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${code}`
  }

  const hasNoWallets = !isLoadingBalances && (!cryptoBalances?.balances || cryptoBalances.balances.length === 0)

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-dark-surface lg:rounded-xl border-0 lg:border border-gray-200 dark:border-primary/50 overflow-hidden flex flex-col max-h-[calc(100vh-100px)] lg:max-h-[calc(100vh-120px)]">
      {/* Wallet Filter and Create Button */}
      <div className="p-3 lg:p-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Wallets</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 ml-auto transition-transform ${showWalletDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
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
                  onClick={() => {
                    setWalletFilter('all')
                    setShowWalletDropdown(false)
                  }}
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
                  onClick={() => {
                    setWalletFilter('fiat')
                    setShowWalletDropdown(false)
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
                >
                  <span className={`text-sm font-medium ${walletFilter === 'fiat' ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                    Fiat
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
                <button
                  onClick={() => {
                    setWalletFilter('digital')
                    setShowWalletDropdown(false)
                  }}
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
        <button className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create</span>
        </button>
      </div>

      {/* Search Bar - Hide on mobile, show on desktop */}
      <div className="hidden lg:block p-3 border-b border-gray-200 dark:border-gray-800">
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
            <p className="text-xs text-gray-600 dark:text-gray-400">Loading wallets...</p>
          </div>
        ) : hasNoWallets ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              No Wallets Yet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
              Create your first wallet to start managing your crypto assets
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              Create Wallet
            </button>
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
            const isBalanceHidden = hiddenBalances[asset.id] || false
            const hasActivity = parseFloat(asset.balance) > 0

            return (
              <motion.button
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectAsset(asset.id)}
                className={`w-full p-3 lg:p-3 flex items-center cursor-pointer gap-3 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors border-l-3 lg:border-l-3 relative ${
                  isSelected 
                    ? 'bg-primary/5 dark:bg-dark-bg border-primary' 
                    : 'border-transparent'
                }`}
              >
                {/* Currency Icon with Activity Indicator */}
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 lg:w-10 lg:h-10 rounded-full lg:rounded-lg ${asset.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${asset.iconColor}`} />
                  </div>
                  {hasActivity && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-surface" />
                  )}
                </div>

                {/* Currency Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{asset.code}</p>
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{asset.name}</p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">
                    {formatBalance(asset.balance, asset.code, isBalanceHidden)}
                  </p>
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => toggleBalanceVisibility(asset.id, e)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                    title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
                  >
                    {isBalanceHidden ? (
                      <EyeOff className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                    title="Transfer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-1" />
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
