import { useState, useEffect, useRef, useMemo } from 'react'
import { Filter, ArrowUpDown, ArrowLeft, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useCryptoBalances, useSingleCurrencyBalance } from '../../hooks/useWallet'
import { getCryptoIconConfig } from '../../utils/crypto-icons'
import AssetsSidebar from '../../components/pages/wallets/AssetsSidebar'
import WalletContent from '../../components/pages/wallets/WalletContent'
import TransactionDetails from '../../components/pages/wallets/TransactionDetails'
import CreateWalletPrompt from '../../components/pages/wallets/CreateWalletPrompt'
import CreateWalletModal from '../../components/pages/wallets/CreateWalletModal'
import DepositAddressModal from '../../components/pages/wallets/DepositAddressModal'
import TransactionFilterDropdown, { type TransactionFilters } from '../../components/pages/wallets/TransactionFilterModal'
import Button from '../../components/ui/Button'

const WalletsPage = () => {
  const navigate = useNavigate()
  const { data: cryptoBalances, isLoading: isLoadingCryptoBalances } = useCryptoBalances()
  const [selectedAsset, setSelectedAsset] = useState<string>('')
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [transactionFilters, setTransactionFilters] = useState<TransactionFilters>({})
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const hasAutoSelectedRef = useRef(false)

  // Fetch balance for selected wallet (for loading state)
  const { isLoading: isLoadingBalance } = useSingleCurrencyBalance(selectedAsset.toUpperCase())

  // Get selected wallet info for mobile card
  const selectedWalletInfo = useMemo(() => {
    if (!selectedAsset || !cryptoBalances?.balances) return null
    
    const wallet = cryptoBalances.balances.find(
      b => b.currency.toLowerCase() === selectedAsset.toLowerCase()
    )
    
    if (!wallet) return null
    
    const iconConfig = getCryptoIconConfig(wallet.currency)
    return {
      currency: wallet.currency,
      balance: wallet.balance || '0',
      name: iconConfig.name,
      icon: iconConfig.icon,
      iconColor: iconConfig.iconColor,
      iconBg: iconConfig.iconBg
    }
  }, [selectedAsset, cryptoBalances])

  // Check if user has no wallets at all
  const hasNoWallets = !isLoadingCryptoBalances && (!cryptoBalances?.balances || cryptoBalances.balances.length === 0)

  // Set the first wallet as the default selected asset (only on desktop, and only once on initial load)
  // On mobile, user should explicitly select from the list
  useEffect(() => {
    // Only auto-select on desktop (lg breakpoint and above) and only once
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 1024 // lg breakpoint
      
      if (isDesktop && !hasAutoSelectedRef.current && cryptoBalances?.balances && cryptoBalances.balances.length > 0 && !selectedAsset) {
        // Get the first wallet with balance > 0, or fallback to the first wallet if all are zero
        const firstWalletWithBalance = cryptoBalances.balances.find(b => parseFloat(b.balance) > 0)
        const walletToSelect = firstWalletWithBalance || cryptoBalances.balances[0]
        if (walletToSelect) {
          setSelectedAsset(walletToSelect.currency.toLowerCase())
          hasAutoSelectedRef.current = true
        }
      }
    }
  }, [cryptoBalances, selectedAsset])

  // Show single full-page spinner during initial crypto balances load
  if (isLoadingCryptoBalances) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="bg-white dark:bg-dark-surface rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading wallets...</p>
          </div>
        </div>
      </div>
    )
  }

  // Determine what to show on mobile vs desktop
  // On mobile: show sidebar when no wallet selected, show content when wallet selected (even if loading)
  const showSidebarOnMobile = !selectedAsset || hasNoWallets
  const showWalletDetailsOnMobile = selectedAsset && !hasNoWallets

  return (
    <div className="flex gap-3 h-[calc(100vh-100px)] overflow-hidden">
      {/* Left Sidebar - Assets List with Search */}
      {/* Show on desktop always, on mobile only when no wallet selected or loading */}
      <div className={`${showSidebarOnMobile ? 'block w-full' : 'hidden'} lg:block lg:w-auto relative`}>
        <AssetsSidebar selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} />
        
        {/* Floating Action Button - Mobile Only */}
        {showSidebarOnMobile && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="lg:hidden fixed bottom-24 right-4 z-50"
          >
            <Button
              variant="primary"
              icon={<Plus className="w-6 h-6" />}
              onClick={() => setShowCreateModal(true)}
              className="w-14 h-14 rounded-full p-0"
            >
              <span className="sr-only">Create Wallet</span>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      {/* Show on desktop always, on mobile only when wallet is selected and loaded */}
      <div className={`${showWalletDetailsOnMobile ? 'block w-full' : 'hidden'} lg:flex flex-1 flex-col gap-3 overflow-hidden`}>
        {/* Mobile Back Button */}
        {showWalletDetailsOnMobile && (
          <div className="lg:hidden mb-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelectedAsset('')
                setSelectedTransaction(null)
              }}
              className="justify-start"
            >
              Back to Wallets
            </Button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {hasNoWallets ? (
            /* Show Create Wallet Prompt if no wallets exist */
            <div className="flex-1 flex items-start justify-center pt-0">
              <CreateWalletPrompt 
                currency=""
                currencyName=""
              />
            </div>
          ) : isLoadingBalance ? (
            /* Show single loader while fetching wallet data */
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white dark:bg-dark-surface rounded-xl p-8 border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading wallet...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Wallet Card - Shows balance and selected wallet */}
              {selectedWalletInfo && (
                <div className="lg:hidden bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${selectedWalletInfo.iconBg} flex items-center justify-center shrink-0`}>
                      <selectedWalletInfo.icon className={`w-6 h-6 ${selectedWalletInfo.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {selectedWalletInfo.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {selectedWalletInfo.currency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {parseFloat(selectedWalletInfo.balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8
                        })}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedWalletInfo.currency}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Controls Bar - Filter bar for transactions */}
              <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-center justify-end flex-wrap gap-3">
                  {/* Right Side - Action Buttons and Filters */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        if (selectedAsset) {
                          setShowDepositModal(true)
                        }
                      }}
                      disabled={!selectedAsset}
                    >
                      Add Money
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        navigate({ 
                          to: '/withdraw',
                          search: selectedAsset ? { currency: selectedAsset } : undefined
                        })
                      }}
                    >
                      Withdraw
                    </Button>
                    <Button 
                      ref={filterButtonRef}
                      variant="secondary"
                      size="sm"
                      icon={<Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                      className="p-2"
                      aria-label="Filter transactions"
                    >
                      <span className="sr-only">Filter</span>
                    </Button>
                    <Button 
                      variant="secondary"
                      size="sm"
                      icon={<ArrowUpDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                      className="p-2"
                      aria-label="Sort transactions"
                    >
                      <span className="sr-only">Sort</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transaction History Table */}
              <WalletContent 
                selectedAsset={selectedAsset}
                selectedTransaction={selectedTransaction}
                onSelectTransaction={setSelectedTransaction}
                filters={transactionFilters}
              />
            </>
          )}
        </div>
      </div>

      {/* Right Column - Transaction Details */}
      <TransactionDetails 
        selectedTransaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* Create Wallet Modal */}
      <CreateWalletModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Deposit Address Modal */}
      <DepositAddressModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        currency={selectedAsset.toUpperCase()}
      />

      {/* Transaction Filter Dropdown */}
      <TransactionFilterDropdown
        isOpen={showFilterDropdown}
        onClose={() => setShowFilterDropdown(false)}
        onApplyFilters={(filters) => {
          setTransactionFilters(filters)
        }}
        initialFilters={transactionFilters}
        availableCurrencies={cryptoBalances?.balances?.map(b => b.currency as any) || ['BTC', 'ETH', 'USDT']}
        buttonRef={filterButtonRef}
        selectedAsset={selectedAsset}
      />
    </div>
  )
}

export default WalletsPage

