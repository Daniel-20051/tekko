import WalletCard from './WalletCard'

const walletsData = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    balance: '0.00521 BTC',
    ngnValue: 150000,
    icon: '₿'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '0.0125 ETH',
    ngnValue: 40000,
    icon: 'Ξ'
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    balance: '60.50 USDT',
    ngnValue: 60000,
    icon: '₮'
  },
  {
    name: 'Nigerian Naira',
    symbol: 'NGN',
    balance: '₦0.00',
    ngnValue: 0,
    icon: '₦'
  }
]

const WalletsSection = () => {
  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Your Wallets
      </h2>
      
      <div className="space-y-2">
        {walletsData.map((wallet) => (
          <WalletCard key={wallet.symbol} {...wallet} />
        ))}
      </div>
    </div>
  )
}

export default WalletsSection


