import { CheckCircle2, Copy } from 'lucide-react'
import Button from '../../../components/ui/Button'
import type { DepositAccountData } from '../../../types/wallet'

interface FiatDepositDetailsProps {
  data: DepositAccountData
  copied: string | null
  onCopy: (text: string, type: string) => void
}

const FiatDepositDetails = ({ data, copied, onCopy }: FiatDepositDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
              Deposit Account Ready
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              {data.instructions}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
            Bank Name
          </label>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.bank}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
            Account Number
          </label>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
              {data.accountNumber}
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={copied === 'account' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              onClick={() => onCopy(data.accountNumber, 'account')}
              className="shrink-0"
            >
              {copied === 'account' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
          <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 block">
            Account Name
          </label>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.accountName}
          </p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Transfer NGN to this account. Your balance will be credited automatically after the transfer is confirmed.
        </p>
      </div>
    </div>
  )
}

export default FiatDepositDetails
