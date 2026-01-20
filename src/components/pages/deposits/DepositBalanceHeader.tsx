import { RefreshCw } from 'lucide-react'

interface DepositBalanceHeaderProps {
  balance: string
  currency: string
  onRefresh: () => void
  isRefreshing: boolean
}

const DepositBalanceHeader = ({ balance, currency, onRefresh, isRefreshing }: DepositBalanceHeaderProps) => {
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance || '0')
    if (isNaN(num)) return '0.00'
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
  }

  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-800">
      <div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Balance</p>
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {formatBalance(balance)} {currency}
          </p>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <RefreshCw 
              className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 ${
                isRefreshing ? 'animate-spin' : ''
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DepositBalanceHeader
