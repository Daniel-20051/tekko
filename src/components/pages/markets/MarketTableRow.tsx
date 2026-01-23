import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CoinData {
  coin: string
  name: string
  symbol: string
  image: string
  livePrice: number
  priceChangePercent: number
  volume24h: number
  high24h: number
  low24h: number
  open24h: number
  trades24h: number
  marketCap: {
    usd: number
    rank: number
  }
}

interface MarketTableRowProps {
  coin: CoinData
  index: number
  formatPrice: (price: number) => string
  formatVolume: (volume: number) => string
  formatMarketCap: (cap: number) => string
}

const MarketTableRow = ({ coin, index, formatPrice, formatVolume, formatMarketCap }: MarketTableRowProps) => {
  const isPositive = coin.priceChangePercent >= 0
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <motion.tr
      key={coin.coin}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
    >
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
        {coin.marketCap.rank}
      </td>
      <td className="px-4 py-4">
        <Link
          to="/markets/$coin"
          params={{ coin: coin.coin }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full text-left"
        >
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {coin.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {coin.symbol}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-4 py-4 text-right">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatPrice(coin.livePrice)}
        </p>
      </td>
      <td className="px-4 py-4 text-right">
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded ${
            isPositive
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}
        >
          <ChangeIcon className="w-3 h-3" />
          <span className="text-xs font-medium">
            {Math.abs(coin.priceChangePercent).toFixed(2)}%
          </span>
        </div>
      </td>
      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
        {formatVolume(coin.volume24h)}
      </td>
      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
        {coin.high24h ? formatPrice(coin.high24h) : '-'}
      </td>
      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
        {coin.low24h ? formatPrice(coin.low24h) : '-'}
      </td>
      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
        {coin.open24h ? formatPrice(coin.open24h) : '-'}
      </td>
      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
        {coin.trades24h ? coin.trades24h.toLocaleString() : '-'}
      </td>
      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
        {formatMarketCap(coin.marketCap.usd)}
      </td>
    </motion.tr>
  )
}

export default MarketTableRow
