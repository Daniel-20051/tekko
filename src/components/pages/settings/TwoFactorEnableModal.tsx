import { useState, useEffect, useCallback, useRef } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import CodeInput from '../../ui/CodeInput'
import { useEnableTwoFactor } from '../../../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { settingsKeys } from '../../../hooks/useSettings'

interface TwoFactorEnableModalProps {
  isOpen: boolean
  onClose: () => void
}

const TwoFactorEnableModal = ({ isOpen, onClose }: TwoFactorEnableModalProps) => {
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasCalledVerify = useRef(false)

  const queryClient = useQueryClient()
  const { mutate: enable2FA, isPending: isEnabling } = useEnableTwoFactor()

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVerificationCode(['', '', '', '', '', ''])
      setError('')
      setIsSubmitting(false)
      hasCalledVerify.current = false
    }
  }, [isOpen])

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
          if (response.success) {
            // Invalidate security status
            queryClient.invalidateQueries({ queryKey: settingsKeys.securityStatus() })
            onClose()
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
  }, [isSubmitting, isEnabling, enable2FA, queryClient, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enable Two-Factor Authentication" size="md">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enter the 6-digit code from your authenticator app to enable 2FA
          </p>
        </div>

        <div>
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
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isEnabling || isSubmitting}
            fullWidth
          >
            Cancel
          </Button>
        </div>

        {isEnabling || isSubmitting ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Spinner size="sm" variant="primary" />
            <span>Enabling 2FA...</span>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

export default TwoFactorEnableModal

