import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { getDepositAddress } from '../../../api/wallet.api'
import { useCoinImage } from '../../../hooks/useCoinImage'
import CryptoImage from '../../ui/CryptoImage'
import Spinner from '../../ui/Spinner'
import Button from '../../ui/Button'

interface DepositAddressModalProps {
  isOpen: boolean
  onClose: () => void
  currency: string
}

const DepositAddressModal = ({ isOpen, onClose, currency }: DepositAddressModalProps) => {
  const [copied, setCopied] = useState(false)
  const [copiedMemo, setCopiedMemo] = useState(false)

  const { data: depositData, isLoading, error } = useQuery({
    queryKey: ['depositAddress', currency],
    queryFn: () => getDepositAddress(currency),
    enabled: isOpen && !!currency,
    retry: false,
  })

  // Clean error message to remove "Redbiller"
  const getCleanErrorMessage = (error: any): string => {
    if (!error) return 'Service temporarily unavailable. Please try again later.'
    
    let errorMessage = ''
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error?.message) {
      errorMessage = error.message
    } else if (error?.error) {
      errorMessage = error.error
    }
    
    // Remove "Redbiller" (case insensitive) and clean up
    errorMessage = errorMessage.replace(/redbiller/gi, '').trim()
    
    // Standardize service unavailable messages
    if (errorMessage.toLowerCase().includes('service temporarily unavailable') || 
        errorMessage.toLowerCase().includes('temporarily unavailable')) {
      return 'Service temporarily unavailable. Please try again later.'
    }
    
    return errorMessage || 'Service temporarily unavailable. Please try again later.'
  }

  const imageUrl = useCoinImage(currency)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleCopyAddress = async () => {
    if (depositData?.address?.address) {
      await navigator.clipboard.writeText(depositData.address.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyMemo = async () => {
    if (depositData?.memo) {
      await navigator.clipboard.writeText(depositData.memo)
      setCopiedMemo(true)
      setTimeout(() => setCopiedMemo(false), 2000)
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              max-w-lg
              w-[calc(100%-2rem)] sm:w-full
              bg-white dark:bg-dark-surface
              rounded-xl border border-gray-200 dark:border-primary/50
              shadow-2xl z-50
              max-h-[90vh] overflow-hidden flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-primary/50">
              <div className="flex items-center gap-3">
                <CryptoImage 
                  symbol={currency.toUpperCase()}
                  imageUrl={imageUrl}
                  size="lg"
                  className="rounded-lg"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Deposit {currency.toUpperCase()}
                  </h2>
                  {(depositData?.address?.network || depositData?.network) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {depositData.address?.network || depositData.network || ''}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner size="xl" variant="primary" className="mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Loading deposit address...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Unable to Load Deposit Address
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
                    {getCleanErrorMessage(error)}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </div>
              ) : depositData ? (
                <div className="space-y-6">
                  {/* QR Code */}
                  {depositData.qrCode && (
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={depositData.qrCode}
                          alt="Deposit QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Scan this QR code to deposit {currency.toUpperCase()}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Deposit Address
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                          {depositData.address?.address || ''}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        onClick={handleCopyAddress}
                        className="shrink-0"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  {/* Memo (if exists) */}
                  {depositData.memo && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-900 dark:text-white">
                        Memo / Tag
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-mono text-gray-900 dark:text-white">
                            {String(depositData.memo || '')}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={copiedMemo ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          onClick={handleCopyMemo}
                          className="shrink-0"
                        >
                          {copiedMemo ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        ⚠️ You must include this memo when sending {currency.toUpperCase()}
                      </p>
                    </div>
                  )}

                  {/* Warnings */}
                  {depositData.warnings && depositData.warnings.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Important Warnings
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {depositData.warnings.map((warning, index) => (
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

                  {/* Additional Info */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>Note:</strong> Always verify the address before sending. Sending to the wrong address may result in permanent loss of funds.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

export default DepositAddressModal
