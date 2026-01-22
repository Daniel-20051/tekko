import { useState, type FormEvent } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import { useSetPassword, useRequestPasswordOtp, useResendPasswordOtp } from '../../../hooks/useAuth'
import { validatePassword, validatePasswordMatch } from '../../../services/validation.service'

interface SetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const SetPasswordModal = ({ isOpen, onClose }: SetPasswordModalProps) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpSentMessage, setOtpSentMessage] = useState('')

  const setPasswordMutation = useSetPassword()
  const requestOtpMutation = useRequestPasswordOtp()
  const resendOtpMutation = useResendPasswordOtp()

  const handleRequestOtp = async () => {
    setApiError('')
    setOtpError('')
    setOtpSentMessage('')

    requestOtpMutation.mutate(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          setOtpSent(true)
          setOtpSentMessage('OTP sent to your email. Please check your inbox.')
        }
      },
      onError: (error: unknown) => {
        let errorMessage = 'Failed to send OTP. Please try again.'
        
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage
        } else if (typeof error === 'object' && error !== null) {
          const axiosError = error as { 
            response?: { 
              data?: { 
                error?: string
                message?: string
              }
            }
            message?: string
          }
          errorMessage = axiosError.response?.data?.error || 
                       axiosError.response?.data?.message || 
                       axiosError.message || 
                       errorMessage
        }
        
        setApiError(errorMessage)
      },
    })
  }

  const handleResendOtp = async () => {
    setApiError('')
    setOtpError('')
    setOtpSentMessage('')

    resendOtpMutation.mutate(undefined, {
      onSuccess: (data) => {
        if (data.success) {
          setOtpSentMessage('New OTP sent to your email. Previous OTP has been invalidated.')
        }
      },
      onError: (error: unknown) => {
        let errorMessage = 'Failed to resend OTP. Please try again.'
        
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage
        } else if (typeof error === 'object' && error !== null) {
          const axiosError = error as { 
            response?: { 
              data?: { 
                error?: string
                message?: string
              }
            }
            message?: string
          }
          errorMessage = axiosError.response?.data?.error || 
                       axiosError.response?.data?.message || 
                       axiosError.message || 
                       errorMessage
        }
        
        setApiError(errorMessage)
      },
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setPasswordError('')
    setConfirmPasswordError('')
    setOtpError('')
    setApiError('')
    setIsSuccess(false)
    
    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0])
      return
    }
    
    // Validate password match
    if (!validatePasswordMatch(password, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match')
      return
    }
    
    // Validate OTP
    if (!otp || otp.trim() === '') {
      setOtpError('OTP is required')
      return
    }
    
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpError('OTP must be a 6-digit number')
      return
    }
    
    // Call set password API
    setPasswordMutation.mutate(
      { newPassword: password, otp },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsSuccess(true)
            // Reset form
            setPassword('')
            setConfirmPassword('')
            setOtp('')
            setOtpSent(false)
            setOtpSentMessage('')
            // Close modal after 3 seconds
            setTimeout(() => {
              handleClose()
            }, 3000)
          }
        },
        onError: (error: unknown) => {
          let errorMessage = 'Failed to set password. Please try again.'
          
          try {
            if (error instanceof Error) {
              errorMessage = error.message || errorMessage
            } else if (typeof error === 'object' && error !== null) {
              const axiosError = error as { 
                response?: { 
                  data?: { 
                    error?: string
                    message?: string
                    code?: string
                  }
                }
                message?: string
              }
              
              // Check for specific error codes
              if (axiosError.response?.data?.code === 'OTP_REQUIRED') {
                errorMessage = 'Please request an OTP code first'
              } else if (axiosError.response?.data?.code === 'INVALID_OTP') {
                errorMessage = 'Invalid or expired OTP. Please request a new one.'
                setOtpError('Invalid or expired OTP')
              } else {
                errorMessage = axiosError.response?.data?.error || 
                             axiosError.response?.data?.message || 
                             axiosError.message || 
                             errorMessage
              }
            }
          } catch (err) {
            console.error('Error parsing set password error:', err)
          }
          
          setApiError(errorMessage)
        }
      }
    )
  }

  const handleClose = () => {
    onClose()
    // Reset form state
    setPassword('')
    setConfirmPassword('')
    setOtp('')
    setPasswordError('')
    setConfirmPasswordError('')
    setOtpError('')
    setApiError('')
    setIsSuccess(false)
    setOtpSent(false)
    setOtpSentMessage('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Set Password"
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Disclaimer */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This is for Google account users who want to set a password. You'll be able to login with either Google or email/password after setting a password.
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 hrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Password set successfully
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                You can now login with email/password or Google sign-in.
              </p>
            </div>
          </div>
        )}

        {apiError && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">{apiError}</p>
          </div>
        )}

        {otpSentMessage && (
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">{otpSentMessage}</p>
          </div>
        )}

        <Input
          label="Password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
            if (apiError) setApiError('')
          }}
          error={passwordError}
          required
        />

        {/* Password Requirements */}
        {password && (
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-1">
            <div className="flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span>Include uppercase, lowercase, & number</span>
            </div>
          </div>
        )}

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (confirmPasswordError) {
              if (validatePasswordMatch(password, e.target.value)) {
                setConfirmPasswordError('')
              }
            }
            if (apiError) setApiError('')
          }}
          error={confirmPasswordError}
          required
        />

        <div className="space-y-2">
          <Input
            label="OTP Code"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              // Only allow digits and limit to 6 characters
              const value = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(value)
              if (otpError) setOtpError('')
              if (apiError) setApiError('')
            }}
            error={otpError}
            required
            maxLength={6}
          />
          <div className="flex items-center gap-2">
            {!otpSent ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRequestOtp}
                disabled={requestOtpMutation.isPending}
                className="text-xs"
              >
                {requestOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                className="text-xs"
              >
                {resendOtpMutation.isPending ? 'Sending...' : 'Resend OTP'}
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={setPasswordMutation.isPending || isSuccess || !otpSent}
            className="flex-1"
          >
            {setPasswordMutation.isPending ? 'Setting Password...' : 'Set Password'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={setPasswordMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SetPasswordModal
