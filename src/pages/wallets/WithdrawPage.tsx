import { useState, useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useWalletBalances, useSingleCurrencyBalance, walletKeys } from '../../hooks/useWallet'
import { useQueryClient } from '@tanstack/react-query'
import WalletList from '../../components/pages/wallets/withdrawal/WalletList'
import CurrencyDropdown from '../../components/pages/wallets/withdrawal/CurrencyDropdown'
import WithdrawBalanceHeader from '../../components/pages/wallets/withdrawal/WithdrawBalanceHeader'
import WithdrawEmptyState from '../../components/pages/wallets/withdrawal/WithdrawEmptyState'
import CryptoWithdrawDetails from '../../components/pages/wallets/withdrawal/CryptoWithdrawDetails'
import FiatWithdrawDetails from '../../components/pages/wallets/withdrawal/FiatWithdrawDetails'

const WithdrawPage = () => {
  const queryClient = useQueryClient()
  const search = useSearch({ from: '/_authenticated/withdraw' })
  const { currency: initialCurrency } = search

  const [selectedCurrency, setSelectedCurrency] = useState<string>(initialCurrency?.toUpperCase() || '')
  const [refreshingBalance, setRefreshingBalance] = useState(false)

  const { data: walletBalances } = useWalletBalances()
  const fiatCurrencies = ['NGN', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'ZAR', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'PLN', 'RUB', 'TRY', 'KRW', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 'CZK', 'HUF', 'ILS', 'CLP', 'ARS', 'COP', 'PEN', 'UAH', 'RON', 'BGN', 'HRK', 'ISK', 'NZD']
  
  const selectedWallet = walletBalances?.wallets?.find(
    w => w.currency.toUpperCase() === selectedCurrency.toUpperCase()
  )
  const isFiatCurrency = selectedCurrency && fiatCurrencies.includes(selectedCurrency.toUpperCase())
  
  // For crypto currencies, also try to get from single balance API
  const { data: balanceData } = useSingleCurrencyBalance(
    selectedCurrency,
    { enabled: !isFiatCurrency && !!selectedCurrency }
  )
  
  // Use wallet balance directly (works for both fiat and crypto)
  const availableBalance = !isFiatCurrency && balanceData?.wallet?.availableBalance 
    ? balanceData.wallet.availableBalance 
    : selectedWallet?.availableBalance || '0'

  useEffect(() => {
    if (initialCurrency && !selectedCurrency) {
      setSelectedCurrency(initialCurrency.toUpperCase())
    } else if (!selectedCurrency && walletBalances?.wallets && walletBalances.wallets.length > 0) {
      const firstWallet = walletBalances.wallets[0]
      setSelectedCurrency(firstWallet.currency.toUpperCase())
    }
  }, [initialCurrency, selectedCurrency, walletBalances])

  const handleSelectCurrency = (currency: string) => {
    setSelectedCurrency(currency)
  }

  const handleRefreshBalance = async () => {
    if (!selectedCurrency) return
    setRefreshingBalance(true)
    try {
      await queryClient.invalidateQueries({ queryKey: walletKeys.singleBalance(selectedCurrency) })
      await queryClient.refetchQueries({ queryKey: walletKeys.singleBalance(selectedCurrency) })
      await queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      await queryClient.refetchQueries({ queryKey: walletKeys.balances() })
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    } finally {
      setTimeout(() => setRefreshingBalance(false), 500)
    }
  }

  const availableAssets = walletBalances?.wallets || []

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-start justify-center pt-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Withdraw</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            Transfer funds from your wallet to an external address or bank account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Sidebar - Wallet List (Desktop) */}
          <div className="hidden lg:block">
            <WalletList
              wallets={availableAssets}
              selectedCurrency={selectedCurrency}
              onSelectCurrency={handleSelectCurrency}
            />
          </div>

          {/* Right Panel - Withdrawal Details */}
          <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 overflow-hidden flex flex-col max-h-[600px]">
            {selectedCurrency ? (
              <>
                {/* Mobile: Currency Dropdown */}
                <div className="lg:hidden p-3 border-b border-gray-200 dark:border-gray-800">
                  <CurrencyDropdown
                    wallets={availableAssets}
                    selectedCurrency={selectedCurrency}
                    onSelectCurrency={handleSelectCurrency}
                  />
                </div>

                {/* Balance Header */}
                <WithdrawBalanceHeader
                  balance={availableBalance}
                  currency={selectedCurrency}
                  onRefresh={handleRefreshBalance}
                  isRefreshing={refreshingBalance}
                />

                {/* Withdrawal Details */}
                <div className="flex-1 overflow-y-auto">
                  {isFiatCurrency ? (
                    <FiatWithdrawDetails
                      currency={selectedCurrency}
                      availableBalance={availableBalance}
                    />
                  ) : (
                    <CryptoWithdrawDetails
                      currency={selectedCurrency}
                      availableBalance={availableBalance}
                      onBack={() => setSelectedCurrency('')}
                    />
                  )}
                </div>
              </>
            ) : (
              <WithdrawEmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawPage
