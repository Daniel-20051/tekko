import { Plus } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useWalletBalances } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
import Spinner from '../../ui/Spinner'
import CreateWalletModal from './CreateWalletModal'
import WalletDropdown from './WalletDropdown'
import AssetSearchBar from './AssetSearchBar'
import EmptyWalletState from './EmptyWalletState'
import AssetListItem from './AssetListItem'
import Button from '../../ui/Button'

interface Asset {
  id: string
  name: string
  code: string
  balance: string
  availableBalance: string
  lockedBalance: string
  pendingBalance: string
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
  const [showWalletDropdown, setShowWalletDropdown] = useState(false)
  const [walletFilter, setWalletFilter] = useState<'all' | 'fiat' | 'digital'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshingAsset, setRefreshingAsset] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: walletBalances, isLoading: isLoadingBalances } = useWalletBalances()

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

  // List of fiat currencies
  const fiatCurrencies = ['NGN', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'ZAR', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'PLN', 'RUB', 'TRY', 'KRW', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 'CZK', 'HUF', 'ILS', 'CLP', 'ARS', 'COP', 'PEN', 'UAH', 'RON', 'BGN', 'HRK', 'ISK', 'NZD']

  // Build assets list from wallet balances - show all wallets including zero balances
  // Sort to always show NGN at the top
  const assets: Asset[] = useMemo(() => {
    if (!walletBalances?.wallets) return []

    return walletBalances.wallets
      .map((wallet) => {
        const iconConfig = getCryptoIconConfig(wallet.currency)
        
        // Get currency name from icon config or use currency code
        const currencyName = iconConfig.name || wallet.currency

        return {
          id: wallet.currency.toLowerCase(),
          name: currencyName,
          code: wallet.currency,
          balance: wallet.balance || '0',
          availableBalance: wallet.availableBalance || '0',
          lockedBalance: wallet.lockedBalance || '0',
          pendingBalance: '0', // New API doesn't have pendingBalance in wallet object
          icon: iconConfig.icon,
          iconColor: iconConfig.iconColor,
          iconBg: iconConfig.iconBg
        }
      })
      .sort((a, b) => {
        // Always put NGN at the top
        if (a.code.toUpperCase() === 'NGN') return -1
        if (b.code.toUpperCase() === 'NGN') return 1
        // Keep other currencies in their original order
        return 0
      })
  }, [walletBalances])

  // Filter assets based on wallet filter (all, fiat, digital)
  const filteredByType = useMemo(() => {
    if (walletFilter === 'all') return assets
    if (walletFilter === 'fiat') {
      return assets.filter(asset => fiatCurrencies.includes(asset.code.toUpperCase()))
    }
    if (walletFilter === 'digital') {
      return assets.filter(asset => !fiatCurrencies.includes(asset.code.toUpperCase()))
    }
    return assets
  }, [assets, walletFilter])

  // Filter assets based on search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery.trim()) return filteredByType

    const query = searchQuery.toLowerCase()
    return filteredByType.filter(
      (asset) =>
        asset.name.toLowerCase().includes(query) ||
        asset.code.toLowerCase().includes(query)
    )
  }, [filteredByType, searchQuery])

  const isLoading = isLoadingBalances


  const formatBalance = (balance: string | undefined | null, code: string, isHidden: boolean) => {
    if (isHidden) return '••••'
    
    // Handle undefined, null, or empty balance
    if (!balance || balance === '' || balance === 'undefined' || balance === 'null') {
      const decimals = (code === 'BTC' || code === 'ETH') ? 5 : 2
      return `0.${'0'.repeat(decimals)} ${code}`
    }
    
    // Ensure balance is a string
    const balanceStr = String(balance)
    const numBalance = parseFloat(balanceStr)
    
    // Determine decimal places: BTC and ETH get 5, all others get 2
    const decimals = (code === 'BTC' || code === 'ETH') ? 5 : 2
    
    if (isNaN(numBalance) || numBalance === 0) {
      return `0.${'0'.repeat(decimals)} ${code}`
    }
    
    // Format with appropriate decimal places
    const formatted = numBalance.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
    
    return `${formatted} ${code}`
  }

  const hasNoWallets = !isLoadingBalances && assets.length === 0

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-dark-surface lg:rounded-xl border-0 lg:border border-gray-200 dark:border-primary/50 overflow-hidden flex flex-col max-h-[calc(100vh-100px)] lg:max-h-[calc(100vh-120px)]">
      {/* Wallet Filter and Create Button */}
      <div className="p-3 lg:p-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <WalletDropdown
          walletFilter={walletFilter}
          showWalletDropdown={showWalletDropdown}
          onToggle={() => setShowWalletDropdown(!showWalletDropdown)}
          onSelectFilter={(filter) => {
            setWalletFilter(filter)
                    setShowWalletDropdown(false)
                  }}
          dropdownRef={dropdownRef}
        />
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
          className="h-[38px]"
        >
          Create
        </Button>
      </div>

      {/* Search Bar */}
      <AssetSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Assets List */}
      <div className="flex-1 overflow-y-auto wallet-assets-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Spinner size="lg" variant="primary" className="mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Loading wallets...</p>
          </div>
        ) : hasNoWallets || filteredAssets.length === 0 ? (
          <EmptyWalletState 
            searchQuery={searchQuery}
            onCreateWallet={() => setShowCreateModal(true)}
          />
        ) : (
          filteredAssets.map((asset, index) => (
            <AssetListItem
                key={asset.id}
              asset={asset}
              index={index}
              isSelected={selectedAsset === asset.id}
              onSelect={onSelectAsset}
              refreshingAsset={refreshingAsset}
              setRefreshingAsset={setRefreshingAsset}
              formatBalance={formatBalance}
            />
          ))
        )}
      </div>

      {/* Create Wallet Modal */}
      <CreateWalletModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}

export default AssetsSidebar
