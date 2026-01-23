import { Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface LiveChartData {
  time: string
  price: number
  index: number
}

interface HistoricalChartData {
  time: string
  timestamp: number
  price: number
  marketCap: number
  volume: number
}

interface PriceChartsProps {
  liveChartData: LiveChartData[]
  historicalChartData: HistoricalChartData[]
  isLoadingHistory: boolean
  selectedDays: 7 | 30 | 90 | 365
  onDaysChange: (days: 7 | 30 | 90 | 365) => void
  isPositive: boolean
  formatPrice: (price: number) => string
}

const PriceCharts = ({
  liveChartData,
  historicalChartData,
  isLoadingHistory,
  selectedDays,
  onDaysChange,
  isPositive,
  formatPrice,
}: PriceChartsProps) => {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-primary/50 p-3">
      {/* Live Price Chart */}
      {liveChartData.length > 0 && (
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Live Price (Last 60 Updates)
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={liveChartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  color: '#000'
                }}
                formatter={(value: number | undefined) => value !== undefined ? formatPrice(value) : ''}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Historical Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Historical Price Chart
          </h3>
          <div className="flex items-center gap-1">
            {[7, 30, 90, 365].map((days) => (
              <button
                key={days}
                onClick={() => onDaysChange(days as 7 | 30 | 90 | 365)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  selectedDays === days
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {days === 365 ? '1Y' : `${days}D`}
              </button>
            ))}
          </div>
        </div>
        {isLoadingHistory ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          </div>
        ) : historicalChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historicalChartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  color: '#000'
                }}
                formatter={(value: number | undefined) => value !== undefined ? formatPrice(value) : ''}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400 text-xs">
            No historical data available
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceCharts
