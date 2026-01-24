import { useState, type FormEvent } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import Spinner from '../../ui/Spinner'
import Modal from '../../ui/Modal'
import { useSubmitBvn } from '../../../hooks/useKyc'

interface SubmitBvnModalProps {
  isOpen: boolean
  onClose: () => void
}

const SubmitBvnModal = ({ isOpen, onClose }: SubmitBvnModalProps) => {
  const [bvn, setBvn] = useState('')
  const [bvnError, setBvnError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [verifiedName, setVerifiedName] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const submitBvnMutation = useSubmitBvn()

  const validateBVN = (value: string): { valid: boolean; cleaned?: string; error?: string } => {
    // Remove any spaces or dashes
    const cleaned = value.replace(/[\s-]/g, '')
    
    // Check if exactly 11 digits
    if (!/^\d{11}$/.test(cleaned)) {
      return {
        valid: false,
        error: "BVN must be exactly 11 digits"
      }
    }
    
    return { valid: true, cleaned }
  }

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '')
    // Limit to 11 digits
    const limited = digitsOnly.slice(0, 11)
    setBvn(limited)
    setBvnError('')
    setApiError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setBvnError('')
    setApiError('')
    setIsSuccess(false)
    setVerifiedName(null)
    setIsVerified(false)
    setIsPending(false)
    
    // Validate BVN
    const validation = validateBVN(bvn)
    if (!validation.valid) {
      setBvnError(validation.error || 'Invalid BVN format')
      return
    }

    // Submit BVN
    submitBvnMutation.mutate(
      { bvn: validation.cleaned! },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsSuccess(true)
            
            // Check if verified or pending
            if ('bvnVerified' in data.data && data.data.bvnVerified) {
              setIsVerified(true)
              if (data.data.name) {
                setVerifiedName(data.data.name)
              }
              // Reset form
              setBvn('')
              // Close modal after 5 seconds if verified
              setTimeout(() => {
                handleClose()
              }, 5000)
            } else {
              setIsPending(true)
              if (data.data.name) {
                setVerifiedName(data.data.name)
              }
              // Reset form
              setBvn('')
              // Keep modal open for pending status so user can see the message
            }
          }
        },
        onError: (error: unknown) => {
          let errorMessage = 'Failed to submit BVN. Please try again.'
          let extractedError = ''
          
          try {
            // Extract error message from different error formats
            if (error instanceof Error) {
              // Error from api-client interceptor (already extracted message)
              extractedError = error.message || ''
            } else if (typeof error === 'object' && error !== null) {
              // Direct axios error structure
              const axiosError = error as { 
                response?: { 
                  data?: { 
                    error?: string
                    message?: string
                    code?: string
                  }
                }
                message?: string
              }
              
              extractedError = axiosError.response?.data?.error || 
                              axiosError.response?.data?.message || 
                              axiosError.message || 
                              ''
            }
            
            // Normalize error message to lowercase for checking
            const normalizedError = extractedError.toLowerCase().trim()
            
            // Debug logging
            console.log('BVN Error:', { extractedError, normalizedError, error })
            
            // Check for specific error cases
            if (normalizedError.includes('already verified') || normalizedError.includes('already been verified')) {
              // BVN already verified - show verified state
              console.log('Showing verified state')
              setIsSuccess(true)
              setIsVerified(true)
              setApiError('')
              setBvn('')
              return
            } else if (normalizedError.includes('pending') || normalizedError.includes('verification is pending')) {
              // BVN verification is pending - show pending screen
              console.log('Showing pending state')
              setIsSuccess(true)
              setIsPending(true)
              setApiError('')
              setBvn('')
              return
            } else {
              // Regular error - show error message
              errorMessage = extractedError || errorMessage
            }
          } catch (err) {
            console.error('Error parsing BVN submission error:', err)
          }
          
          // Only show error if we're not showing success/pending state
          setApiError(errorMessage)
        }
      }
    )
  }

  const handleClose = () => {
    onClose()
    // Reset form state
    setBvn('')
    setBvnError('')
    setApiError('')
    setIsSuccess(false)
    setVerifiedName(null)
    setIsVerified(false)
    setIsPending(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Submit BVN"
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Info Banner */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Enter your Bank Verification Number (BVN) to upgrade your account to Tier 2. Your BVN will be verified securely and is required to receive NGN deposits.
            </p>
          </div>
        </div>

        {/* Success Message - Verified */}
        {isSuccess && isVerified && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                BVN Verified Successfully!
              </p>
              {verifiedName && (
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Verified Name: <span className="font-semibold">{verifiedName}</span>
                </p>
              )}
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Your account has been upgraded to Tier 2. You can now receive deposits.
              </p>
            </div>
          </div>
        )}

        {/* Success Message - Pending */}
        {isSuccess && isPending && (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                BVN Submitted Successfully
              </p>
              {verifiedName && (
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Name Found: <span className="font-semibold">{verifiedName}</span>
                </p>
              )}
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                Your BVN verification is pending manual review. You'll be notified once verification is complete.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {apiError && !isSuccess && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">{apiError}</p>
          </div>
        )}

            {/* BVN Input */}
        {!isSuccess && (
          <>
            <div>
              <label htmlFor="bvn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bank Verification Number (BVN) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="bvn"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={bvn}
                  onChange={handleBvnChange}
                  placeholder="Enter your 11-digit BVN"
                  error={bvnError}
                  maxLength={11}
                  disabled={submitBvnMutation.isPending}
                  className="text-base pr-12"
                />
                {/* Character Count */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                  {bvn.length}/11
                </div>
              </div>
              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                11-digit number from your bank
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitBvnMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitBvnMutation.isPending || !bvn.trim()}
                className="flex-1"
              >
                {submitBvnMutation.isPending ? (
                  <Spinner size="sm" variant="white" />
                ) : (
                  'Submit BVN'
                )}
              </Button>
            </div>
          </>
        )}

        {/* Close Button when Success */}
        {isSuccess && (
          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={handleClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default SubmitBvnModal
