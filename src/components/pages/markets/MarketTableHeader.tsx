import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface MarketTableHeaderProps {
  sortBy: 'price' | 'change' | 'volume' | 'marketCap'
  sortOrder: 'asc' | 'desc'
  onSort: (column: 'price' | 'change' | 'volume' | 'marketCap') => void
}

const MarketTableHeader = ({ sortBy, sortOrder, onSort }: MarketTableHeaderProps) => {
  const SortIcon = ({ column }: { column: typeof sortBy }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? (
      <ArrowUpRight className="w-3 h-3 ml-1" />
    ) : (
      <ArrowDownRight className="w-3 h-3 ml-1" />
    )
  }

  return (
    <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-primary/30">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          #
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Coin
        </th>
        <th
          className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => onSort('price')}
        >
          <div className="flex items-center justify-end">
            Price
            <SortIcon column="price" />
          </div>
        </th>
        <th
          className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => onSort('change')}
        >
          <div className="flex items-center justify-end">
            24h Change
            <SortIcon column="change" />
          </div>
        </th>
        <th
          className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => onSort('volume')}
        >
          <div className="flex items-center justify-end">
            24h Volume
            <SortIcon column="volume" />
          </div>
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          24h High
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          24h Low
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Open
        </th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Trades (24h)
        </th>
        <th
          className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => onSort('marketCap')}
        >
          <div className="flex items-center justify-end">
            Market Cap
            <SortIcon column="marketCap" />
          </div>
        </th>
      </tr>
    </thead>
  )
}

export default MarketTableHeader
