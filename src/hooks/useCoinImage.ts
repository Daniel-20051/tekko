import { useEffect, useState } from 'react'
import { useMarketOverview } from './useMarket'

// Map to cache coin images
const coinImageCache: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
}

/**
 * Hook to get crypto coin image URL
 * Fetches from market overview API and caches results
 */
export const useCoinImage = (symbol: string | null | undefined) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { data: marketOverview } = useMarketOverview()

  useEffect(() => {
    if (!symbol) {
      setImageUrl(null)
      return
    }

    const upperSymbol = symbol.toUpperCase()

    // Check cache first
    if (coinImageCache[upperSymbol]) {
      setImageUrl(coinImageCache[upperSymbol])
      return
    }

    // Look in market overview data
    if (marketOverview?.coins) {
      const coinData = marketOverview.coins.find(
        coin => coin.coin.toUpperCase() === upperSymbol || coin.symbol.toUpperCase() === upperSymbol
      )
      if (coinData?.image) {
        coinImageCache[upperSymbol] = coinData.image
        setImageUrl(coinData.image)
        return
      }
    }

    // No image found
    setImageUrl(null)
  }, [symbol, marketOverview])

  return imageUrl
}

/**
 * Hook to get images for multiple coins at once
 */
export const useCoinImages = (symbols: (string | null | undefined)[]) => {
  const [images, setImages] = useState<Record<string, string | null>>({})
  const { data: marketOverview } = useMarketOverview()

  useEffect(() => {
    const newImages: Record<string, string | null> = {}
    let hasChanges = false

    symbols.forEach(symbol => {
      if (!symbol) return

      const upperSymbol = symbol.toUpperCase()

      // Check cache first
      if (coinImageCache[upperSymbol]) {
        newImages[upperSymbol] = coinImageCache[upperSymbol]
        return
      }

      // Look in market overview data
      if (marketOverview?.coins) {
        const coinData = marketOverview.coins.find(
          coin => coin.coin.toUpperCase() === upperSymbol || coin.symbol.toUpperCase() === upperSymbol
        )
        if (coinData?.image) {
          coinImageCache[upperSymbol] = coinData.image
          newImages[upperSymbol] = coinData.image
          hasChanges = true
          return
        }
      }

      newImages[upperSymbol] = null
    })

    if (hasChanges || Object.keys(newImages).length > 0) {
      setImages(newImages)
    }
  }, [symbols, marketOverview])

  return images
}

export default useCoinImage
