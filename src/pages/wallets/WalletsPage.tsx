import { useState, useEffect } from 'react'
import { Filter, ArrowUpDown, ArrowLeft, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCryptoBalances, useSingleCurrencyBalance } from '../../hooks/useWallet'
import AssetsSidebar from '../../components/pages/wallets/AssetsSidebar'
import PortfolioCard from '../../components/pages/wallets/PortfolioCard'
import WalletContent from '../../components/pages/wallets/WalletContent'
import TransactionDetails from '../../components/pages/wallets/TransactionDetails'
import CreateWalletPrompt from '../../components/pages/wallets/CreateWalletPrompt'
import { getCryptoIconConfig } from '../../utils/crypto-icons'

const WalletsPage = () => {
  const { data: cryptoBalances, isLoading: isLoadingCryptoBalances } = useCryptoBalances()
  const [selectedAsset, setSelectedAsset] = useState<string>('')
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

  // Fetch balance to check if wallet exists
  const { data: balanceData, isLoading: isLoadingBalance, error: balanceError } = useSingleCurrencyBalance(selectedAsset.toUpperCase())

  // Check if wallet doesn't exist (NOT_FOUND error OR id is null)
  const walletNotFound = (balanceError && 
    (balanceError.message?.includes('not found') || 
     balanceError.message?.includes('NOT_FOUND'))) ||
    (balanceData?.wallet?.id === null)

  // Get currency name for display from crypto balances or icon config
  
  const selectedCurrencyIcon = selectedAsset ? getCryptoIconConfig(selectedAsset.toUpperCase()) : null
  const selectedCurrencyName = selectedCurrencyIcon?.name || selectedAsset.toUpperCase()

  // Check if user has no wallets at all
  const hasNoWallets = !isLoadingCryptoBalances && (!cryptoBalances?.balances || cryptoBalances.balances.length === 0)

  // Set the first wallet with balance as the default selected asset
  useEffect(() => {
    if (cryptoBalances?.balances && cryptoBalances.balances.length > 0 && !selectedAsset) {
      // Get the first wallet with balance > 0
      const firstWallet = cryptoBalances.balances.find(b => parseFloat(b.balance) > 0)
      if (firstWallet) {
        setSelectedAsset(firstWallet.currency.toLowerCase())
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
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden fixed bottom-24 right-4 z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
            onClick={() => {
              // Handle create wallet action
              console.log('Create wallet')
            }}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Main Content Area */}
      {/* Show on desktop always, on mobile only when wallet is selected and loaded */}
      <div className={`${showWalletDetailsOnMobile ? 'block w-full' : 'hidden'} lg:flex flex-1 flex-col gap-3 overflow-hidden`}>
        {/* Mobile Back Button */}
        {showWalletDetailsOnMobile && (
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setSelectedAsset('')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Wallets</span>
            </button>
          </div>
        )}

        {/* Top Controls Bar - Only show when wallets exist */}
        {!hasNoWallets && (
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-end flex-wrap gap-3">
              {/* Right Side - Action Buttons and Filters */}
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  Add Money
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                  Withdraw
                </button>
                <button className="p-2 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <ArrowUpDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
          ) : walletNotFound ? (
            /* Show Create Wallet Prompt if wallet doesn't exist */
            <div className="flex-1 flex items-center justify-center">
              <CreateWalletPrompt 
                currency={selectedAsset}
                currencyName={selectedCurrencyName}
              />
            </div>
          ) : (
            <>
              {/* Portfolio Card - Compact Version */}
              <PortfolioCard selectedAsset={selectedAsset} balanceData={balanceData} />

              {/* Transaction History Table */}
              <WalletContent 
                selectedAsset={selectedAsset}
                selectedTransaction={selectedTransaction}
                onSelectTransaction={setSelectedTransaction}
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
    </div>
  )
}

export default WalletsPage

