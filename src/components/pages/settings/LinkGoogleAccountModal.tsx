import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import Input from '../../ui/Input'
import { useGoogleOAuthUrl, useLinkGoogleAccount } from '../../../hooks/useAuth'

interface LinkGoogleAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

const LinkGoogleAccountModal = ({ isOpen, onClose }: LinkGoogleAccountModalProps) => {
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [linkingData, setLinkingData] = useState<{ code: string; state: string } | null>(null)

  const { refetch: getGoogleOAuthUrl, isFetching: isGettingGoogleUrl } = useGoogleOAuthUrl()
  const linkGoogleAccountMutation = useLinkGoogleAccount()

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setPassword('')
      setPasswordError('')
      setApiError('')
      setLinkingData(null)
    }
  }, [isOpen])

  // Check if we have linking data from sessionStorage (from OAuth callback)
  useEffect(() => {
    if (isOpen) {
      const storedData = sessionStorage.getItem('google_linking_data')
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          if (data.code && data.state) {
            setLinkingData({ code: data.code, state: data.state })
            sessionStorage.removeItem('google_linking_data')
          }
        } catch (error) {
          console.error('Failed to parse linking data:', error)
        }
      }
    }
  }, [isOpen])

  const handleStartLinking = async () => {
    setApiError('')
    
    try {
      const response = await getGoogleOAuthUrl()
      
      if (response.data?.success && response.data.data.authUrl) {
        // Store state for verification
        sessionStorage.setItem('google_oauth_state', response.data.data.state)
        sessionStorage.setItem('google_linking_flow', 'true')
        
        // Redirect to Google OAuth
        window.location.href = response.data.data.authUrl
      }
    } catch (error) {
      let errorMessage = 'Failed to get Google OAuth URL'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        const axiosError = error as { response?: { data?: { error?: string; message?: string } } }
        errorMessage = axiosError.response?.data?.error || errorMessage
      }
      
      setApiError(errorMessage)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!linkingData) {
      setApiError('Missing linking data. Please try again.')
      return
    }
    
    // Clear previous errors
    setPasswordError('')
    setApiError('')
    
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
        onSuccess: () => {
          // Close modal on success
          onClose()
        },
        onError: (error: unknown) => {
          let errorMessage = 'Failed to link Google account. Please try again.'
          
          if (error instanceof Error) {
            errorMessage = error.message
          } else if (typeof error === 'object' && error !== null) {
            const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
            errorMessage = axiosError.response?.data?.error || axiosError.response?.data?.message || errorMessage
          }
          
          setApiError(errorMessage)
        },
      }
    )
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-dark-surface rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-primary/50"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-primary/30 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Link Google Account
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              disabled={linkGoogleAccountMutation.isPending || isGettingGoogleUrl}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {apiError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
              </div>
            )}

            {linkingData ? (
              // Show password form if we have linking data
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Enter your password to confirm linking your Google account.
                  </p>
                </div>

                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  placeholder="Enter your password"
                  disabled={linkGoogleAccountMutation.isPending}
                  autoFocus
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={linkGoogleAccountMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={linkGoogleAccountMutation.isPending}
                  >
                    {linkGoogleAccountMutation.isPending ? (
                      <>
                        <Spinner size="sm" variant="white" className="mr-2" />
                        Linking...
                      </>
                    ) : (
                      'Link Account'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              // Show initial linking button
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Connect Your Google Account
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Link your Google account to enable sign-in with Google and enhance your account security.
                  </p>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleStartLinking}
                    className="w-full"
                    disabled={isGettingGoogleUrl}
                    icon={
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    }
                  >
                    {isGettingGoogleUrl ? (
                      <>
                        <Spinner size="sm" variant="white" className="mr-2" />
                        Connecting...
                      </>
                    ) : (
                      'Continue with Google'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="w-full"
                    disabled={isGettingGoogleUrl}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default LinkGoogleAccountModal

