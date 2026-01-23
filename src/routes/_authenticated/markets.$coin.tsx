import { createFileRoute } from '@tanstack/react-router'
import CoinDetailPage from '../../pages/markets/CoinDetailPage'

export const Route = createFileRoute('/_authenticated/markets/$coin')({
  component: CoinDetailPageWrapper,
})

function CoinDetailPageWrapper() {
  const { coin } = Route.useParams()
  
  if (!coin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            No coin parameter provided
          </p>
        </div>
      </div>
    )
  }
  
  return <CoinDetailPage coin={coin} />
}
