import { AlertTriangle, CheckCircle2, Copy } from 'lucide-react'
import Spinner from '../../../components/ui/Spinner'
import Button from '../../../components/ui/Button'
import type { DepositAddressData } from '../../../types/wallet'

interface CryptoDepositDetailsProps {
  data: DepositAddressData | undefined
  currency: string
  isLoading: boolean
  error: any
  copied: string | null
  onCopy: (text: string, type: string) => void
}

const CryptoDepositDetails = ({ data, currency, isLoading, error, copied, onCopy }: CryptoDepositDetailsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner size="lg" variant="primary" className="mb-3" />
        <p className="text-xs text-gray-600 dark:text-gray-400">Loading deposit address...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to Load Deposit Address
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-4">
          Failed to load deposit address. Please try again.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.qrCode && (
        <div className="flex flex-col items-center">
          <div className="bg-white p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <img
              src={data.qrCode}
              alt="Deposit QR Code"
              className="w-32 h-32"
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1.5 text-center">
            Scan this QR code to deposit {currency}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Deposit Address
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {data.address?.address || ''}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={copied === 'address' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            onClick={() => onCopy(data.address?.address || '', 'address')}
            className="shrink-0"
          >
            {copied === 'address' ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      {data.memo && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Memo / Tag
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {String(data.memo || '')}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={copied === 'memo' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              onClick={() => onCopy(String(data.memo || ''), 'memo')}
              className="shrink-0"
            >
              {copied === 'memo' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            ⚠️ You must include this memo when sending {currency}
          </p>
        </div>
      )}

      {data.warnings && data.warnings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Important Warnings
            </h3>
          </div>
          <div className="space-y-2">
            {data.warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {warning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Always verify the address before sending. Sending to the wrong address may result in permanent loss of funds.
        </p>
      </div>
    </div>
  )
}

export default CryptoDepositDetails
