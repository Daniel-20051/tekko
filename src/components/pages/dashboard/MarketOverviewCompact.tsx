import { motion, useAnimationControls } from 'framer-motion'
import { TrendingUp, ArrowUpRight } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { usePrices, useMarketOverview, useMarketWebSocket } from '../../../hooks/useMarket'
import { useMarketData } from '../../../hooks/useMarketData'
import type { RealtimePriceData } from '../../../types/market'
import { formatPrice } from '../../../utils/market-utils'
import CryptoImage from '../../ui/CryptoImage'
import Spinner from '../../ui/Spinner'

const MarketOverviewCompact = () => {
  const controls = useAnimationControls()
  const [livePrices, setLivePrices] = useState<Record<string, RealtimePriceData>>({})

  // Fetch prices and market overview
  const { data: pricesData, isLoading: isLoadingPrices } = usePrices()
  const { data: marketOverview, isLoading: isLoadingOverview } = useMarketOverview()

  // WebSocket for live real-time updates
  useMarketWebSocket((priceData) => {
    setLivePrices(prev => ({
      ...prev,
      [priceData.coin]: priceData
    }))
  }, true)

  // Coin metadata for display
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
    SOL: {
      name: 'Solana',
      symbol: 'SOL',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
    }
  }

  // Use custom hook to merge and process market data
  const allMarketData = useMarketData({
    pricesData,
    marketOverview,
    livePrices,
    coinMetadata
  })

  // Filter to only show BTC, ETH, SOL (top 3)
  const topThreeCoins = useMemo(() => {
    const coinOrder = ['BTC', 'ETH', 'SOL']
    return allMarketData
      .filter(coin => coinOrder.includes(coin.coin))
      .sort((a, b) => {
        const aIndex = coinOrder.indexOf(a.coin)
        const bIndex = coinOrder.indexOf(b.coin)
        return aIndex - bIndex
      })
  }, [allMarketData])


  useEffect(() => {
    controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    }))
  }, [controls])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Market Overview
        </h2>
        <button className="text-xs text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors">
          View All
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {isLoadingPrices || isLoadingOverview ? (
          <div className="flex items-center justify-center p-8">
            <Spinner size="lg" variant="primary" />
          </div>
        ) : topThreeCoins.length === 0 ? (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm">
            No market data available
          </div>
        ) : (
          topThreeCoins.map((crypto, index) => {
            const imageUrl = coinMetadata[crypto.coin]?.image
            const isPositive = crypto.priceChangePercent >= 0
            
            return (
              <motion.div
                key={crypto.coin}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-primary/5 hover:border-primary dark:hover:border-primary hover:bg-gray-100 dark:hover:bg-primary/10 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <motion.div 
                    className="p-2 rounded-md"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CryptoImage 
                      symbol={crypto.coin}
                      imageUrl={imageUrl}
                      size="md"
                    />
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {crypto.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {crypto.coin}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-mono font-bold text-gray-900 dark:text-white text-sm">
                    {formatPrice(crypto.livePrice)}
                  </p>
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${
                    isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${isPositive ? '' : 'rotate-180'}`} />
                    {isPositive ? '+' : ''}{crypto.priceChangePercent.toFixed(2)}%
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}

export default MarketOverviewCompact

