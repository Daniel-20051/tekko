import Button from '../ui/Button'

interface WalletCardProps {
  name: string
  symbol: string
  balance: string
  ngnValue: number
  icon?: string
}

const WalletCard = ({ name, symbol, balance, ngnValue, icon }: WalletCardProps) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-lg">{icon}</span>}
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {name} ({symbol})
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ≈ ₦{ngnValue.toLocaleString('en-NG')}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-mono font-semibold text-gray-900 dark:text-white">
            {balance}
          </p>
        </div>
        <Button variant="outline" size="sm">
          {symbol === 'NGN' ? 'Deposit' : 'Buy'}
        </Button>
      </div>
    </div>
  )
}

export default WalletCard


