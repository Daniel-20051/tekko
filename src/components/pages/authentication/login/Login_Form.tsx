import { useState, useEffect, type FormEvent } from 'react'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import Checkbox from '../../../ui/Checkbox'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../../../../store/auth.store'

const Login_Form = () => {
  const { loginEmail, setLoginEmail } = useAuthStore()
  const [email, setEmail] = useState(loginEmail || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Save email to store whenever it changes
  useEffect(() => {
    if (email) {
      setLoginEmail(email)
    }
  }, [email, setLoginEmail])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implement login logic
    console.log({ email, password, rememberMe })
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked')
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
      {/* Header */}
      <div className="mb-5 text-center">
        <h1 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
          Welcome to TEKKO !
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Email"
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

        {/* Login button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={isLoading}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          }
        >
          {isLoading ? 'Logging in...' : 'Login'}
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
  )
}

export default Login_Form