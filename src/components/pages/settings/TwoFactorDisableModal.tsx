import { useState, useEffect } from 'react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import Input from '../../ui/Input'
import CodeInput from '../../ui/CodeInput'
import { useDisableTwoFactor } from '../../../hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { settingsKeys } from '../../../hooks/useSettings'

interface TwoFactorDisableModalProps {
  isOpen: boolean
  onClose: () => void
}

const TwoFactorDisableModal = ({ isOpen, onClose }: TwoFactorDisableModalProps) => {
  const [step, setStep] = useState<'password' | 'otp'>('password')
  const [password, setPassword] = useState('')
  const [twoFactorToken, setTwoFactorToken] = useState<string[]>(['', '', '', '', '', ''])
  const [errors, setErrors] = useState<{ password?: string; token?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: disable2FA, isPending } = useDisableTwoFactor()

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('password')
      setPassword('')
      setTwoFactorToken(['', '', '', '', '', ''])
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handlePasswordNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password
    if (!password) {
      setErrors({ password: 'Password is required' })
      return
    }

    setErrors({})
    setStep('otp')
  }

  const handleOtpComplete = (code: string) => {
    if (code.length !== 6 || isSubmitting || isPending) return

    setIsSubmitting(true)
    setErrors({})

    disable2FA(
      { password, twoFactorToken: code },
      {
        onSuccess: (response) => {
          setIsSubmitting(false)
          if (response.success) {
            // Invalidate security status
            queryClient.invalidateQueries({ queryKey: settingsKeys.securityStatus() })
            onClose()
          } else {
            setErrors({ general: 'Failed to disable 2FA. Please try again.' })
            setTwoFactorToken(['', '', '', '', '', ''])
          }
        },
        onError: (error: Error) => {
          setIsSubmitting(false)
          setErrors({ general: error.message || 'Failed to disable 2FA. Please check your credentials and try again.' })
          setTwoFactorToken(['', '', '', '', '', ''])
        },
      }
    )
  }

  const handleClose = () => {
    if (!isPending && !isSubmitting) {
      setStep('password')
      setPassword('')
      setTwoFactorToken(['', '', '', '', '', ''])
      setErrors({})
      onClose()
    }
  }

  const getModalTitle = () => {
    return step === 'password' ? 'Disable Two-Factor Authentication' : 'Enter 2FA Code'
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getModalTitle()} size="md">
      <div className="space-y-6">
        {step === 'password' ? (
          <form onSubmit={handlePasswordNext} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter your password to continue disabling two-factor authentication
              </p>
            </div>

            {errors.password && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              </div>
            )}

            <div>
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: undefined })
                }}
                error={errors.password}
                disabled={isPending || isSubmitting}
                autoFocus={true}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending || isSubmitting}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isPending || isSubmitting || !password}
                fullWidth
              >
                Next
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter the 6-digit code from your authenticator app to disable 2FA
              </p>
            </div>

            <div>
              <CodeInput
                value={twoFactorToken}
                onChange={(code) => {
                  setTwoFactorToken(code)
                  if (errors.general) setErrors({ ...errors, general: undefined })
                }}
                onComplete={handleOtpComplete}
                error={errors.general}
                disabled={isPending || isSubmitting}
                autoFocus={true}
              />
            </div>

            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending || isSubmitting}
                fullWidth
              >
                Cancel
              </Button>
            </div>

            {isPending || isSubmitting ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Spinner size="sm" variant="primary" />
                <span>Disabling 2FA...</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default TwoFactorDisableModal

