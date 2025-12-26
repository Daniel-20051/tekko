import { useState, useEffect, useCallback } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'
import Modal from '../../ui/Modal'
import PinInput from '../../ui/PinInput'
import Button from '../../ui/Button'
import { useCreatePin } from '../../../hooks/useAuth'

interface CreatePinModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'create' | 'confirm'

const CreatePinModal = ({ isOpen, onClose }: CreatePinModalProps) => {
  const [step, setStep] = useState<Step>('create')
  const [pin, setPin] = useState<string[]>([])
  const [confirmPin, setConfirmPin] = useState<string[]>([])
  const [pinLength] = useState(4)
  const [errors, setErrors] = useState<{ pin?: string; confirmPin?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutate: createPin, isPending } = useCreatePin()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('create')
      setPin([])
      setConfirmPin([])
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen])

  // Handle moving to confirm step
  const handleNext = () => {
    // Validate PIN is complete
    if (pin.length === pinLength && pin.every(digit => digit !== '')) {
      setErrors({})
      setStep('confirm')
    } else {
      setErrors({ pin: 'Please enter all 4 digits' })
    }
  }

  // Check if PIN is complete
  const isPinComplete = pin.length === pinLength && pin.every(digit => digit !== '')

  // Handle PIN completion in confirm step
  const handleConfirmPinComplete = useCallback((confirmPinValue: string) => {
    // Prevent multiple calls
    if (isSubmitting || isPending) return
    
    // Validate PINs match
    const pinValue = pin.join('')
    if (pinValue !== confirmPinValue) {
      setErrors({ confirmPin: 'PINs do not match. Please try again.' })
      setConfirmPin([])
      return
    }

    // Clear errors and call API
    setIsSubmitting(true)
    setErrors({})
    createPin(
      { pin: pinValue },
      {
        onSuccess: (response) => {
          setIsSubmitting(false)
          if (response.success) {
            setPin([])
            setConfirmPin([])
            setErrors({})
            setStep('create')
            onClose()
          } else {
            setErrors({ general: 'Failed to create PIN. Please try again.' })
            setStep('create')
            setPin([])
            setConfirmPin([])
          }
        },
        onError: (error: Error) => {
          setIsSubmitting(false)
          setErrors({ general: error.message || 'Failed to create PIN. Please try again.' })
          setStep('create')
          setPin([])
          setConfirmPin([])
        },
      }
    )
  }, [pin, createPin, onClose, isSubmitting, isPending])

  const handleBack = () => {
    if (step === 'confirm' && !isPending) {
      setStep('create')
      setConfirmPin([])
      setErrors({})
    }
  }

  const handleClose = () => {
    if (!isPending) {
      setStep('create')
      setPin([])
      setConfirmPin([])
      setErrors({})
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Transfer PIN" size="md">
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            step === 'create' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 transition-colors ${
            step === 'confirm' 
              ? 'bg-primary' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            step === 'confirm' 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            2
          </div>
        </div>

        {/* Description */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {step === 'create' 
              ? 'Create a transfer PIN to enable transactions. This PIN will be required for all financial operations.'
              : 'Please confirm your PIN to complete the setup.'}
          </p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Step 1: Create PIN */}
        {step === 'create' && (
          <div className="space-y-4">
            <PinInput
              value={pin}
              onChange={setPin}
              length={4}
              error={errors.pin}
              autoFocus={true}
              disabled={isPending}
              label="Enter your PIN (4 digits)"
            />
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={!isPinComplete || isPending}
                fullWidth
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm PIN */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <PinInput
              value={confirmPin}
              onChange={setConfirmPin}
              onComplete={handleConfirmPinComplete}
              length={pinLength}
              error={errors.confirmPin}
              autoFocus={true}
              disabled={isPending}
              label="Confirm your PIN"
            />
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isPending}
                icon={<ArrowLeft className="w-4 h-4" />}
                fullWidth
              >
                Back
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                fullWidth
              >
                Cancel
              </Button>
            </div>
            {isPending && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating PIN...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default CreatePinModal

