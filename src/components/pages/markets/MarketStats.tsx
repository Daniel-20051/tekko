import { useMemo } from 'react'

interface MarketStatsProps {
  totalCoins?: number
  marketData: Array<{ marketCap: { usd: number }; volume24h: number }>
  filteredCount: number
}

const MarketStats = ({ totalCoins = 0, marketData, filteredCount }: MarketStatsProps) => {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toLocaleString()}`
  }

  const totalMarketCap = useMemo(
    () => marketData.reduce((sum, coin) => sum + coin.marketCap.usd, 0),
    [marketData]
  )

  const totalVolume = useMemo(
    () => marketData.reduce((sum, coin) => sum + coin.volume24h, 0),
    [marketData]
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Coins</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{totalCoins}</p>
      </div>
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Market Cap</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatMarketCap(totalMarketCap)}</p>
      </div>
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">24h Volume</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatVolume(totalVolume)}</p>
      </div>
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Active Markets</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{filteredCount}</p>
      </div>
    </div>
  )
}

export default MarketStats
