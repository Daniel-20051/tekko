import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import { useResetPassword } from '../../../../hooks/useAuth'
import { validatePassword, validatePasswordMatch } from '../../../../services/validation.service'

const ResetPasswordForm = () => {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_auth/reset-password' })
  const resetPasswordMutation = useResetPassword()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const token = search?.token as string | undefined

  // Trigger animation on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setPasswordError('')
    setConfirmPasswordError('')
    setApiError('')
    
    // Validate token
    if (!token) {
      setApiError('Reset token is missing. Please check your email link.')
      return
    }
    
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
    
    // Call reset password API
    resetPasswordMutation.mutate(
      { token, newPassword: password },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsSubmitted(true)
          }
        },
        onError: (error: unknown) => {
          // Handle API errors
          let errorMessage = 'Failed to reset password. Please try again.'
          
          if (error instanceof Error) {
            // Error from api-client interceptor (already extracted)
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            // Handle axios error structure directly
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
          }
          
          setApiError(errorMessage)
        }
      }
    )
  }

  // Success State
  if (isSubmitted && resetPasswordMutation.isSuccess) {
    return (
      <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Password Reset Successful
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // No Token State
  if (!token) {
    return (
      <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Token Missing
          </h2>
          <div className="p-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-6 max-w-sm text-center">
            Reset token is missing. Please check your email for the password reset link.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-6 max-w-sm">
            Make sure you clicked the complete reset link from your email.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate({ to: '/forgot-password' })}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Request New Link
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center cursor-pointer gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below. Make sure it's strong and secure.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
            if (apiError) setApiError('')
          }}
          required
          error={passwordError}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (confirmPasswordError) setConfirmPasswordError('')
            if (apiError) setApiError('')
          }}
          required
          error={confirmPasswordError}
        />

        {/* API Error Message */}
        {apiError && (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Reset Password Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={resetPasswordMutation.isPending}
        >
          {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  )
}

export default ResetPasswordForm

