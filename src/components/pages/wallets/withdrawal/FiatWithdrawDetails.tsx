import NGNWithdrawFlow from './NGNWithdrawFlow'

interface FiatWithdrawDetailsProps {
  currency: string
  availableBalance: string
}

const FiatWithdrawDetails = ({ currency, availableBalance }: FiatWithdrawDetailsProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <NGNWithdrawFlow availableBalance={availableBalance} currency={currency} />
    </div>
  )
}

export default FiatWithdrawDetails
