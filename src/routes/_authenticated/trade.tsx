import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const TradePageComponent = lazy(() => 
  Promise.resolve({
    default: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Trade
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buy and sell cryptocurrencies
          </p>
        </div>
      </div>
    )
  })
)

export const Route = createFileRoute('/_authenticated/trade')({
  component: TradePageComponent,
})
