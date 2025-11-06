import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react'
import Button from '../../../ui/Button'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useAuthStore } from '../../../../store/auth.store'

const ValidateLoginForm = () => {
  const navigate = useNavigate()
  const { clearFormData } = useAuthStore()
  const search = useSearch({ from: '/_auth/validate-login' })
  
  // Get email from route search params or localStorage, or use default
  const getEmail = () => {
    // Try to get from route search params first
    if (search?.email) return search.email as string
    
    // Try to get from localStorage (set during account creation)
    const storedEmail = localStorage.getItem('pendingVerificationEmail')
    if (storedEmail) return storedEmail
    
    return 'chidi@email.com' // Default fallback
  }
  
  const email = getEmail()
  
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60) // 60 seconds countdown
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newCode = [...code]
        digits.forEach((digit, i) => {
          if (i < 6) {
            newCode[i] = digit
          }
        })
        setCode(newCode)
        // Focus the last filled input or the last input
        const lastFilledIndex = Math.min(digits.length - 1, 5)
        inputRefs.current[lastFilledIndex]?.focus()
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Check if all fields are filled
    if (code.some(digit => !digit)) {
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
    inputRefs.current[0]?.focus()
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
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
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`
                w-12 h-12
                text-center
                text-lg font-semibold
                rounded-lg
                border-2
                bg-white dark:bg-[#2A2A2A]
                border-gray-300 dark:border-[#374151]
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                transition-all duration-200
                ${digit ? 'border-primary dark:border-primary' : ''}
              `}
            />
          ))}
        </div>

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