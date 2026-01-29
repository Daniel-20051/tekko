import { useState, useEffect, useRef } from 'react'
import { useSearch } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { useWalletBalances } from '../../hooks/useWallet'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDepositAddress, getDepositAccount } from '../../api/wallet.api'
import { walletKeys } from '../../hooks/useWallet'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
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
  const hasInitialized = useRef(false)

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
    onError: (error: any) => {
      // Check if it's the ACCOUNT_NOT_AVAILABLE error
      if (error.errorCode === 'ACCOUNT_NOT_AVAILABLE' || error.message?.includes('ACCOUNT_NOT_AVAILABLE')) {
        setError('ACCOUNT_NOT_AVAILABLE')
      } else {
        setError(error.message || 'Failed to get deposit account')
      }
    },
  })

  const fetchDepositAccount = depositAccountMutation.mutate

  const { data: depositAddressData, isLoading: isLoadingCryptoAddress } = useQuery({
    queryKey: ['depositAddress', selectedCurrency],
    queryFn: () => getDepositAddress(selectedCurrency),
    enabled: depositMethod === 'crypto' && !!selectedCurrency && !isFiatCurrency,
    retry: false,
  })

  // Auto-select currency and fetch deposit account on page load
  useEffect(() => {
    if (hasInitialized.current) return
    if (!walletBalances?.wallets || walletBalances.wallets.length === 0) return

    // Priority: 1. initialCurrency from URL, 2. NGN if available, 3. First wallet
    let currencyToSelect = ''
    
    if (initialCurrency) {
      currencyToSelect = initialCurrency.toUpperCase()
    } else {
      // Check if NGN is available
      const ngnWallet = walletBalances.wallets.find(w => w.currency.toUpperCase() === 'NGN')
      if (ngnWallet) {
        currencyToSelect = 'NGN'
      } else {
        // Use first wallet
        currencyToSelect = walletBalances.wallets[0].currency.toUpperCase()
      }
    }

    setSelectedCurrency(currencyToSelect)
    hasInitialized.current = true

    // Determine deposit method and fetch if needed
    if (currencyToSelect === 'NGN') {
      setDepositMethod('fiat')
      // Immediately fetch deposit account for NGN
      fetchDepositAccount({ currency: 'NGN' })
    } else if (fiatCurrencies.includes(currencyToSelect)) {
      setDepositMethod(null)
    } else {
      setDepositMethod('crypto')
    }
  }, [walletBalances, initialCurrency, fetchDepositAccount])

  const handleSelectCurrency = (currency: string) => {
    const upperCurrency = currency.toUpperCase()
    setSelectedCurrency(upperCurrency)
    setError(null)
    setDepositMethod(null)
    
    if (upperCurrency === 'NGN') {
      setDepositMethod('fiat')
      // Immediately fetch deposit account when NGN is selected
      fetchDepositAccount({ currency: 'NGN' })
    } else if (fiatCurrencies.includes(upperCurrency)) {
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

                  {depositMethod === 'fiat' && depositAccountMutation.isPending && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Spinner size="lg" variant="primary" className="mb-3" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Loading deposit account...</p>
                    </div>
                  )}

                  {depositMethod === 'fiat' && error && !depositAccountMutation.isPending && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Unable to Load Deposit Account
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
                        {error === 'ACCOUNT_NOT_AVAILABLE' 
                          ? 'Account number generating, try again in 10 minutes'
                          : error}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setError(null)
                          if (selectedCurrency === 'NGN') {
                            depositAccountMutation.mutate({ currency: 'NGN' })
                          }
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  )}

                  {depositMethod === 'fiat' && depositAccountMutation.data && !error && (
                    <FiatDepositDetails
                      data={depositAccountMutation.data}
                      copied={copied}
                      onCopy={handleCopy}
                    />
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
