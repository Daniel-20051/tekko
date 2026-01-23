import type { MarketCoinData } from '../../../types/market'

interface CoinInfoCardsProps {
  coinData: MarketCoinData
  formatLargeNumber: (value: number) => string
  priceChange: number
}

const CoinInfoCards = ({ coinData, formatLargeNumber, priceChange }: CoinInfoCardsProps) => {
  const isPositive = priceChange >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {/* Supply Info */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-4 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Supply Information</h3>
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Circulating Supply</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {formatLargeNumber(coinData.supply.circulating)} {coinData.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Total Supply</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {formatLargeNumber(coinData.supply.total)} {coinData.symbol}
            </span>
          </div>
          {coinData.supply.max > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Max Supply</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {formatLargeNumber(coinData.supply.max)} {coinData.symbol}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price Changes */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-4 h-full flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Price Changes</h3>
        <div className="space-y-2 flex-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">24h Change</span>
            <span className={`text-xs font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
          {coinData.priceChange7d && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">7d Change</span>
              <span className={`text-xs font-semibold ${coinData.priceChange7d.percent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {coinData.priceChange7d.percent >= 0 ? '+' : ''}{coinData.priceChange7d.percent.toFixed(2)}%
              </span>
            </div>
          )}
          {coinData.priceChange30d && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">30d Change</span>
              <span className={`text-xs font-semibold ${coinData.priceChange30d.percent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {coinData.priceChange30d.percent >= 0 ? '+' : ''}{coinData.priceChange30d.percent.toFixed(2)}%
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Fully Diluted Valuation</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              ${formatLargeNumber(coinData.fullyDilutedValuation)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoinInfoCards
