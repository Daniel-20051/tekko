import { useState, useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { useWalletBalances } from '../../hooks/useWallet'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDepositAddress, getDepositAccount } from '../../api/wallet.api'
import { walletKeys } from '../../hooks/useWallet'
import Spinner from '../../components/ui/Spinner'
import WalletList from '../../components/pages/deposits/WalletList'
import CurrencyDropdown from '../../components/pages/deposits/CurrencyDropdown'
import DepositBalanceHeader from '../../components/pages/deposits/DepositBalanceHeader'
import DepositEmptyState from '../../components/pages/deposits/DepositEmptyState'
import CryptoDepositDetails from '../../components/pages/deposits/CryptoDepositDetails'
import FiatDepositDetails from '../../components/pages/deposits/FiatDepositDetails'

type DepositMethod = 'crypto' | 'fiat'

const DepositPage = () => {
  const queryClient = useQueryClient()
  const search = useSearch({ from: '/_authenticated/deposit' })
  const { currency: initialCurrency } = search

  const [selectedCurrency, setSelectedCurrency] = useState<string>(initialCurrency?.toUpperCase() || '')
  const [depositMethod, setDepositMethod] = useState<DepositMethod | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [refreshingBalance, setRefreshingBalance] = useState(false)

  const { data: walletBalances } = useWalletBalances()
  const fiatCurrencies = ['NGN', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'ZAR', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'PLN', 'RUB', 'TRY', 'KRW', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 'CZK', 'HUF', 'ILS', 'CLP', 'ARS', 'COP', 'PEN', 'UAH', 'RON', 'BGN', 'HRK', 'ISK', 'NZD']
  
  const selectedWallet = walletBalances?.wallets?.find(
    w => w.currency.toUpperCase() === selectedCurrency.toUpperCase()
  )
  const isFiatCurrency = selectedCurrency && fiatCurrencies.includes(selectedCurrency.toUpperCase())

  const depositAccountMutation = useMutation({
    mutationFn: (data: { currency: string }) => getDepositAccount(data),
    onSuccess: () => setError(null),
    onError: (error: any) => setError(error.message || 'Failed to get deposit account'),
  })

  const { data: depositAddressData, isLoading: isLoadingCryptoAddress } = useQuery({
    queryKey: ['depositAddress', selectedCurrency],
    queryFn: () => getDepositAddress(selectedCurrency),
    enabled: depositMethod === 'crypto' && !!selectedCurrency && !isFiatCurrency,
    retry: false,
  })

  useEffect(() => {
    if (initialCurrency && !selectedCurrency) {
      setSelectedCurrency(initialCurrency.toUpperCase())
      if (initialCurrency.toUpperCase() === 'NGN') {
        setDepositMethod('fiat')
        depositAccountMutation.mutate({ currency: 'NGN' })
      } else {
        setDepositMethod('crypto')
      }
    } else if (!selectedCurrency && walletBalances?.wallets && walletBalances.wallets.length > 0) {
      const firstWallet = walletBalances.wallets[0]
      setSelectedCurrency(firstWallet.currency.toUpperCase())
      if (fiatCurrencies.includes(firstWallet.currency.toUpperCase())) {
        if (firstWallet.currency.toUpperCase() === 'NGN') {
          setDepositMethod('fiat')
          depositAccountMutation.mutate({ currency: 'NGN' })
        }
      } else {
        setDepositMethod('crypto')
      }
    }
  }, [initialCurrency, selectedCurrency, walletBalances, depositAccountMutation])

  const handleSelectCurrency = (currency: string) => {
    setSelectedCurrency(currency)
    setError(null)
    setDepositMethod(null)
    
    if (currency.toUpperCase() === 'NGN') {
      setDepositMethod('fiat')
      depositAccountMutation.mutate({ currency: 'NGN' })
    } else if (fiatCurrencies.includes(currency.toUpperCase())) {
      setDepositMethod(null)
    } else {
      setDepositMethod('crypto')
    }
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

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  // Sort wallets to always show NGN at the top
  const availableAssets = walletBalances?.wallets 
    ? [...walletBalances.wallets].sort((a, b) => {
        const aIsNGN = a.currency.toUpperCase() === 'NGN'
        const bIsNGN = b.currency.toUpperCase() === 'NGN'
        if (aIsNGN && !bIsNGN) return -1
        if (!aIsNGN && bIsNGN) return 1
        return 0
      })
    : []

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-start justify-center pt-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Money</h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            Deposit funds into your wallet and do more on Tekko.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Desktop: Wallet List, Mobile: Hidden */}
          <div className="hidden lg:block">
            <WalletList
              wallets={availableAssets}
              selectedCurrency={selectedCurrency}
              onSelectCurrency={handleSelectCurrency}
            />
          </div>

          {/* Right Panel - Deposit Details */}
          <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 overflow-hidden flex flex-col max-h-[600px]">
            {/* Mobile: Currency Dropdown */}
            <div className="lg:hidden p-3 border-b border-gray-200 dark:border-gray-800">
              <CurrencyDropdown
                wallets={availableAssets}
                selectedCurrency={selectedCurrency}
                onSelectCurrency={handleSelectCurrency}
              />
            </div>

            {!selectedCurrency ? (
              <DepositEmptyState />
            ) : (
              <>
                <DepositBalanceHeader
                  balance={selectedWallet?.balance || '0'}
                  currency={selectedCurrency}
                  onRefresh={handleRefreshBalance}
                  isRefreshing={refreshingBalance}
                />

                <div className="flex-1 overflow-y-auto p-4">
                  {error && (
                    <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                      </div>
                    </div>
                  )}

                  {depositMethod === 'crypto' && (
                    <CryptoDepositDetails
                      data={depositAddressData}
                      currency={selectedCurrency}
                      isLoading={isLoadingCryptoAddress}
                      error={error}
                      copied={copied}
                      onCopy={handleCopy}
                    />
                  )}

                  {depositMethod === 'fiat' && depositAccountMutation.data && (
                    <FiatDepositDetails
                      data={depositAccountMutation.data}
                      copied={copied}
                      onCopy={handleCopy}
                    />
                  )}

                  {depositMethod === 'fiat' && depositAccountMutation.isPending && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Spinner size="lg" variant="primary" className="mb-3" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Loading deposit account...</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepositPage
