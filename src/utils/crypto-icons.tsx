import { Bitcoin, Waves, DollarSign, Circle, Coins } from 'lucide-react'

export interface CryptoIconConfig {
  icon: any
  iconColor: string
  iconBg: string
  name: string
}

// Map of crypto symbols to their icon configurations
export const cryptoIconMap: Record<string, CryptoIconConfig> = {
  BTC: {
    icon: Bitcoin,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/20',
    name: 'Bitcoin'
  },
  ETH: {
    icon: Waves,
    iconColor: 'text-gray-400',
    iconBg: 'bg-gray-500/20',
    name: 'Ethereum'
  },
  USDT: {
    icon: DollarSign,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/20',
    name: 'Tether USD'
  },
  USDC: {
    icon: DollarSign,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/20',
    name: 'USD Coin'
  },
  BNB: {
    icon: Circle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-500/20',
    name: 'Binance Coin'
  },
  TRX: {
    icon: Circle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/20',
    name: 'Tron'
  },
  SOL: {
    icon: Circle,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/20',
    name: 'Solana'
  },
  MATIC: {
    icon: Circle,
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/20',
    name: 'Polygon'
  },
  ETC: {
    icon: Waves,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-600/20',
    name: 'Ethereum Classic'
  },
  DAI: {
    icon: Circle,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-400/20',
    name: 'Dai'
  },
  UNI: {
    icon: Circle,
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-500/20',
    name: 'Uniswap'
  },
  FTM: {
    icon: Circle,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/20',
    name: 'Fantom'
  },
  AVAX: {
    icon: Circle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/20',
    name: 'Avalanche'
  }
}

// Get icon config for a currency symbol, with fallback
export const getCryptoIconConfig = (symbol: string): CryptoIconConfig => {
  return cryptoIconMap[symbol.toUpperCase()] || {
    icon: Coins,
    iconColor: 'text-gray-500',
    iconBg: 'bg-gray-500/20',
    name: symbol
  }
}
