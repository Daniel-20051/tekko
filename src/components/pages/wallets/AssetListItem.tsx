import { motion } from 'framer-motion'
import { RefreshCw, ArrowUpDown, Eye, EyeOff, Star, ChevronRight } from 'lucide-react'
import { useBalanceStore } from '../../../store/balance.store'
import { useQueryClient } from '@tanstack/react-query'
import { walletKeys } from '../../../hooks/useWallet'
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

interface AssetListItemProps {
  asset: Asset
  index: number
  isSelected: boolean
  onSelect: (assetId: string) => void
  refreshingAsset: string | null
  setRefreshingAsset: (asset: string | null) => void
  formatBalance: (balance: string | undefined | null, code: string, isHidden: boolean) => string
}

const AssetListItem = ({
  asset,
  index,
  isSelected,
  onSelect,
  refreshingAsset,
  setRefreshingAsset,
  formatBalance
}: AssetListItemProps) => {
  const { toggleBalanceVisibility, isBalanceHidden: checkBalanceHidden } = useBalanceStore()
  const queryClient = useQueryClient()
  const Icon = asset.icon
  const isBalanceHidden = checkBalanceHidden(asset.id)
  const hasActivity = parseFloat(asset.balance) > 0

  const handleToggleBalanceVisibility = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBalanceVisibility(assetId)
  }

  const handleRefreshBalance = async (currencyCode: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRefreshingAsset(currencyCode)
    
    try {
      await queryClient.invalidateQueries({ queryKey: walletKeys.singleBalance(currencyCode) })
      await queryClient.refetchQueries({ queryKey: walletKeys.singleBalance(currencyCode) })
      await queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      await queryClient.refetchQueries({ queryKey: walletKeys.balances() })
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    } finally {
      setTimeout(() => {
        setRefreshingAsset(null)
      }, 500)
    }
  }

  const available = parseFloat(asset.availableBalance || '0') || 0
  const locked = parseFloat(asset.lockedBalance || '0') || 0
  const pending = parseFloat(asset.pendingBalance || '0') || 0

  return (
    <motion.div
      key={asset.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(asset.id)}
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
        <div className="mt-0.5 space-y-0.5">
          <p className="text-xs font-medium text-gray-900 dark:text-white">
            {formatBalance(asset.balance, asset.code, isBalanceHidden)}
          </p>
          {!isBalanceHidden && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5">
              {available > 0 || locked > 0 || pending > 0 ? (
                <>
                  {available > 0 && (
                    <p className="flex items-center gap-1">
                      Available: {formatBalance(asset.availableBalance, asset.code, false).replace(` ${asset.code}`, '')}
                    </p>
                  )}
                  {locked > 0 && (
                    <p className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                      Locked: {formatBalance(asset.lockedBalance, asset.code, false).replace(` ${asset.code}`, '')}
                    </p>
                  )}
                  {pending > 0 && (
                    <p className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      Pending: {formatBalance(asset.pendingBalance, asset.code, false).replace(` ${asset.code}`, '')}
                    </p>
                  )}
                </>
              ) : (
                <p className="flex items-center gap-1">
                  Available: {formatBalance(asset.availableBalance, asset.code, false).replace(` ${asset.code}`, '')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-0 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          icon={isBalanceHidden ? <EyeOff className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" /> : <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
          onClick={(e) => handleToggleBalanceVisibility(asset.id, e)}
          title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
          className="p-1! px-1.5! min-w-0 "
          aria-label={isBalanceHidden ? 'Show balance' : 'Hide balance'}
        >
          <span className="sr-only">{isBalanceHidden ? 'Show balance' : 'Hide balance'}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={
            <RefreshCw 
              className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ${
                refreshingAsset === asset.code ? 'animate-spin' : ''
              }`} 
            />
          }
          onClick={(e) => handleRefreshBalance(asset.code, e)}
          disabled={refreshingAsset === asset.code}
          title="Refresh"
          className="p-1! px-1.5! min-w-0 "
          aria-label="Refresh balance"
        >
          <span className="sr-only">Refresh</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowUpDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
          title="Transfer"
          className="p-1! px-1.5! min-w-0"
          aria-label="Transfer"
        >
          <span className="sr-only">Transfer</span>
        </Button>
        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-0.5" />
      </div>
    </motion.div>
  )
}

export default AssetListItem
