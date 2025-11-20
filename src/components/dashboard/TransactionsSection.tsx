import { Link } from '@tanstack/react-router'
import TransactionItem from './TransactionItem'

const transactionsData = [
  {
    type: 'buy' as const,
    asset: 'Bitcoin',
    amount: '+0.0002 BTC',
    timestamp: 'Today, 10:45 AM',
    status: 'completed' as const
  },
  {
    type: 'sell' as const,
    asset: 'Ethereum',
    amount: '-0.005 ETH',
    timestamp: 'Yesterday, 3:20 PM',
    status: 'completed' as const
  },
  {
    type: 'deposit' as const,
    asset: '',
    amount: '+₦50,000',
    timestamp: 'Nov 1, 2:15 PM',
    status: 'completed' as const
  }
]

const TransactionsSection = () => {
  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h2>
      
      <div className="space-y-2">
        {transactionsData.map((transaction, index) => (
          <TransactionItem key={index} {...transaction} />
        ))}
      </div>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        View All Transactions →
      </Link>
    </div>
  )
}

export default TransactionsSection


