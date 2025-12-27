import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '../../ui/Modal'
import Alert from '../../ui/Alert'
import StepIndicator from './CreatePinModal/StepIndicator'
import CreatePinStep from './CreatePinModal/CreatePinStep'
import ConfirmPinStep from './CreatePinModal/ConfirmPinStep'
import OtpStep from './CreatePinModal/OtpStep'
import { useCreatePin, useRequestPinOtp } from '../../../hooks/useAuth'
import { settingsKeys } from '../../../hooks/useSettings'

interface CreatePinModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'create' | 'confirm' | 'otp'

const CreatePinModal = ({ isOpen, onClose }: CreatePinModalProps) => {
  const [step, setStep] = useState<Step>('create')
  const [pin, setPin] = useState<string[]>([])
  const [confirmPin, setConfirmPin] = useState<string[]>([])
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [pinLength] = useState(4)
  const [errors, setErrors] = useState<{ pin?: string; confirmPin?: string; otp?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const queryClient = useQueryClient()
  const { mutate: createPin, isPending: isCreatingPin } = useCreatePin()
  const { mutate: requestOtp, isPending: isRequestingOtp } = useRequestPinOtp()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('create')
      setPin([])
      setConfirmPin([])
      setOtp(['', '', '', '', '', ''])
      setErrors({})
      setIsSubmitting(false)
      setShowSuccessAlert(false)
    }
  }, [isOpen])

  // Handle moving to confirm step
  const handleCreateNext = () => {
    // Validate PIN is complete
    if (pin.length === pinLength && pin.every(digit => digit !== '')) {
      setErrors({})
      setStep('confirm')
    } else {
      setErrors({ pin: 'Please enter all 4 digits' })
    }
  }

  // Handle confirm step next - request OTP
  const handleConfirmNext = () => {
    const pinValue = pin.join('')
    const confirmPinValue = confirmPin.join('')
    if (confirmPinValue.length === pinLength && confirmPinValue === pinValue) {
      setErrors({})
      // Request OTP before moving to OTP step
      requestOtp(undefined, {
        onSuccess: (response) => {
          if (response.success) {
            setStep('otp')
          } else {
            setErrors({ general: 'Failed to request OTP. Please try again.' })
          }
        },
        onError: (error: Error) => {
          setErrors({ general: error.message || 'Failed to request OTP. Please try again.' })
        },
      })
    } else if (confirmPinValue.length === pinLength) {
      setErrors({ confirmPin: 'PINs do not match. Please try again.' })
      setConfirmPin([])
    } else {
      setErrors({ confirmPin: 'Please enter all 4 digits' })
    }
  }


  // Handle OTP completion - call API
  const handleOtpComplete = useCallback((otpValue: string) => {
    // Prevent multiple calls
    if (isSubmitting || isCreatingPin) return

    const pinValue = pin.join('')
    
    // Clear errors and call API
    setIsSubmitting(true)
    setErrors({})
    createPin(
      { pin: pinValue, otp: otpValue },
      {
        onSuccess: (response) => {
          setIsSubmitting(false)
          if (response.success) {
            setPin([])
            setConfirmPin([])
            setOtp(['', '', '', '', '', ''])
            setErrors({})
            setStep('create')
            // Mark PIN modal as shown since PIN was created
            sessionStorage.setItem('pinModalShown', 'true')
            // Invalidate security status to update PIN status
            queryClient.invalidateQueries({ queryKey: settingsKeys.securityStatus() })
            // Show success alert
            setShowSuccessAlert(true)
            // Close modal after a short delay to show the alert
            setTimeout(() => {
              onClose()
            }, 500)
          } else {
            setErrors({ general: 'Failed to create PIN. Please try again.' })
            setStep('create')
            setPin([])
            setConfirmPin([])
            setOtp(['', '', '', '', '', ''])
          }
        },
        onError: (error: Error) => {
          setIsSubmitting(false)
          setErrors({ general: error.message || 'Failed to create PIN. Please try again.' })
          setStep('create')
          setPin([])
          setConfirmPin([])
          setOtp(['', '', '', '', '', ''])
        },
      }
    )
  }, [pin, createPin, onClose, isSubmitting, isCreatingPin])

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (isRequestingOtp || isCreatingPin || isSubmitting) return

    if (step === 'confirm') {
      setStep('create')
      setConfirmPin([])
      setErrors({})
    } else if (step === 'otp') {
      setStep('confirm')
      setOtp(['', '', '', '', '', ''])
      setErrors({})
    }
  }

  const handleClose = () => {
    if (!isRequestingOtp && !isCreatingPin && !isSubmitting) {
      setStep('create')
      setPin([])
      setConfirmPin([])
      setOtp(['', '', '', '', '', ''])
      setErrors({})
      onClose()
    }
  }

  return (
    <>
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Transfer PIN" size="md">
      <div className="space-y-6">
        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Description */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {step === 'create' 
              ? 'Create a transfer PIN to enable transactions. This PIN will be required for all financial operations.'
              : step === 'confirm'
              ? 'Please confirm your PIN to complete the setup.'
              : 'Enter the 6-digit OTP sent to your email to verify and complete PIN setup.'}
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
          <CreatePinStep
            pin={pin}
            onPinChange={setPin}
            error={errors.pin}
            onNext={handleCreateNext}
            onCancel={handleClose}
            disabled={isRequestingOtp || isCreatingPin}
            pinLength={pinLength}
          />
        )}

        {/* Step 2: Confirm PIN */}
        {step === 'confirm' && (
          <ConfirmPinStep
            pin={pin}
            confirmPin={confirmPin}
            onConfirmPinChange={setConfirmPin}
            error={errors.confirmPin}
            onBack={handleBack}
            onNext={handleConfirmNext}
            disabled={isRequestingOtp || isCreatingPin}
            isRequestingOtp={isRequestingOtp}
            pinLength={pinLength}
          />
        )}

        {/* Step 3: Enter OTP */}
        {step === 'otp' && (
          <OtpStep
            otp={otp}
            onOtpChange={(code) => {
              setOtp(code)
              if (errors.otp) setErrors({ ...errors, otp: undefined })
              if (errors.general) setErrors({ ...errors, general: undefined })
            }}
            onOtpComplete={handleOtpComplete}
            error={errors.otp}
            onBack={handleBack}
            onCancel={handleClose}
            disabled={isCreatingPin || isSubmitting}
            isSubmitting={isCreatingPin || isSubmitting}
          />
        )}
      </div>
    </Modal>
    <Alert
      message="Transaction PIN created successfully!"
      type="success"
      isVisible={showSuccessAlert}
      onClose={() => setShowSuccessAlert(false)}
      duration={3000}
    />
    </>
  )
}

export default CreatePinModal

