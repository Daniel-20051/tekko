import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useCoinMarketData, useHistoricalData, useMarketWebSocket } from '../../hooks/useMarket'
import type { RealtimePriceData } from '../../types/market'
import CoinHeader from '../../components/pages/markets/CoinHeader'
import PriceCharts from '../../components/pages/markets/PriceCharts'
import CoinStatsGrid from '../../components/pages/markets/CoinStatsGrid'
import CoinInfoCards from '../../components/pages/markets/CoinInfoCards'
import { formatPrice, formatLargeNumber, formatDate } from '../../utils/coin-utils'

interface CoinDetailPageProps {
  coin: string
}

const CoinDetailPage = ({ coin }: CoinDetailPageProps) => {
  const navigate = useNavigate()
  const [selectedDays, setSelectedDays] = useState<7 | 30 | 90 | 365>(7)
  const [livePriceData, setLivePriceData] = useState<Array<{ time: string; price: number }>>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [realtimeData, setRealtimeData] = useState<RealtimePriceData | null>(null)

  // Normalize coin to uppercase
  const normalizedCoin = coin?.toUpperCase() || ''
  
  // Reset live price data when coin changes
  useEffect(() => {
    setLivePriceData([])
    setCurrentPrice(null)
    setRealtimeData(null)
  }, [normalizedCoin])

  // Fetch coin market data
  const { data: coinData, isLoading: isLoadingCoin, error: coinError } = useCoinMarketData(normalizedCoin)

  // Fetch historical data
  const { data: historicalData, isLoading: isLoadingHistory } = useHistoricalData(
    normalizedCoin,
    selectedDays,
    'usd'
  )

  // Listen for live price updates via WebSocket
  useMarketWebSocket((priceData: RealtimePriceData) => {
    if (priceData.coin === normalizedCoin) {
      setCurrentPrice(priceData.price)
      setRealtimeData(priceData)
      
      // Add to live price data (keep last 60 data points for smooth chart)
      setLivePriceData((prev) => {
        const newData = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            price: priceData.price
          }
        ]
        return newData.slice(-60) // Keep last 60 points
      })
    }
  }, true)

  // Initialize current price from coin data
  useEffect(() => {
    if (coinData?.currentPrice?.usd && !currentPrice) {
      setCurrentPrice(coinData.currentPrice.usd)
    }
  }, [coinData, currentPrice])

  // Format historical data for chart
  const chartData = useMemo(() => {
    if (!historicalData?.prices) return []
    
    return historicalData.prices.map((point) => ({
      time: new Date(point.timestamp).toLocaleDateString(),
      timestamp: point.timestamp,
      price: point.price,
      marketCap: historicalData.marketCaps?.find(m => m.timestamp === point.timestamp)?.marketCap || 0,
      volume: historicalData.volumes?.find(v => v.timestamp === point.timestamp)?.volume || 0
    }))
  }, [historicalData])

  // Format live price data for chart
  const liveChartData = useMemo(() => {
    return livePriceData.map((point, index) => ({
      time: point.time,
      price: point.price,
      index
    }))
  }, [livePriceData])

  const priceFormatter = (price: number) => formatPrice(price, 'usd')

  if (isLoadingCoin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading coin data...</p>
        </div>
      </div>
    )
  }

  if (coinError || !coinData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Failed to load coin data. Please try again.
          </p>
          <button
            onClick={() => navigate({ to: '/markets' })}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Markets
          </button>
        </div>
      </div>
    )
  }

  const priceChange = coinData.priceChange24h?.percent || 0
  const isPositive = priceChange >= 0

  return (
    <div className="max-w-[1600px] mx-auto space-y-2">
      <CoinHeader
        name={coinData.name}
        symbol={coinData.symbol}
        image={coinData.image}
        currentPrice={currentPrice}
        fallbackPrice={coinData.currentPrice.usd}
        priceChange={priceChange}
        rank={coinData.marketCap.rank}
        formatPrice={priceFormatter}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Charts Section - Left Side */}
        <div className="lg:col-span-2">
          <PriceCharts
            liveChartData={liveChartData}
            historicalChartData={chartData}
            isLoadingHistory={isLoadingHistory}
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            isPositive={isPositive}
            formatPrice={priceFormatter}
          />
        </div>

        {/* Stats Sidebar - Right Side */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <CoinStatsGrid
            coinData={coinData}
            realtimeData={realtimeData}
            formatPrice={(price) => formatPrice(price, 'usd')}
            formatLargeNumber={formatLargeNumber}
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* Supply Information and Price Changes - Below Charts and Stats */}
      <CoinInfoCards
        coinData={coinData}
        formatLargeNumber={formatLargeNumber}
        priceChange={priceChange}
      />
    </div>
  )
}

export default CoinDetailPage
