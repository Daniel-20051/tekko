import { Wallet, Plus } from 'lucide-react'
import Button from '../../ui/Button'

interface EmptyWalletStateProps {
  searchQuery: string
  onCreateWallet?: () => void
}

const EmptyWalletState = ({ searchQuery, onCreateWallet }: EmptyWalletStateProps) => {
  if (searchQuery) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No assets found
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-4">
        <Wallet className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
        No Wallets Yet
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
        Create your first wallet to start managing your crypto assets
      </p>
      <Button 
        variant="primary"
        size="sm"
        icon={<Plus className="w-4 h-4" />}
        onClick={onCreateWallet}
      >
        Create Wallet
      </Button>
    </div>
  )
}

export default EmptyWalletState
