import { Wallet } from 'lucide-react'

const WithdrawEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Wallet className="w-16 h-16 text-gray-400 mb-4" />
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        No wallets available
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        You need to have a wallet before you can withdraw funds
      </p>
    </div>
  )
}

export default WithdrawEmptyState
