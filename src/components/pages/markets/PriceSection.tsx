import { TrendingUp, TrendingDown } from 'lucide-react'

interface PriceSectionProps {
  currentPrice: number | null
  fallbackPrice: number
  priceChange: number
  rank: number
  formatPrice: (price: number) => string
}

const PriceSection = ({
  currentPrice,
  fallbackPrice,
  priceChange,
  rank,
  formatPrice,
}: PriceSectionProps) => {
  const isPositive = priceChange >= 0
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown
  const displayPrice = currentPrice ?? fallbackPrice

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(displayPrice)}
            </p>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
                isPositive
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
              }`}
            >
              <ChangeIcon className="w-3 h-3" />
              <span className="text-xs font-semibold">
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Rank #{rank}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PriceSection
