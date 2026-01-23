import type { MarketCoinData, RealtimePriceData } from '../../../types/market'

interface CoinStatsGridProps {
  coinData: MarketCoinData
  realtimeData?: RealtimePriceData | null
  formatPrice: (price: number) => string
  formatLargeNumber: (value: number) => string
  formatDate: (dateString: string) => string
}

const CoinStatsGrid = ({ coinData, realtimeData, formatPrice, formatLargeNumber, formatDate }: CoinStatsGridProps) => {
  // Use real-time data if available, otherwise fallback to coinData
  const volume24h = realtimeData?.quoteVolume || coinData.volume24h.usd
  const high24h = realtimeData?.high || 0
  const low24h = realtimeData?.low || 0
  const open24h = realtimeData?.open || 0
  const trades24h = realtimeData?.trades || 0

  return (
    <div className="grid grid-cols-2 gap-2 h-full">
      {/* Market Cap */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          ${formatLargeNumber(coinData.marketCap.usd)}
        </p>
      </div>

      {/* 24h Volume */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Volume</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          ${formatLargeNumber(volume24h)}
        </p>
      </div>

      {/* 24h High */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h High</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {high24h ? formatPrice(high24h) : '-'}
        </p>
      </div>

      {/* 24h Low */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Low</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {low24h ? formatPrice(low24h) : '-'}
        </p>
      </div>

      {/* Open */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open (24h)</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {open24h ? formatPrice(open24h) : '-'}
        </p>
      </div>

      {/* Trades */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trades (24h)</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {trades24h ? trades24h.toLocaleString() : '-'}
        </p>
      </div>

      {/* All Time High */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">All Time High</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {formatPrice(coinData.allTimeHigh.usd)}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
          {formatDate(coinData.allTimeHigh.date)} ({coinData.allTimeHigh.changePercent.toFixed(2)}%)
        </p>
      </div>

      {/* All Time Low */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3 flex flex-col justify-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">All Time Low</p>
        <p className="text-base font-bold text-gray-900 dark:text-white">
          {formatPrice(coinData.allTimeLow.usd)}
        </p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
          {formatDate(coinData.allTimeLow.date)} ({coinData.allTimeLow.changePercent.toFixed(2)}%)
        </p>
      </div>
    </div>
  )
}

export default CoinStatsGrid
