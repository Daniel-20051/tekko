import { useMemo } from 'react'
import type { RealtimePriceData, MarketCoinData, PriceData } from '../types/market'

interface UseMarketDataProps {
  pricesData?: { prices: Record<string, PriceData> }
  marketOverview?: { coins: MarketCoinData[]; totalCoins?: number }
  livePrices: Record<string, RealtimePriceData>
  coinMetadata: Record<string, { name: string; symbol: string; image: string }>
}

export const useMarketData = ({
  pricesData,
  marketOverview,
  livePrices,
  coinMetadata,
}: UseMarketDataProps) => {
  const marketData = useMemo(() => {
    const coinOrder = ['BTC', 'ETH', 'BNB', 'TRX', 'SOL']
    const basePrices = pricesData?.prices || {}
    const allRealtimeData = livePrices || {}

    const allAvailableCoins = new Set([
      ...Object.keys(basePrices),
      ...Object.keys(allRealtimeData),
      ...(marketOverview?.coins?.map(c => c.coin) || []),
      ...(marketOverview?.coins?.map(c => c.symbol) || [])
    ])

    const expectedCoins = coinOrder.filter(coin => {
      if (coin === 'USDT') return false
      return allAvailableCoins.has(coin) || 
             basePrices[coin] !== undefined || 
             allRealtimeData[coin] !== undefined || 
             marketOverview?.coins?.some(c => c.coin === coin || c.symbol === coin) === true
    })

    if (Object.keys(basePrices).length > 0 || expectedCoins.length > 0) {
      const allCoinsToProcess = new Set([
        ...Object.keys(basePrices).filter(coin => coin !== 'USDT'),
        ...expectedCoins,
        ...(marketOverview?.coins?.map(c => c.coin).filter(coin => coin && coin !== 'USDT') || []),
        ...(marketOverview?.coins?.map(c => c.symbol).filter(symbol => symbol && symbol !== 'USDT') || [])
      ])

      const sortedCoinSymbols = Array.from(allCoinsToProcess).sort((a, b) => {
        const aIndex = coinOrder.indexOf(a)
        const bIndex = coinOrder.indexOf(b)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })

      return sortedCoinSymbols.map((coinSymbol: string) => {
        const basePrice: PriceData = basePrices[coinSymbol]
        const realtimePrice = allRealtimeData[coinSymbol]
        const overviewCoin = marketOverview?.coins?.find((c: MarketCoinData) => 
          c.coin === coinSymbol || c.symbol === coinSymbol
        )
        const metadata = coinMetadata[coinSymbol] || {
          name: coinSymbol,
          symbol: coinSymbol,
          image: ''
        }

        const currentPrice = realtimePrice?.price || basePrice?.usd || overviewCoin?.currentPrice?.usd || 0

        if (!currentPrice && !basePrice && !realtimePrice && !overviewCoin) {
          return null
        }

        let priceChangePercent = basePrice?.usd_24h_change || overviewCoin?.priceChange24h?.percent || 0
        if (realtimePrice) {
          priceChangePercent = realtimePrice.priceChangePercent
        }

        const volume24h = realtimePrice?.quoteVolume || basePrice?.usd_24h_vol || overviewCoin?.volume24h?.usd || 0
        const high24h = realtimePrice?.high || 0
        const low24h = realtimePrice?.low || 0
        const open24h = realtimePrice?.open || 0
        const trades24h = realtimePrice?.trades || 0

        if (coinSymbol === 'USDT') {
          return null
        }

        const tradingPairSymbol = realtimePrice?.symbol || `${coinSymbol}USDT`

        return {
          coin: coinSymbol,
          name: overviewCoin?.name || metadata.name,
          symbol: tradingPairSymbol,
          image: overviewCoin?.image || metadata.image,
          livePrice: currentPrice,
          priceChangePercent: priceChangePercent,
          volume24h: volume24h,
          high24h: high24h,
          low24h: low24h,
          open24h: open24h,
          trades24h: trades24h,
          marketCap: {
            usd: basePrice?.usd_market_cap || overviewCoin?.marketCap?.usd || 0,
            rank: 0
          },
          currentPrice: {
            usd: currentPrice
          },
          priceChange24h: {
            usd: realtimePrice?.priceChange || (basePrice?.usd_24h_change ? (currentPrice - (currentPrice / (1 + basePrice.usd_24h_change / 100))) : overviewCoin?.priceChange24h?.usd || 0),
            percent: realtimePrice?.priceChangePercent || basePrice?.usd_24h_change || overviewCoin?.priceChange24h?.percent || 0
          },
          priceChange7d: overviewCoin?.priceChange7d,
          priceChange30d: overviewCoin?.priceChange30d
        }
      }).filter((coin): coin is NonNullable<typeof coin> => coin !== null)
    }

    if (Object.keys(allRealtimeData).length > 0) {
      const sortedCoins = Object.values(allRealtimeData)
        .filter((priceData: RealtimePriceData) => priceData.coin !== 'USDT')
        .sort((a, b) => {
          const aIndex = coinOrder.indexOf(a.coin)
          const bIndex = coinOrder.indexOf(b.coin)
          if (aIndex === -1 && bIndex === -1) return 0
          if (aIndex === -1) return 1
          if (bIndex === -1) return -1
          return aIndex - bIndex
        })

      return sortedCoins.map((priceData: RealtimePriceData) => {
        const overviewCoin = marketOverview?.coins?.find((c: MarketCoinData) => 
          c.coin === priceData.coin || c.symbol === priceData.coin
        )
        const metadata = coinMetadata[priceData.coin] || {
          name: priceData.coin,
          symbol: priceData.coin,
          image: ''
        }
        const tradingPairSymbol = priceData.symbol || `${priceData.coin}USDT`

        return {
          coin: priceData.coin,
          name: overviewCoin?.name || metadata.name,
          symbol: tradingPairSymbol,
          image: overviewCoin?.image || metadata.image,
          livePrice: priceData.price,
          priceChangePercent: priceData.priceChangePercent,
          volume24h: priceData.quoteVolume,
          high24h: priceData.high || 0,
          low24h: priceData.low || 0,
          open24h: priceData.open || 0,
          trades24h: priceData.trades || 0,
          marketCap: {
            usd: overviewCoin?.marketCap?.usd || 0,
            rank: 0
          },
          currentPrice: {
            usd: priceData.price
          },
          priceChange24h: {
            usd: priceData.priceChange,
            percent: priceData.priceChangePercent
          },
          priceChange7d: overviewCoin?.priceChange7d,
          priceChange30d: overviewCoin?.priceChange30d
        }
      })
    }

    return []
  }, [pricesData, marketOverview, livePrices, coinMetadata])

  return marketData
}
