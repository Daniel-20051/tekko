import { useEffect, useMemo, useRef, useState } from 'react'
import { useMarketOverview } from './useMarket'
import { useThemeStore } from '../store/theme.store'

// Map to cache coin images (light mode)
const coinImageCache: Record<string, string> = {
  NGN: '/assets/naira-icon.png',
  BTC: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  BNB: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
  TRX: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
}

// Map to cache coin images (dark mode)
const coinImageCacheDark: Record<string, string> = {
  NGN: '/assets/naira-dark.png',
}

/**
 * Hook to get crypto coin image URL
 * Fetches from market overview API and caches results
 * Supports theme-aware images (e.g., NGN has different icons for light/dark mode)
 */
export const useCoinImage = (symbol: string | null | undefined) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const { data: marketOverview } = useMarketOverview()
  const { theme } = useThemeStore()

  useEffect(() => {
    if (!symbol) {
      setImageUrl(null)
      return
    }

    const upperSymbol = symbol.toUpperCase()

    // For NGN, use theme-aware icon
    if (upperSymbol === 'NGN') {
      const ngnIcon = theme === 'dark' 
        ? coinImageCacheDark[upperSymbol] 
        : coinImageCache[upperSymbol]
      setImageUrl(ngnIcon || null)
      return
    }

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
  }, [symbol, marketOverview, theme])

  return imageUrl
}

/**
 * Hook to get images for multiple coins at once
 * Supports theme-aware images (e.g., NGN has different icons for light/dark mode)
 */
export const useCoinImages = (symbols: (string | null | undefined)[]) => {
  const [images, setImages] = useState<Record<string, string | null>>({})
  const { data: marketOverview } = useMarketOverview()
  const { theme } = useThemeStore()
  const symbolsRef = useRef(symbols)

  // Update ref when symbols change
  useEffect(() => {
    symbolsRef.current = symbols
  }, [symbols])

  // Create a stable string representation of symbols for comparison
  const symbolsKey = useMemo(() => {
    return symbols
      .filter(Boolean)
      .map(s => s?.toUpperCase())
      .sort()
      .join(',')
  }, [symbols])

  useEffect(() => {
    const newImages: Record<string, string | null> = {}
    const currentSymbols = symbolsRef.current

    currentSymbols.forEach(symbol => {
      if (!symbol) return

      const upperSymbol = symbol.toUpperCase()

      // For NGN, use theme-aware icon
      if (upperSymbol === 'NGN') {
        const ngnIcon = theme === 'dark' 
          ? coinImageCacheDark[upperSymbol] 
          : coinImageCache[upperSymbol]
        newImages[upperSymbol] = ngnIcon || null
        return
      }

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
          return
        }
      }

      newImages[upperSymbol] = null
    })

    setImages(newImages)
  }, [symbolsKey, marketOverview, theme])

  return images
}

export default useCoinImage
