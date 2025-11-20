interface TransactionItemProps {
  type: 'buy' | 'sell' | 'deposit' | 'withdraw'
  asset: string
  amount: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

const TransactionItem = ({ type, asset, amount, timestamp, status }: TransactionItemProps) => {
  const typeConfig = {
    buy: { icon: '↗️', label: 'Bought', color: 'text-green-600 dark:text-green-400' },
    sell: { icon: '↘️', label: 'Sold', color: 'text-red-600 dark:text-red-400' },
    deposit: { icon: '⬇️', label: 'Deposit', color: 'text-blue-600 dark:text-blue-400' },
    withdraw: { icon: '⬆️', label: 'Withdraw', color: 'text-orange-600 dark:text-orange-400' }
  }

  const statusConfig = {
    completed: { label: '✅ Completed', color: 'text-green-600 dark:text-green-400' },
    pending: { label: '⏳ Pending', color: 'text-yellow-600 dark:text-yellow-400' },
    failed: { label: '❌ Failed', color: 'text-red-600 dark:text-red-400' }
  }

  const config = typeConfig[type]
  const statusInfo = statusConfig[status]

  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{config.icon}</span>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {config.label} {asset}
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
          {timestamp}
        </p>
      </div>
      
      <div className="text-right">
        <p className={`font-mono font-semibold mb-1 ${config.color}`}>
          {amount}
        </p>
        <p className={`text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </p>
      </div>
    </div>
  )
}

export default TransactionItem


