import { useState, type FormEvent } from 'react'
import Button from '../../../ui/Button'
import Spinner from '../../../ui/Spinner'
import CodeInput from '../../../ui/CodeInput'
import type { UseMutationResult } from '@tanstack/react-query'
import type { VerifyDeviceCredentials, VerifyDeviceResponse } from '../../../../types/auth'

interface DeviceVerificationFormProps {
  email: string
  deviceName: string
  verifyDeviceMutation: UseMutationResult<VerifyDeviceResponse, unknown, VerifyDeviceCredentials, unknown>
  isVisible: boolean
  onBack: () => void
}

const DeviceVerificationForm = ({ 
  email, 
  deviceName,
  verifyDeviceMutation, 
  isVisible, 
  onBack 
}: DeviceVerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
  const [verificationError, setVerificationError] = useState('')

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Check if all fields are filled
    if (verificationCode.some(digit => !digit)) {
      setVerificationError('Please enter the complete 6-digit code')
      return
    }

    const code = verificationCode.join('')
    
    // Clear previous errors
    setVerificationError('')
    
    // Call verify device API
    verifyDeviceMutation.mutate(
      { email, verificationCode: code },
      {
        onError: (error: unknown) => {
          // Handle API errors
          let errorMessage = 'Invalid verification code. Please try again.'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
          }
          
          setVerificationError(errorMessage)
          // Reset code on error
          setVerificationCode(['', '', '', '', '', ''])
        }
      }
    )
  }

  const handleBack = () => {
    setVerificationCode(['', '', '', '', '', ''])
    setVerificationError('')
    onBack()
  }

  return (
    <div>
      <form onSubmit={handleVerificationSubmit} className="space-y-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Device Verification
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            We've sent a 6-digit verification code to your email
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Device: <span className="font-medium">{deviceName}</span>
          </p>
        </div>

        {/* Verification Code Inputs */}
        <CodeInput
          value={verificationCode}
          onChange={(code) => {
            setVerificationCode(code)
            if (verificationError) setVerificationError('')
          }}
          error={verificationError}
          autoFocus={isVisible}
          disabled={verifyDeviceMutation.isPending}
        />

        {/* Verify Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={verifyDeviceMutation.isPending || verificationCode.some(digit => !digit)}
          icon={
            verifyDeviceMutation.isPending ? (
              <Spinner size="sm" variant="white" />
            ) : (
              ""
            )
          }
        >
          {verifyDeviceMutation.isPending ? 'Verifying...' : 'Verify Device'}
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

export default DeviceVerificationForm

