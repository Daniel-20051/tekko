import Button from '../../ui/Button'

const QuickActions = () => {
  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Button variant="primary" size="md" fullWidth>
          Buy Crypto
        </Button>
        <Button variant="secondary" size="md" fullWidth>
          Sell Crypto
        </Button>
        <Button variant="secondary" size="md" fullWidth>
          Transfer
        </Button>
      </div>
    </div>
  )
}

export default QuickActions


