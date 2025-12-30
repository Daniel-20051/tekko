import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { useGoogleOAuthCallback, useLinkGoogleAccount } from '../../hooks/useAuth'
import DeviceVerificationForm from '../../components/pages/authentication/login/DeviceVerificationForm'
import { useVerifyDevice } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export const Route = createFileRoute('/_auth/google-callback')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      code: (search.code as string) || undefined,
      state: (search.state as string) || undefined,
    }
  },
  component: GoogleCallbackPage,
})

function GoogleCallbackPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_auth/google-callback' })
  const [error, setError] = useState<string | null>(null)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [requiresAccountLinking, setRequiresAccountLinking] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [linkingData, setLinkingData] = useState<{
    email: string
    userId: number
    linkingToken: string
    message: string
    code: string
    state: string
  } | null>(null)

  const googleCallbackMutation = useGoogleOAuthCallback()
  const verifyDeviceMutation = useVerifyDevice()
  const linkGoogleAccountMutation = useLinkGoogleAccount()

  useEffect(() => {
    const code = search.code
    const state = search.state

    if (!code || !state) {
      setError('Invalid callback parameters. Please try signing in again.')
      return
    }

    // Verify state matches what we stored
    const storedState = sessionStorage.getItem('google_oauth_state')
    if (state !== storedState) {
      setError('Security verification failed. Please try signing in again.')
      return
    }

    // Remove state from storage (one-time use)
    sessionStorage.removeItem('google_oauth_state')

    // Exchange code for tokens
    googleCallbackMutation.mutate(
      { code, state },
      {
        onSuccess: (response) => {
          if (response.success && 'data' in response) {
            const data = response.data as any
            
            // Check if account linking is required
            if (data.requiresAction && data.action === 'link_google_or_password') {
              setRequiresAccountLinking(true)
              setLinkingData({
                email: data.email,
                userId: data.userId,
                linkingToken: data.linkingToken,
                message: data.message,
                code: code || '',
                state: state || '',
              })
              return
            }

            // Check if device verification is required
            if ('requiresDeviceVerification' in response.data && response.data.requiresDeviceVerification) {
              setRequiresVerification(true)
              setDeviceName(response.data.deviceName)
              // Try to get email from user data if available
              // Note: We might need to store email temporarily or get it from the response
              return
            }

            // If we have accessToken, navigation is handled by the hook
            if ('accessToken' in response.data) {
              // Navigation happens in the hook
            }
          }
        },
        onError: (error: unknown) => {
          let errorMessage = 'Authentication failed. Please try again.'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
          }
          
          setError(errorMessage)
        },
      }
    )
  }, []) // Only run once on mount

  const handleDeviceVerificationBack = () => {
    setRequiresVerification(false)
    setDeviceName('')
    navigate({ to: '/' })
  }

  const handleLinkGoogleAccount = () => {
    if (!linkingData) return
    // Show password form
    setShowPasswordForm(true)
  }

  const handleSubmitLinking = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!linkingData) return
    
    // Clear previous errors
    setPasswordError('')
    setError(null)
    
    // Validate password
    if (!password || password.trim() === '') {
      setPasswordError('Please enter your password')
      return
    }
    
    // Call link API
    linkGoogleAccountMutation.mutate(
      {
        password,
        code: linkingData.code,
        state: linkingData.state,
      },
      {
        onError: (error: unknown) => {
          let errorMessage = 'Failed to link Google account. Please try again.'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
          }
          
          setError(errorMessage)
        },
      }
    )
  }

  const handleSignInWithPassword = () => {
    if (!linkingData) return
    
    // Redirect to login page with the email pre-filled
    navigate({ 
      to: '/',
      search: { email: linkingData.email }
    })
  }

  const handleBackToOptions = () => {
    setShowPasswordForm(false)
    setPassword('')
    setPasswordError('')
    setError(null)
  }

  if (requiresAccountLinking && linkingData) {
    // Show password form for linking
    if (showPasswordForm) {
      return (
        <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Link Google Account</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your password to link your Google account
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Email: <span className="font-medium">{linkingData.email}</span>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmitLinking} className="space-y-4">
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                placeholder="Enter your password"
                disabled={linkGoogleAccountMutation.isPending}
              />

              <div className="space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={linkGoogleAccountMutation.isPending}
                >
                  {linkGoogleAccountMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Linking...
                    </>
                  ) : (
                    'Link Google Account'
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleBackToOptions}
                  className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  disabled={linkGoogleAccountMutation.isPending}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }

    // Show initial options
    return (
      <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Already Exists</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {linkingData.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Email: <span className="font-medium">{linkingData.email}</span>
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLinkGoogleAccount}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Link Google Account
            </button>
            
            <button
              onClick={handleSignInWithPassword}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Sign in with Password
            </button>

            <button
              onClick={() => navigate({ to: '/', search: {} })}
              className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (requiresVerification) {
    return (
      <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <DeviceVerificationForm
          email={''}
          deviceName={deviceName}
          verifyDeviceMutation={verifyDeviceMutation}
          isVisible={true}
          onBack={handleDeviceVerificationBack}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authentication Failed</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  )
}
