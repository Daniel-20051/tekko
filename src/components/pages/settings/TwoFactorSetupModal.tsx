import { useState, useEffect, useCallback, useRef } from 'react'
import { Copy, Check, Loader2, Download, AlertCircle } from 'lucide-react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import CodeInput from '../../ui/CodeInput'
import { useSetupTwoFactor, useEnableTwoFactor } from '../../../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { settingsKeys } from '../../../hooks/useSettings'

interface TwoFactorSetupModalProps {
  isOpen: boolean
  onClose: () => void
}

// Format secret code in groups of 4 characters
const formatSecret = (secret: string): string => {
  return secret.match(/.{1,4}/g)?.join(' ') || secret
}

const TwoFactorSetupModal = ({ isOpen, onClose }: TwoFactorSetupModalProps) => {
  const [secret, setSecret] = useState<string>('')
  const [qrCode, setQrCode] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', ''])
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'setup' | 'verify' | 'backup-codes'>('setup')
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasCalledVerify = useRef(false)

  const queryClient = useQueryClient()
  const { mutate: setup2FA, isPending: isSettingUp } = useSetupTwoFactor()
  const { mutate: enable2FA, isPending: isEnabling } = useEnableTwoFactor()

  // Reset when modal opens
  useEffect(() => {
    if (isOpen && step === 'setup' && !secret) {
      setup2FA(undefined, {
        onSuccess: (response) => {
          if (response.success && 'data' in response) {
            setSecret(response.data.secret)
            setQrCode(response.data.qrCode)
            // otpauthUrl is available in response but not used in UI
          } else {
            setError('Failed to setup 2FA. Please try again.')
          }
        },
        onError: (error: Error) => {
          setError(error.message || 'Failed to setup 2FA. Please try again.')
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step])

  // Reset when modal closes or step changes
  useEffect(() => {
    if (!isOpen) {
      setSecret('')
      setQrCode('')
      setVerificationCode(['', '', '', '', '', ''])
      setBackupCodes([])
      setCopied(false)
      setStep('setup')
      setError('')
      setIsSubmitting(false)
      hasCalledVerify.current = false
    }
    // Reset verify flag when step changes away from verify
    if (step !== 'verify') {
      hasCalledVerify.current = false
    }
  }, [isOpen, step])

  const handleCopy = () => {
    if (secret) {
      navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleVerify = useCallback((code: string) => {
    // Prevent multiple calls
    if (hasCalledVerify.current || isSubmitting || isEnabling || code.length !== 6) return

    hasCalledVerify.current = true
    setIsSubmitting(true)
    setError('')

    enable2FA(
      { token: code },
      {
        onSuccess: (response) => {
          setIsSubmitting(false)
          hasCalledVerify.current = false
          if (response.success && 'data' in response) {
            // Store backup codes and move to backup codes step
            setBackupCodes(response.data.backupCodes)
            setStep('backup-codes')
          } else {
            setError('Invalid verification code. Please try again.')
            setVerificationCode(['', '', '', '', '', ''])
          }
        },
        onError: (error: Error) => {
          setIsSubmitting(false)
          hasCalledVerify.current = false
          setError(error.message || 'Invalid verification code. Please try again.')
          setVerificationCode(['', '', '', '', '', ''])
        },
      }
    )
  }, [isSubmitting, isEnabling, enable2FA])

  const handleDownloadBackupCodes = () => {
    const content = backupCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '2fa-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleBackupCodesComplete = () => {
    // Invalidate security status
    queryClient.invalidateQueries({ queryKey: settingsKeys.securityStatus() })
    onClose()
  }

  const getModalTitle = () => {
    switch (step) {
      case 'setup':
        return 'Setup Two-Factor Authentication'
      case 'verify':
        return 'Verify and Enable 2FA'
      case 'backup-codes':
        return 'Save Your Backup Codes'
      default:
        return 'Setup Two-Factor Authentication'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="lg">
      <div className="space-y-6">
        {step === 'setup' ? (
          <>
            {isSettingUp ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 dark:border-gray-700">
                    {qrCode && (
                      <img 
                        src={qrCode} 
                        alt="2FA QR Code" 
                        className="w-64 h-64"
                      />
                    )}
                  </div>
                </div>

                {/* Secret Code - Formatted in groups */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                    Or enter this code manually:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <code className="text-sm font-mono text-gray-900 dark:text-white tracking-wider">
                        {formatSecret(secret)}
                      </code>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setStep('verify')}
                    fullWidth
                  >
                    I've scanned the QR code
                  </Button>
                </div>
              </>
            )}
          </>
        ) : step === 'verify' ? (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter the 6-digit code from your authenticator app to verify and enable 2FA
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <CodeInput
              value={verificationCode}
              onChange={(code) => {
                setVerificationCode(code)
                if (error) setError('')
                // Reset verify flag if user changes the code
                if (code.some(digit => !digit)) {
                  hasCalledVerify.current = false
                }
              }}
              onComplete={handleVerify}
              error={error}
              autoFocus={true}
              disabled={isEnabling || isSubmitting}
            />

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('setup')
                  setVerificationCode(['', '', '', '', '', ''])
                  setError('')
                }}
                disabled={isEnabling}
                fullWidth
              >
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isEnabling}
                fullWidth
              >
                Cancel
              </Button>
            </div>

            {isEnabling && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enabling 2FA...</span>
              </div>
            )}
          </>
        ) : step === 'backup-codes' ? (
          <>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Two-Factor Authentication Enabled
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your account is now protected with 2FA
              </p>
            </div>

            {/* Warning about backup codes */}
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Save Your Backup Codes
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    These codes can be used to access your account if you lose your authenticator device. 
                    Save them in a secure location. Each code can only be used once.
                  </p>
                </div>
              </div>
            </div>

            {/* Backup Codes Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Your Backup Codes:
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadBackupCodes}
                  icon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <code className="text-sm font-mono text-gray-900 dark:text-white">
                      {code}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleBackupCodesComplete}
                fullWidth
              >
                I've Saved My Backup Codes
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  )
}

export default TwoFactorSetupModal

