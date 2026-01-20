import { Search } from 'lucide-react'

interface AssetSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

const AssetSearchBar = ({ searchQuery, onSearchChange }: AssetSearchBarProps) => {
  return (
    <div className="hidden lg:block p-3 border-b border-gray-200 dark:border-gray-800">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-dark-bg rounded-lg text-sm text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-gray-700 transition-colors"
        />
      </div>
    </div>
  )
}

export default AssetSearchBar
