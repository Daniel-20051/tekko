import { useState, useEffect, useRef } from 'react'
import { Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWalletTransactions } from '../../hooks/useWallet'
import { getCryptoIconConfig } from '../../utils/crypto-icons'
import type { TransactionType } from '../../types/transaction'
import type { TransactionQueryParams } from '../../types/transaction'
import TransactionFilterDropdown, { type TransactionFilters } from '../../components/pages/wallets/TransactionFilterModal'
import Button from '../../components/ui/Button'
import { useWalletBalances } from '../../hooks/useWallet'
import TransactionDetails from '../../components/pages/wallets/TransactionDetails'
import { ArrowUp, ArrowDown, Copy, Info, ChevronLeft, ChevronRight } from 'lucide-react'

const TransactionsPage = () => {
  const { data: walletBalances } = useWalletBalances()
  // List of fiat currencies to filter out
  const fiatCurrencies = ['NGN', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'ZAR', 'MXN', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'PLN', 'RUB', 'TRY', 'KRW', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 'CZK', 'HUF', 'ILS', 'CLP', 'ARS', 'COP', 'PEN', 'UAH', 'RON', 'BGN', 'HRK', 'ISK', 'NZD']
  const cryptoWallets = walletBalances?.wallets?.filter(w => !fiatCurrencies.includes(w.currency.toUpperCase())) || []
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [transactionFilters, setTransactionFilters] = useState<TransactionFilters>({})
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [transactionFilters.currency, transactionFilters.type, transactionFilters.status, transactionFilters.startDate, transactionFilters.endDate])

  // Build query params from filters
  const queryParams: TransactionQueryParams = {
    currency: transactionFilters.currency,
    type: transactionFilters.type,
    status: transactionFilters.status,
    page,
    limit,
    startDate: transactionFilters.startDate,
    endDate: transactionFilters.endDate
  }

  // Fetch transactions
  const { data: transactionsData, isLoading } = useWalletTransactions(queryParams)

  // Sync page state with API response if it's out of bounds
  useEffect(() => {
    if (transactionsData?.pagination) {
      const { page: currentPage, pages } = transactionsData.pagination
      if (currentPage !== page && currentPage > 0) {
        setPage(currentPage)
      }
      // If current page exceeds total pages, reset to last page
      if (pages > 0 && page > pages) {
        setPage(pages)
      }
    }
  }, [transactionsData?.pagination, page])

  // Get pagination info with fallbacks
  const pagination = transactionsData?.pagination || {
    page: page,
    limit: limit,
    total: 0,
    pages: 0
  }

  // Filter pending and completed transactions
  const { pendingTransactions, completedTransactions } = (() => {
    const transactions = transactionsData?.transactions || []
    
    return {
      pendingTransactions: transactions.filter(tx => tx.status === 'pending' || tx.status === 'processing'),
      completedTransactions: transactions.filter(tx => tx.status === 'completed')
    }
  })()

  // Calculate running balance for each transaction
  const transactionsWithBalance = (() => {
    const allTransactions = [...completedTransactions, ...pendingTransactions]
    let runningBalance = 0
    
    return allTransactions.map((tx, index) => {
      const amount = parseFloat(tx.amount)
      if (tx.type === 'deposit') {
        runningBalance += amount
      } else {
        runningBalance -= amount
      }
      
      const previousBalance = index > 0 ? runningBalance - (tx.type === 'deposit' ? amount : -amount) : runningBalance
      
      return {
        ...tx,
        currentBalance: runningBalance,
        previousBalance
      }
    })
  })()

  const getServiceName = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'BANK TRANSFER DIRECT DEPOSIT'
      case 'withdrawal':
        return 'WITHDRAWAL'
      case 'transfer':
        return 'TRANSFER'
      case 'trade':
        return 'TRADE'
      case 'fee':
        return 'FEE'
      default:
        return (type as string).toUpperCase()
    }
  }

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex gap-3 h-[calc(100vh-100px)] overflow-hidden">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col gap-3 overflow-hidden ${selectedTransaction ? 'hidden lg:flex' : 'flex'}`}>
        {/* Top Controls Bar - Filter bar for transactions */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Left Side - Title */}
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Transactions</h1>
            {/* Right Side - Action Buttons and Filters */}
            <div className="flex items-center gap-2">
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
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="flex-1 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 flex-1">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Loading transactions...</p>
            </div>
          ) : transactionsWithBalance.length === 0 ? (
            <div className=" text-center">
              <img 
                src="/assets/emptystateTransactions.png" 
                alt="No transactions" 
                className="w-80 md:w-150 h-50 md:h-60  object-contain mx-auto"
              />
              <p className="text-gray-500 mb-3 dark:text-gray-400 text-sm">
                {transactionFilters.type || transactionFilters.status || transactionFilters.currency
                  ? 'No transactions found matching your filters'
                  : 'No transactions found'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto overflow-y-auto wallet-transactions-scrollbar flex-1">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Wallet</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {transactionsWithBalance.map((tx) => {
                      const iconConfig = getCryptoIconConfig(tx.currency)
                      const CurrencyIcon = iconConfig.icon
                      const isDeposit = tx.type === 'deposit'
                      const isSelected = selectedTransaction === tx.id.toString()
                      const isPending = tx.status === 'pending' || tx.status === 'processing'

                      return (
                        <motion.tr
                          key={tx.id}
                          onClick={() => setSelectedTransaction(tx.id.toString())}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-primary/5 dark:bg-primary/10'
                              : 'hover:bg-gray-50 dark:hover:bg-dark-bg/50'
                          } ${isPending ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}
                          whileHover={{ backgroundColor: isSelected ? undefined : 'rgba(0, 0, 0, 0.02)' }}
                        >
                          {/* Wallet Column */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg ${iconConfig.iconBg} flex items-center justify-center shrink-0`}>
                                <CurrencyIcon className={`w-4 h-4 ${iconConfig.iconColor}`} />
                              </div>
                            </div>
                          </td>

                          {/* Service Column */}
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                              {getServiceName(tx.type)}
                            </span>
                          </td>

                          {/* Amount Column */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isDeposit ? (
                                <ArrowDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <ArrowUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                              )}
                              <span className={`text-sm font-semibold ${
                                isDeposit 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {isDeposit ? '+' : '-'}{Math.abs(parseFloat(tx.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                              </span>
                            </div>
                          </td>

                          {/* Balance Column */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {tx.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {tx.previousBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.currency}
                              </span>
                            </div>
                          </td>

                          {/* Date Column */}
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-900 dark:text-white">
                                {new Date(tx.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(tx.createdAt).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit',
                                  second: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                onClick={(e) => handleCopy(tx.id.toString(), e)}
                                title="Copy transaction ID"
                                className="p-1.5"
                                aria-label="Copy transaction ID"
                              >
                                <span className="sr-only">Copy</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
                                onClick={() => setSelectedTransaction(tx.id.toString())}
                                title="View details"
                                className="p-1.5"
                                aria-label="View details"
                              >
                                <span className="sr-only">View details</span>
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {!isLoading && (
                <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-dark-bg flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Items per page:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value))
                        setPage(1)
                      }}
                      className="px-2 py-1 text-sm bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (Total: {pagination.total})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Page {pagination.page} of {pagination.pages || 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ChevronLeft className="w-4 h-4" />}
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1 || pagination.pages === 0}
                        className="p-1.5 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface"
                        aria-label="Previous page"
                      >
                        <span className="sr-only">Previous</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ChevronRight className="w-4 h-4" />}
                        onClick={() => setPage(prev => Math.min(pagination.pages || 1, prev + 1))}
                        disabled={page >= (pagination.pages || 1) || pagination.pages === 0}
                        className="p-1.5 border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-surface"
                        aria-label="Next page"
                      >
                        <span className="sr-only">Next</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Column - Transaction Details (Desktop) / Full Screen (Mobile) */}
      <div className={`${selectedTransaction ? 'block' : 'hidden'} lg:block`}>
        <TransactionDetails 
          selectedTransaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      </div>

      {/* Transaction Filter Dropdown */}
      <TransactionFilterDropdown
        isOpen={showFilterDropdown}
        onClose={() => setShowFilterDropdown(false)}
        onApplyFilters={(filters) => {
          setTransactionFilters(filters)
        }}
        initialFilters={transactionFilters}
        availableCurrencies={cryptoWallets.map(w => w.currency as any) || ['BTC', 'ETH', 'USDT']}
        buttonRef={filterButtonRef}
      />
    </div>
  )
}

export default TransactionsPage
