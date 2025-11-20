import Button from '../ui/Button'

const marketData = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '₦95.5M',
    change24h: 2.4,
    icon: '₿'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '₦3.2M',
    change24h: -1.2,
    icon: 'Ξ'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    price: '₦1,650',
    change24h: 0.1,
    icon: '₮'
  }
]

const MarketOverview = () => {
  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Market Overview
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Crypto
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Price
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                24h
              </th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {marketData.map((crypto) => {
              const isPositive = crypto.change24h >= 0
              return (
                <tr key={crypto.symbol} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{crypto.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {crypto.symbol}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {crypto.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <p className="font-mono font-semibold text-gray-900 dark:text-white">
                      {crypto.price}
                    </p>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`inline-flex items-center gap-1 font-semibold text-sm ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isPositive ? '↗' : '↘'} {isPositive ? '+' : ''}{crypto.change24h.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Button variant="primary" size="sm">
                      Buy/Sell
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MarketOverview


