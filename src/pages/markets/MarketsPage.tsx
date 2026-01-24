import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { usePrices, useMarketOverview, useMarketWebSocket } from '../../hooks/useMarket'
import { useMarketData } from '../../hooks/useMarketData'
import type { RealtimePriceData } from '../../types/market'
import Spinner from '../../components/ui/Spinner'
import MarketStats from '../../components/pages/markets/MarketStats'
import MarketTableHeader from '../../components/pages/markets/MarketTableHeader'
import MarketTableRow from '../../components/pages/markets/MarketTableRow'
import { formatPrice, formatVolume, formatMarketCap } from '../../utils/market-utils'

const MarketsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'marketCap'>('marketCap')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Fetch prices (includes USDT and market cap data) - initial load only, cached 30s
  const { data: pricesData, isLoading: isLoadingPrices } = usePrices()
  
  // Fetch market overview data (for additional metadata like 7d/30d changes) - cached, updates every 30s
  const { data: marketOverview, isLoading: isLoadingOverview } = useMarketOverview()

  // WebSocket for live real-time updates (primary source for price updates)
  // No API polling - WebSocket handles all real-time updates to reduce server load
  const [livePrices, setLivePrices] = useState<Record<string, RealtimePriceData>>({})
  
  useMarketWebSocket((priceData) => {
    setLivePrices(prev => ({
      ...prev,
      [priceData.coin]: priceData
    }))
  }, true)

  // Coin metadata for display (fallback when market overview is not available)
  const coinMetadata: Record<string, { name: string; symbol: string; image: string }> = {
    BTC: {
      name: 'Bitcoin',
      symbol: 'BTC',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    ETH: {
      name: 'Ethereum',
      symbol: 'ETH',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    USDT: {
      name: 'Tether',
      symbol: 'USDT',
      image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png'
    },
    BNB: {
      name: 'Binance Coin',
      symbol: 'BNB',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
    },
    TRX: {
      name: 'TRON',
      symbol: 'TRX',
      image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png'
    },
    SOL: {
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    }
  }

  // Use custom hook to merge and process market data
  const marketData = useMarketData({
    pricesData,
    marketOverview,
    livePrices,
    coinMetadata
  })

  // Filter and sort market data
  const filteredAndSortedData = useMemo(() => {
    let filtered = marketData

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query) ||
          coin.coin.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case 'price':
          aValue = a.livePrice
          bValue = b.livePrice
          break
        case 'change':
          aValue = a.priceChangePercent
          bValue = b.priceChangePercent
          break
        case 'volume':
          aValue = a.volume24h
          bValue = b.volume24h
          break
        case 'marketCap':
          aValue = a.marketCap.usd
          bValue = b.marketCap.usd
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

    // Assign sequential ranks based on final sorted position
    return filtered.map((coin, index) => ({
      ...coin,
      marketCap: {
        ...coin.marketCap,
        rank: index + 1
      }
    }))
  }, [marketData, searchQuery, sortBy, sortOrder])

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  // Show loading only if we have no data at all
  if (isLoadingPrices && isLoadingOverview && !marketData.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" variant="primary" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading market data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Markets
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time cryptocurrency prices and market data
          </p>
        </div>

      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search coins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Market Stats Summary */}
      <MarketStats
        totalCoins={marketOverview?.totalCoins}
        marketData={marketData}
        filteredCount={filteredAndSortedData.length}
      />

      {/* Market Table */}
      <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <MarketTableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
            <tbody className="divide-y divide-gray-200 dark:divide-primary/30">
              {filteredAndSortedData.map((coin, index) => (
                <MarketTableRow
                  key={coin.coin}
                  coin={coin}
                  index={index}
                  formatPrice={formatPrice}
                  formatVolume={formatVolume}
                  formatMarketCap={formatMarketCap}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No coins found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketsPage
