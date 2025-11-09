import { useState, useEffect, type FormEvent } from 'react'
import Button from '../../../ui/Button'
import CodeInput from '../../../ui/CodeInput'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '../../../../store/auth.store'

const ValidateLoginForm = () => {
  const navigate = useNavigate()
  const { clearFormData } = useAuthStore()
  const search = useSearch({ from: '/_auth/validate-login' })
  
  // Get email from route search params, store, or use default
  const { formData } = useAuthStore()
  const getEmail = () => {
    // Try to get from route search params first
    if (search?.email) return search.email as string
    
    // Try to get from store (sessionStorage)
    if (formData?.email) return formData.email
    
    return 'chidi@email.com' // Default fallback
  }
  
  const email = getEmail()
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60) // 60 seconds countdown
  const [canResend, setCanResend] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  // Trigger animation on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Check if all fields are filled
    if (code.some(digit => !digit)) {
      setCodeError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    
    // TODO: Implement verification logic
    const verificationCode = code.join('')
    console.log('Verifying code:', verificationCode)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      
      // Clear form data after successful verification
      clearFormData()
      
      // Navigate to dashboard or next step
      navigate({ to: '/dashboard' })
    }, 1500)
  }

  const handleResend = () => {
    if (!canResend) return
    
    // TODO: Implement resend logic
    console.log('Resending verification code to:', email)
    
    // Reset timer
    setResendTimer(60)
    setCanResend(false)
    setCode(['', '', '', '', '', ''])
    setCodeError('')
  }

  return (
    <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/create-account' })}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4 text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Email Address
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We sent a verification code to:
        </p>
        <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
          {email}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Verification Code Inputs */}
        <CodeInput
          value={code}
          onChange={(newCode) => {
            setCode(newCode)
            if (codeError) setCodeError('')
          }}
          error={codeError}
          autoFocus={true}
          disabled={isLoading}
        />

        {/* Verify Email Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={isLoading || code.some(digit => !digit)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          }
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Resend
              </button>
            ) : (
              <span className="font-semibold text-gray-500 dark:text-gray-500">
                Resend ({resendTimer}s)
              </span>
            )}
          </p>
        </div>
      </form>
    </div>
  )
}

export default ValidateLoginForm