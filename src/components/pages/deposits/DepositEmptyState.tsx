import { Info } from 'lucide-react'

const DepositEmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
        <Info className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
        Select a wallet to see deposit accounts.
      </p>
    </div>
  )
}

export default DepositEmptyState
