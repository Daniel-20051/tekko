import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useVerifyEmail } from '../../../../hooks/useAuth'
import Spinner from '../../../ui/Spinner'

const VerifyEmailForm = () => {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_auth/verify-email' })
  const verifyEmailMutation = useVerifyEmail()
  
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState('')
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false)

  // Trigger animation on mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-verify when component mounts with token
  useEffect(() => {
    const token = search?.token as string | undefined
    
    if (token && !hasAttemptedVerification && !verifyEmailMutation.isPending && !verifyEmailMutation.isSuccess) {
      setHasAttemptedVerification(true)
      verifyEmailMutation.mutate(
        { token },
        {
          onSuccess: (data) => {
            if (!data.success) {
              // Handle error response
              const errorData = data as { error?: string; message?: string }
              setError(errorData.error || errorData.message || 'Email verification failed. Please try again.')
            }
          },
          onError: (error: unknown) => {
            // Handle API errors
            let errorMessage = 'Email verification failed. Please try again.'
            
            if (error instanceof Error) {
              errorMessage = error.message
            } else if (typeof error === 'object' && error !== null) {
              const axiosError = error as { response?: { data?: { error?: string; message?: string } }; message?: string }
              errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.error || errorMessage
            }
            
            setError(errorMessage)
          },
        }
      )
    } else if (!token && !hasAttemptedVerification) {
      setError('Verification token is missing. Please check your email link.')
      setHasAttemptedVerification(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`w-full max-w-md mx-auto p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 ${isMounted ? 'animate-fade-in-right' : 'opacity-0'}`}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verifying Your Email
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {verifyEmailMutation.isPending
            ? 'Please wait while we verify your email address...'
            : error
            ? 'Verification failed'
            : verifyEmailMutation.isSuccess
            ? 'Your email has been verified successfully!'
            : 'Waiting for verification...'}
        </p>
      </div>

      {/* Loading State */}
      {verifyEmailMutation.isPending && (
        <div className="flex flex-col items-center justify-center py-8">
          <Spinner size="xl" variant="primary" className="mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Verifying...</p>
        </div>
      )}

      {/* Success State */}
      {!verifyEmailMutation.isPending && !error && verifyEmailMutation.isSuccess && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Email Verified
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
            Your email address has been successfully verified. You can now proceed to login and start using your account.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-6">
            Click the button below to go to the login page.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-4 ">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Verification Failed
          </h2>
          <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6 max-w-sm text-center">
            {error}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-6 max-w-sm">
            Please try creating a new account or contact support if you continue to experience issues.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate({ to: '/create-account' })}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* No Token State */}
      {!search?.token && !error && (
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
            Verification token is missing. Please check your email for the verification link.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-6 max-w-sm">
            Make sure you clicked the complete verification link from your email.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate({ to: '/create-account' })}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyEmailForm

