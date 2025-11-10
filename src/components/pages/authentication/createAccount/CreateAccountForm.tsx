import { useState, useEffect, type FormEvent } from 'react'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import Checkbox from '../../../ui/Checkbox'
import { Link, useNavigate } from '@tanstack/react-router'
import { validateCreateAccountForm, validateEmail, validatePassword, validatePasswordMatch } from '../../../../services/validation.service'
import { disablePaste } from '../../../../services/input.service'
import { useAuthStore } from '../../../../store/auth.store'
import { useRegister, useResendVerification } from '../../../../hooks/useAuth'

const CreateAccountForm = () => {
  const navigate = useNavigate()
  const { formData, setFormData } = useAuthStore()
  const registerMutation = useRegister()
  const resendVerificationMutation = useResendVerification()
  
  const [email, setEmail] = useState(formData?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(formData?.agreeToTerms || false)
  
  // Save only email and agreeToTerms to store (no passwords for security)
  useEffect(() => {
    setFormData({
      email,
      agreeToTerms
    })
  }, [email, agreeToTerms, setFormData])
  
  // Field-level errors
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [resendTimer, setResendTimer] = useState(90) // 90 seconds countdown
  const [canResend, setCanResend] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState('')

  // Trigger animation on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset timer when success message is shown
  useEffect(() => {
    if (showSuccessMessage) {
      setResendTimer(90)
      setCanResend(false)
      setResendSuccess(false)
      setResendError('')
    }
  }, [showSuccessMessage])

  // Countdown timer for resend - starts when success message is shown
  useEffect(() => {
    if (showSuccessMessage && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showSuccessMessage && resendTimer === 0) {
      setCanResend(true)
    }
  }, [showSuccessMessage, resendTimer])
 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setApiError('')
    
    // Validate form using service
    const validation = validateCreateAccountForm({
      email,
      password,
      confirmPassword,
      agreeToTerms
    })
    
    if (!validation.isValid) {
      // Set field-level errors
      if (!email || !validateEmail(email)) {
        setEmailError('Please enter a valid email address')
      }
      
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.errors[0])
      }
      
      if (!validatePasswordMatch(password, confirmPassword)) {
        setConfirmPasswordError('Passwords do not match')
      }
      
      return
    }
    
    // Call register API
    registerMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          // Show success message instead of navigating
          setShowSuccessMessage(true)
        },
        onError: (error: unknown) => {
          // Handle API errors - extract from API response structure
          let errorMessage = 'Registration failed. Please try again.'
          
          if (error instanceof Error) {
            // Error from api-client interceptor (already extracted)
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            // Handle axios error structure directly
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.message || errorMessage
          }
          
          setApiError(errorMessage)
        }
      }
    )
  }

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    console.log('Google signup clicked')
  }

  const handleResendVerification = () => {
    if (!canResend || resendVerificationMutation.isPending) return
    
    setResendError('')
    setResendSuccess(false)
    
    resendVerificationMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setResendSuccess(true)
          setResendTimer(90)
          setCanResend(false)
        },
        onError: (error: unknown) => {
          let errorMessage = 'Failed to resend verification email. Please try again.'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage
          }
          
          setResendError(errorMessage)
        }
      }
    )
  }

  // Show success message if account was created successfully
  if (showSuccessMessage) {
    return (
      <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-left' : 'opacity-0'}`}>
        {/* Success Message */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verification Link Sent
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            We've sent a verification link to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>. Please check your email and click the link to verify your account.
          </p>
          
          {/* Resend Verification Section */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              Didn't receive the email?
            </p>
            {resendSuccess && (
              <div className="p-3 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-3">
                Verification email sent successfully!
              </div>
            )}
            {resendError && (
              <div className="p-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-3">
                {resendError}
              </div>
            )}
            {canResend ? (
              <button
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendVerificationMutation.isPending ? 'Sending...' : 'Click here to resend'}
              </button>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Resend available in {resendTimer}s
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowSuccessMessage(false)
                setPassword('')
                setConfirmPassword('')
              }}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-left' : 'opacity-0'}`}>
     

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Create Your Free Account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Start your journey with the most secure crypto exchange.
        </p>
      </div>


      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          required
          error={emailError}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter a strong password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
            if (confirmPasswordError && validatePasswordMatch(e.target.value, confirmPassword)) {
              setConfirmPasswordError('')
            }
          }}
          required
          error={passwordError}
        />

        {/* Password Requirements */}
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-1">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
            <span>At least 8 characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
            <span>Include uppercase, lowercase, & number</span>
          </div>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (confirmPasswordError) {
              if (validatePasswordMatch(password, e.target.value)) {
                setConfirmPasswordError('')
              }
            }
          }}
          onPaste={disablePaste}
          required
          error={confirmPasswordError}
        />

        {/* Terms & Conditions */}
        <div className="flex items-start gap-2">
          <Checkbox
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-0.5"
          />
          <label className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            I agree to the{' '}
            <a
              href="/terms-conditions"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Terms & Conditions
            </a>
          </label>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Create Account button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={registerMutation.isPending || !agreeToTerms}
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs font-medium">
            <span className="px-3 bg-white/80 dark:bg-dark-surface/80 text-gray-500 uppercase tracking-wider">OR</span>
          </div>
        </div>

        {/* Google signup */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleGoogleSignup}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          }
        >
          Sign up with Google
        </Button>

        {/* Login link */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default CreateAccountForm