import { useState, useEffect, useMemo, useRef } from 'react'
import { Settings, RefreshCw, AlertCircle, Clock } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWalletBalances } from '../../../hooks/useWallet'
import { getSwapPairs, calculateSwap, executeSwap } from '../../../api/swap.api'
import { walletKeys } from '../../../hooks/useWallet'
import SwapAmountInput from './SwapAmountInput'
import SwapButton from './SwapButton'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import PinInput from '../../ui/PinInput'
import { AlertTriangle } from 'lucide-react'
import Spinner from '../../ui/Spinner'
import { formatNumber } from '../../../utils/time.utils'
import type { Wallet } from '../../../types/wallet'

const QUOTE_VALIDITY_SECONDS = 15
const PRICE_UPDATE_INTERVAL_MS = 3000

const SwapPage = () => {
  const queryClient = useQueryClient()
  const { data: walletBalances } = useWalletBalances()

  const [fromCurrency, setFromCurrency] = useState<string>('')
  const [toCurrency, setToCurrency] = useState<string>('')
  const [fromAmount, setFromAmount] = useState<string>('')
  const [debouncedFromAmount, setDebouncedFromAmount] = useState<string>('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [quoteExpiresAt, setQuoteExpiresAt] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const quoteTimestampRef = useRef<number | null>(null)

  // Preload swap pairs before showing UI
  const { data: swapPairsData, isLoading: isLoadingPairs } = useQuery({
    queryKey: ['swapPairs'],
    queryFn: getSwapPairs,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

  const supportedPairs = swapPairsData?.pairs || []
  
  // Filter available wallets based on supported pairs
  const availableWallets = useMemo(() => {
    if (!walletBalances?.wallets || supportedPairs.length === 0) {
      return walletBalances?.wallets || []
    }

    // Get all unique currencies from supported pairs
    const supportedCurrencies = new Set<string>()
    supportedPairs.forEach(pair => {
      const [from, to] = pair.split('-')
      supportedCurrencies.add(from)
      supportedCurrencies.add(to)
    })

    return walletBalances.wallets.filter(wallet => 
      supportedCurrencies.has(wallet.currency.toUpperCase())
    )
  }, [walletBalances?.wallets, supportedPairs])

  // Initialize currencies
  useEffect(() => {
    if (availableWallets.length > 0 && !fromCurrency && !toCurrency) {
      setFromCurrency(availableWallets[0].currency)
      if (availableWallets.length > 1) {
        setToCurrency(availableWallets[1].currency)
      }
    }
  }, [availableWallets, fromCurrency, toCurrency])

  // Get balances for selected currencies
  const fromWallet = useMemo(
    () => availableWallets.find((w) => w.currency.toUpperCase() === fromCurrency.toUpperCase()),
    [availableWallets, fromCurrency]
  )

  const toWallet = useMemo(
    () => availableWallets.find((w) => w.currency.toUpperCase() === toCurrency.toUpperCase()),
    [availableWallets, toCurrency]
  )

  const fromBalance = fromWallet?.availableBalance || '0'
  const toBalance = toWallet?.availableBalance || '0'

  // Check if pair is supported
  const isPairSupported = useMemo(() => {
    if (!fromCurrency || !toCurrency || supportedPairs.length === 0) return false
    const pair = `${fromCurrency.toUpperCase()}-${toCurrency.toUpperCase()}`
    return supportedPairs.includes(pair)
  }, [fromCurrency, toCurrency, supportedPairs])

  // Debounce fromAmount to avoid calling API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFromAmount(fromAmount)
    }, 1000) // Wait 1000ms after user stops typing

    return () => clearTimeout(timer)
  }, [fromAmount])

  // Get swap pair string
  const swapPair = useMemo(() => {
    if (!fromCurrency || !toCurrency) return ''
    return `${fromCurrency.toUpperCase()}-${toCurrency.toUpperCase()}`
  }, [fromCurrency, toCurrency])

  // Determine swap type: "sell" means selling fromCurrency to get toCurrency
  const swapType: 'buy' | 'sell' = useMemo(() => {
    // When user is "selling" fromCurrency, they're selling it to get toCurrency
    // This is a "sell" type swap
    return 'sell'
  }, [])

  // Get swap calculation (using debounced amount)
  const {
    data: quoteData,
    isLoading: isLoadingQuote,
    refetch: refetchQuote
  } = useQuery({
    queryKey: ['swapCalculate', swapPair, swapType, debouncedFromAmount],
    queryFn: () => {
      const timestamp = Date.now()
      quoteTimestampRef.current = timestamp
      setQuoteExpiresAt(timestamp + QUOTE_VALIDITY_SECONDS * 1000)
      return calculateSwap({
        pair: swapPair,
        type: swapType,
        amount: debouncedFromAmount
      })
    },
    enabled: !!swapPair && !!debouncedFromAmount && parseFloat(debouncedFromAmount) > 0 && isPairSupported,
    retry: false,
    refetchOnWindowFocus: false,
    // Don't auto-refetch - we'll handle it manually when quote expires
  })

  // Update time remaining countdown and refetch when quote expires
  useEffect(() => {
    if (!quoteExpiresAt) {
      setTimeRemaining(0)
      return
    }

    let previousRemaining = Math.ceil((quoteExpiresAt - Date.now()) / 1000)

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((quoteExpiresAt - Date.now()) / 1000))
      setTimeRemaining(remaining)
      
      // Refetch when quote expires (when remaining goes from > 0 to 0)
      if (previousRemaining > 0 && remaining === 0 && quoteData && swapPair && debouncedFromAmount) {
        refetchQuote()
      }
      
      previousRemaining = remaining
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [quoteExpiresAt, quoteData, swapPair, debouncedFromAmount, refetchQuote])

  const toAmount = quoteData?.outputAmount || '0'
  const exchangeRate = quoteData?.price || '0'
  const fee = quoteData?.tradingFee || '0'
  const feePercent = quoteData?.tradingFeePercent || 0
  const baseAmount = quoteData?.baseAmount || '0'
  const spread = quoteData?.spread || '0'

  // Reset quote expiration when quote data changes or query is disabled
  useEffect(() => {
    const isQueryEnabled = !!swapPair && !!debouncedFromAmount && parseFloat(debouncedFromAmount) > 0 && isPairSupported
    
    if (!isQueryEnabled) {
      setQuoteExpiresAt(null)
      setTimeRemaining(0)
      quoteTimestampRef.current = null
    } else if (quoteData && quoteTimestampRef.current) {
      setQuoteExpiresAt(quoteTimestampRef.current + QUOTE_VALIDITY_SECONDS * 1000)
    }
  }, [quoteData, swapPair, debouncedFromAmount, isPairSupported])

  // Execute swap mutation (always fetch fresh quote before executing)
  const swapMutation = useMutation({
    mutationFn: async (pin: string) => {
      // Always get a fresh quote before executing
      await calculateSwap({
        pair: swapPair,
        type: swapType,
        amount: fromAmount
      })
      
      // Execute swap with fresh quote
      return executeSwap({
        pair: swapPair,
        type: swapType,
        amount: fromAmount,
        pin
      })
    },
    onSuccess: () => {
      setShowPinModal(false)
      setPin(['', '', '', ''])
      setFromAmount('')
      setError(null)
      // Invalidate and refetch balances
      queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      queryClient.refetchQueries({ queryKey: walletKeys.balances() })
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to execute swap')
    }
  })

  const handleSwap = () => {
    // Strip commas from amounts before parsing (defensive check)
    const cleanFromAmount = fromAmount ? fromAmount.replace(/,/g, '') : ''
    const cleanFromBalance = fromBalance ? fromBalance.replace(/,/g, '') : ''
    const fromAmountNum = parseFloat(cleanFromAmount)
    const fromBalanceNum = parseFloat(cleanFromBalance)
    
    if (!fromAmount || fromAmountNum <= 0) {
      setError('Please enter an amount')
      return
    }

    if (fromAmountNum > fromBalanceNum) {
      setError('Insufficient balance')
      return
    }

    if (fromCurrency === toCurrency) {
      setError('Cannot swap the same currency')
      return
    }

    if (!isPairSupported) {
      setError('This trading pair is not supported')
      return
    }

    if (timeRemaining === 0 && quoteData) {
      setError('Quote has expired. Please wait for a new quote.')
      return
    }

    setError(null)
    setShowPinModal(true)
  }

  const handlePinSubmit = () => {
    const pinString = pin.join('')
    if (pinString.length === 4) {
      swapMutation.mutate(pinString)
    }
  }

  const handlePinChange = (newPin: string[]) => {
    setPin(newPin)
  }

  const handlePinComplete = (pinString: string) => {
    if (pinString.length === 4) {
      swapMutation.mutate(pinString)
    }
  }

  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency
    const tempAmount = fromAmount
    setFromCurrency(toCurrency)
    setToCurrency(tempCurrency)
    setFromAmount('')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await queryClient.invalidateQueries({ queryKey: walletKeys.balances() })
      await queryClient.refetchQueries({ queryKey: walletKeys.balances() })
      if (swapPair && debouncedFromAmount) {
        await refetchQuote()
      }
    } catch (error) {
      console.error('Failed to refresh:', error)
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const canSwap = useMemo(() => {
    // Strip commas from amounts before parsing (defensive check)
    const cleanFromAmount = fromAmount ? fromAmount.replace(/,/g, '') : ''
    const cleanFromBalance = fromBalance ? fromBalance.replace(/,/g, '') : ''
    const fromAmountNum = parseFloat(cleanFromAmount)
    const fromBalanceNum = parseFloat(cleanFromBalance)
    
    return (
      !!fromCurrency &&
      !!toCurrency &&
      !!fromAmount &&
      !isNaN(fromAmountNum) &&
      fromAmountNum > 0 &&
      fromAmountNum <= fromBalanceNum &&
      fromCurrency !== toCurrency &&
      isPairSupported &&
      !isLoadingQuote &&
      !!quoteData &&
      timeRemaining > 0
    )
  }, [fromCurrency, toCurrency, fromAmount, fromBalance, isPairSupported, isLoadingQuote, quoteData, timeRemaining])

  // Get button text based on state
  const getButtonText = () => {
    if (swapMutation.isPending) return 'Processing...'
    if (!canSwap) {
      // Strip commas for validation
      const cleanFromAmount = fromAmount ? fromAmount.replace(/,/g, '') : ''
      const cleanFromBalance = fromBalance ? fromBalance.replace(/,/g, '') : ''
      const fromAmountNum = parseFloat(cleanFromAmount)
      const fromBalanceNum = parseFloat(cleanFromBalance)
      
      if (!fromAmount || fromAmountNum <= 0) {
        return 'Enter Amount'
      }
      if (fromAmountNum > fromBalanceNum) {
        return 'Insufficient Balance'
      }
      if (!fromCurrency || !toCurrency) {
        return 'Select Currencies'
      }
      if (fromCurrency === toCurrency) {
        return 'Select Different Currencies'
      }
      if (!isPairSupported) {
        return 'Pair Not Supported'
      }
      if (isLoadingQuote) {
        return 'Loading Quote...'
      }
      if (!quoteData) {
        return 'Getting Quote...'
      }
      if (timeRemaining === 0) {
        return 'Quote Expired'
      }
      return 'Enter Amount'
    }
    return 'Swap'
  }

  // Show loading state while pairs are loading
  if (isLoadingPairs) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading swap pairs...</p>
        </div>
      </div>
    )
  }

  if (availableWallets.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Wallets Available</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Please create a wallet first to start swapping</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-start justify-center pt-4 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Swap</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Swap Card */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4">
          {/* Sell Section */}
          <SwapAmountInput
            label="Sell"
            amount={fromAmount}
            onAmountChange={setFromAmount}
            currency={fromCurrency}
            balance={fromBalance}
            availableWallets={availableWallets}
            onCurrencyChange={setFromCurrency}
            disabled={isLoadingQuote || swapMutation.isPending}
          />

          {/* Swap Button */}
          <SwapButton onClick={handleSwapCurrencies} disabled={isLoadingQuote || swapMutation.isPending} />

          {/* Buy Section */}
          <SwapAmountInput
            label="Buy"
            amount={toAmount}
            onAmountChange={() => {}} // Read-only
            currency={toCurrency}
            balance={toBalance}
            availableWallets={availableWallets}
            onCurrencyChange={setToCurrency}
            disabled={isLoadingQuote || swapMutation.isPending}
            readOnly
          />

          {/* Swap Info */}
          {quoteData && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-primary/50 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between items-center">
                <span>Price</span>
                <span className="font-medium">{formatNumber(exchangeRate)} {toCurrency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Trading Fee ({feePercent}%)</span>
                <span className="font-medium">{formatNumber(fee)} {fromCurrency}</span>
              </div>
              {parseFloat(spread) > 0 && (
                <div className="flex justify-between items-center">
                  <span>Spread</span>
                  <span className="font-medium">{formatNumber(spread)} {toCurrency}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1.5 border-t border-gray-200 dark:border-primary/50">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Quote valid for</span>
                </div>
                <span className={`font-medium ${timeRemaining <= 5 ? 'text-red-500 dark:text-red-400' : timeRemaining <= 10 ? 'text-yellow-500 dark:text-yellow-400' : ''}`}>
                  {timeRemaining}s
                </span>
              </div>
            </div>
          )}

          {/* Connect Wallet / Swap Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={handleSwap}
            disabled={!canSwap || swapMutation.isPending}
            className="mt-4"
            size="sm"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>

      {/* PIN Modal */}
      <Modal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false)
          setPin(['', '', '', ''])
          setError(null)
        }}
        title="Confirm Swap"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Enter your transaction PIN to confirm the swap
          </div>

          {swapMutation.error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  {(swapMutation.error as any)?.message || 'Failed to execute swap'}
                </p>
              </div>
            </div>
          )}

          <PinInput
            length={4}
            value={pin}
            onChange={handlePinChange}
            onComplete={handlePinComplete}
            disabled={swapMutation.isPending}
            autoFocus
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowPinModal(false)
                setPin(['', '', '', ''])
                setError(null)
              }}
              disabled={swapMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handlePinSubmit}
              disabled={pin.join('').length !== 4 || swapMutation.isPending}
            >
              {swapMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default SwapPage
