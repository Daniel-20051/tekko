import { useState, useEffect, type FormEvent } from 'react'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import Checkbox from '../../../ui/Checkbox'
import Spinner from '../../../ui/Spinner'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../../../store/auth.store'
import { useLogin } from '../../../../hooks/useAuth'
import TwoFactorForm from './TwoFactorForm'

const Login_Form = () => {
  const { loginEmail, setLoginEmail } = useAuthStore()
  const loginMutation = useLogin()
  const [email, setEmail] = useState(loginEmail || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [apiError, setApiError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false)

  // Save email to store whenever it changes
  useEffect(() => {
    if (email) {
      setLoginEmail(email)
    }
  }, [email, setLoginEmail])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setApiError('')
    setEmailError('')
    setPasswordError('')
    
    // Custom validation
    let isValid = true
    
    if (!email || email.trim() === '') {
      setEmailError('Please enter your email address')
      isValid = false
    } else if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address')
      isValid = false
    }
    
    if (!password || password.trim() === '') {
      setPasswordError('Please enter your password')
      isValid = false
    }
    
    if (!isValid) {
      return
    }
    
    // Call login API
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          // Check if 2FA is required
          if ('requires2FA' in data && data.requires2FA) {
            setRequires2FA(true)
          }
        },
        onError: (error: unknown) => {
          // Handle API errors - extract from API response structure
          let errorMessage = 'Login failed. Please try again.'
          
          if (error instanceof Error) {
            // Error from api-client interceptor (already extracted)
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            // Handle axios error structure directly
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || errorMessage
          }
          
          setApiError(errorMessage)
        }
      }
    )
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked')
  }

  const handle2FABack = () => {
    setRequires2FA(false)
    setApiError('')
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
      {/* Forms Container - relative positioning for absolute children */}
      <div className="relative">
        {/* Login Form */}
        <div 
          className={`w-full transition-opacity duration-300 ease-out ${
            requires2FA 
              ? 'absolute top-0 left-0 right-0 opacity-0 pointer-events-none invisible' 
              : 'relative opacity-100 pointer-events-auto visible'
          }`}
        >
          {/* Header */}
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
              Welcome to TEKKO !
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
            if (apiError) setApiError('')
          }}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          error={passwordError}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
            if (apiError) setApiError('')
          }}
        />

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          
          <Link 
            to="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Login button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={loginMutation.isPending}
          icon={
            loginMutation.isPending ? (
              <Spinner size="sm" variant="white" />
            ) : (
              ""
            )
          }
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </Button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-xs font-medium">
            <span className="px-3 bg-white/80 dark:bg-dark-surface/80 text-gray-500 uppercase tracking-wider">Or continue with</span>
          </div>
        </div>

        {/* Google login */}
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleGoogleLogin}
          icon={
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Login with Google
        </Button>

        {/* Sign up link */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/create-account" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>
        </div>

        {/* 2FA Form */}
        <div 
          className={`w-full transition-all duration-300 ease-out ${
            requires2FA 
              ? 'relative opacity-100 translate-x-0 pointer-events-auto visible' 
              : 'absolute top-0 left-0 right-0 opacity-0 translate-x-8 pointer-events-none invisible'
          }`}
        >
          <TwoFactorForm
            email={email}
            password={password}
            loginMutation={loginMutation}
            isVisible={requires2FA}
            onBack={handle2FABack}
          />
        </div>
      </div>
    </div>
  )
}

export default Login_Form