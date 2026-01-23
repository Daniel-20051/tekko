import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CoinHeaderProps {
  name: string
  symbol: string
  image: string
  currentPrice: number | null
  fallbackPrice: number
  priceChange: number
  rank: number
  formatPrice: (price: number) => string
}

const CoinHeader = ({ 
  name, 
  symbol, 
  image,
  currentPrice,
  fallbackPrice,
  priceChange,
  rank,
  formatPrice
}: CoinHeaderProps) => {
  const navigate = useNavigate()
  const isPositive = priceChange >= 0
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown
  const displayPrice = currentPrice ?? fallbackPrice

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate({ to: '/markets' })}
          className="p-1.5 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 hover:bg-gray-50 dark:hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <img
            src={image}
            alt={name}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {symbol}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Price Card */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-2.5 flex-shrink-0">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(displayPrice)}
          </p>
          <div
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
              isPositive
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
            }`}
          >
            <ChangeIcon className="w-2.5 h-2.5" />
            <span className="text-[10px] font-semibold">
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
          Rank #{rank}
        </p>
      </div>
    </div>
  )
}

export default CoinHeader
