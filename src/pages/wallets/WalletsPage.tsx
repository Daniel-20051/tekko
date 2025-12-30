import { useState } from 'react'
import AssetsSidebar from '../../components/pages/wallets/AssetsSidebar'
import PortfolioCard from '../../components/pages/wallets/PortfolioCard'
import WalletContent from '../../components/pages/wallets/WalletContent'
import TransactionDetails from '../../components/pages/wallets/TransactionDetails'

const WalletsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState('bitcoin')
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>('tx-1')

  return (
    <div className="flex gap-3 h-[calc(100vh-100px)] overflow-hidden">
      {/* Left Sidebar - Assets List with Search */}
      <AssetsSidebar selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} />

      {/* Center Column - Portfolio Card + Transactions */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Portfolio Card */}
        <PortfolioCard />

        {/* Transaction History */}
        <WalletContent 
          selectedTransaction={selectedTransaction}
          onSelectTransaction={setSelectedTransaction}
        />
      </div>

      {/* Right Column - Buy Details */}
      <TransactionDetails selectedTransaction={selectedTransaction} />
    </div>
  )
}

export default WalletsPage

