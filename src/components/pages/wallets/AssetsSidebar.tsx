import { Plus } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useCryptoBalances } from '../../../hooks/useWallet'
import { getCryptoIconConfig } from '../../../utils/crypto-icons'
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

  // Build assets list from crypto balances - show all wallets including zero balances
  const assets: Asset[] = useMemo(() => {
    if (!cryptoBalances?.balances) return []

    return cryptoBalances.balances
      .map((balance) => {
        const iconConfig = getCryptoIconConfig(balance.currency)
        
        // Get currency name from icon config or use currency code
        const currencyName = iconConfig.name || balance.currency

        return {
          id: balance.currency.toLowerCase(),
          name: currencyName,
          code: balance.currency,
          balance: balance.balance || '0',
          availableBalance: balance.availableBalance || '0',
          lockedBalance: balance.lockedBalance || '0',
          pendingBalance: balance.pendingBalance || '0',
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


  const formatBalance = (balance: string | undefined | null, code: string, isHidden: boolean) => {
    if (isHidden) return '••••'
    
    // Handle undefined, null, or empty balance
    if (!balance || balance === '' || balance === 'undefined' || balance === 'null') {
      return `0.00000000 ${code}`
    }
    
    // Ensure balance is a string
    const balanceStr = String(balance)
    const numBalance = parseFloat(balanceStr)
    
    // For crypto, show up to 8 decimal places, preserving trailing zeros
    if (isNaN(numBalance) || numBalance === 0) {
      return `0.00000000 ${code}`
    }
    
    // Preserve the original decimal places from the string, up to 8
    const hasDecimal = balanceStr.includes('.')
    const finalBalanceStr = hasDecimal ? balanceStr : `${balanceStr}.00000000`
    const [integerPart, decimalPart = ''] = finalBalanceStr.split('.')
    const paddedDecimal = decimalPart.padEnd(8, '0').substring(0, 8)
    return `${parseFloat(integerPart).toLocaleString('en-US')}.${paddedDecimal} ${code}`
  }

  const hasNoWallets = !isLoadingBalances && (!cryptoBalances?.balances || cryptoBalances.balances.length === 0)

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
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
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
