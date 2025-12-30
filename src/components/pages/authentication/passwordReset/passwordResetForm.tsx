import { useState, useEffect, type FormEvent } from 'react'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../../../store/auth.store'
import { validateEmail } from '../../../../services/validation.service'
import { useForgotPassword } from '../../../../hooks/useAuth'

const PasswordResetForm = () => {
  const navigate = useNavigate()
  const { loginEmail, setLoginEmail, clearLoginEmail } = useAuthStore()
  const forgotPasswordMutation = useForgotPassword()
  const [email, setEmail] = useState(loginEmail || '')
  const [emailError, setEmailError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Trigger animation on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load email from store on mount
  useEffect(() => {
    if (loginEmail) {
      setEmail(loginEmail)
    }
  }, [loginEmail])

  // Save email to store whenever it changes
  useEffect(() => {
    if (email) {
      setLoginEmail(email)
    }
  }, [email, setLoginEmail])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setEmailError('')
    setApiError('')
    
    // Validate email
    if (!email) {
      setEmailError('Email address is required')
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    // Call forgot password API
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsSubmitted(true)
            // Clear login email after successful submission
            clearLoginEmail()
          }
        },
        onError: (error: unknown) => {
          // Handle API errors
          let errorMessage = 'Failed to send reset link. Please try again.'
          
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

  if (isSubmitted) {
    return (
      <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
        {/* Success Message */}
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
              <svg 
                className="w-16 h-16 text-green-600 dark:text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We've sent a password reset link to:
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>

          {/* Back to Login */}
          <div className="pt-4">
            <Link to="/">
              <Button variant="primary" fullWidth>
                Back to Login
              </Button>
            </Link>
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
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
            if (apiError) setApiError('')
          }}
          required
          error={emailError}
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
          disabled={forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>

        
      </form>
    </div>
  )
}

export default PasswordResetForm