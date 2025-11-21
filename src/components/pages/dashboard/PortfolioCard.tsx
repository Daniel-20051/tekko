  import Button from '../../ui/Button'

interface PortfolioCardProps {
  totalValue: number
  change24h: number
  changeAmount: number
}

const PortfolioCard = ({ totalValue, change24h, changeAmount }: PortfolioCardProps) => {
  const isPositive = change24h >= 0

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8">
      <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        Total Portfolio Value
      </h2>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          ₦{totalValue.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? '↗' : '↘'} {isPositive ? '+' : ''}{change24h.toFixed(1)}% 
          <span className="text-xs font-normal">
            (₦{changeAmount.toLocaleString('en-NG')})
          </span>
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Last 24h</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="primary" size="sm" className="flex-1 min-w-[120px]">
          View Analytics
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 min-w-[100px]">
           Deposit
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 min-w-[100px]">
           Withdraw
        </Button>
      </div>
    </div>
  )
}

export default PortfolioCard


