import { useState, type FormEvent } from 'react'
import Button from '../../../ui/Button'
import Spinner from '../../../ui/Spinner'
import CodeInput from '../../../ui/CodeInput'
import type { UseMutationResult } from '@tanstack/react-query'
import type { LoginCredentials, LoginResponse } from '../../../../types/auth'

interface TwoFactorFormProps {
  email: string
  password: string
  loginMutation: UseMutationResult<LoginResponse, unknown, LoginCredentials, unknown>
  isVisible: boolean
  onBack: () => void
  onDeviceVerificationRequired?: (deviceName: string) => void
}

const TwoFactorForm = ({ 
  email, 
  password, 
  loginMutation, 
  isVisible, 
  onBack,
  onDeviceVerificationRequired
}: TwoFactorFormProps) => {
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', ''])
  const [twoFactorError, setTwoFactorError] = useState('')

  const handle2FASubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Check if all fields are filled
    if (twoFactorCode.some(digit => !digit)) {
      setTwoFactorError('Please enter the complete 6-digit code')
      return
    }

    const code = twoFactorCode.join('')
    
    // Clear previous errors
    setTwoFactorError('')
    
    // Call login API with 2FA token
    loginMutation.mutate(
      { email, password, twoFactorToken: code },
      {
        onSuccess: (data) => {
          // Check if device verification is required after 2FA
          if (data.success && 'requiresDeviceVerification' in data && data.requiresDeviceVerification) {
            const deviceName = (data as { deviceName?: string }).deviceName || 'Unknown Device'
            if (onDeviceVerificationRequired) {
              onDeviceVerificationRequired(deviceName)
            }
            return
          }
        },
        onError: (error: unknown) => {
          // Handle API errors
          let errorMessage = 'Invalid verification code. Please try again.'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
          }
          
          setTwoFactorError(errorMessage)
          // Reset code on error
          setTwoFactorCode(['', '', '', '', '', ''])
        }
      }
    )
  }

  const handleBack = () => {
    setTwoFactorCode(['', '', '', '', '', ''])
    setTwoFactorError('')
    onBack()
  }

  return (
    <div>
      <form onSubmit={handle2FASubmit} className="space-y-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* Verification Code Inputs */}
        <CodeInput
          value={twoFactorCode}
          onChange={(code) => {
            setTwoFactorCode(code)
            if (twoFactorError) setTwoFactorError('')
          }}
          error={twoFactorError}
          autoFocus={isVisible}
          disabled={loginMutation.isPending}
        />

        {/* Verify Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={loginMutation.isPending || twoFactorCode.some(digit => !digit)}
          icon={
            loginMutation.isPending ? (
              <Spinner size="sm" variant="white" />
            ) : (
              ""
            )
          }
        >
          {loginMutation.isPending ? 'Verifying...' : 'Verify Code'}
        </Button>

        {/* Back to login */}
        <div className="text-center ">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-medium cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </form>
    </div>
  )
}

export default TwoFactorForm

