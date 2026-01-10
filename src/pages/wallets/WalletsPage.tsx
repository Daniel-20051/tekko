import { useState, useEffect } from 'react'
import { useSupportedCurrencies, useSingleCurrencyBalance } from '../../hooks/useWallet'
import AssetsSidebar from '../../components/pages/wallets/AssetsSidebar'
import PortfolioCard from '../../components/pages/wallets/PortfolioCard'
import WalletContent from '../../components/pages/wallets/WalletContent'
import TransactionDetails from '../../components/pages/wallets/TransactionDetails'
import CreateWalletPrompt from '../../components/pages/wallets/CreateWalletPrompt'

const WalletsPage = () => {
  const { data: supportedCurrencies } = useSupportedCurrencies()
  const [selectedAsset, setSelectedAsset] = useState<string>('')
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

  // Fetch balance to check if wallet exists
  const { data: balanceData, isLoading: isLoadingBalance, error: balanceError } = useSingleCurrencyBalance(selectedAsset.toUpperCase())

  // Check if wallet doesn't exist (NOT_FOUND error OR id is null)
  const walletNotFound = (balanceError && 
    (balanceError.message?.includes('not found') || 
     balanceError.message?.includes('NOT_FOUND'))) ||
    (balanceData?.wallet?.id === null)

  // Get currency name for display
  const selectedCurrency = supportedCurrencies?.currencies.find(
    c => c.code.toLowerCase() === selectedAsset.toLowerCase()
  )

  // Set the first supported currency as the default selected asset
  useEffect(() => {
    if (supportedCurrencies?.currencies && supportedCurrencies.currencies.length > 0 && !selectedAsset) {
      setSelectedAsset(supportedCurrencies.currencies[0].code.toLowerCase())
    }
  }, [supportedCurrencies, selectedAsset])

  return (
    <div className="flex gap-3 h-[calc(100vh-100px)] overflow-hidden">
      {/* Left Sidebar - Assets List with Search */}
      <AssetsSidebar selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} />

      {/* Center Column - Single Loader OR Content */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {isLoadingBalance ? (
          /* Show single loader while fetching wallet data */
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white dark:bg-dark-surface rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
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
              currencyName={selectedCurrency?.name || selectedAsset.toUpperCase()}
            />
          </div>
        ) : (
          <>
            {/* Portfolio Card */}
            <PortfolioCard selectedAsset={selectedAsset} balanceData={balanceData} />

            {/* Transaction History */}
            <WalletContent 
              selectedAsset={selectedAsset}
              selectedTransaction={selectedTransaction}
              onSelectTransaction={setSelectedTransaction}
            />
          </>
        )}
      </div>

      {/* Right Column - Buy Details */}
      <TransactionDetails 
        selectedTransaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  )
}

export default WalletsPage

