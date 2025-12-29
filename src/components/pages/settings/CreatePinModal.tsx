import { useState, useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '../../ui/Modal'
import Alert from '../../ui/Alert'
import StepIndicator from './CreatePinModal/StepIndicator'
import CreatePinStep from './CreatePinModal/CreatePinStep'
import ConfirmPinStep from './CreatePinModal/ConfirmPinStep'
import OtpStep from './CreatePinModal/OtpStep'
import { useCreatePin, useRequestPinOtp, useResendPinOtp, useChangePin, useRequestChangePinOtp, useResendChangePinOtp, usePinStatus } from '../../../hooks/useAuth'
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
  const { data: pinStatus } = usePinStatus()
  const hasPin = pinStatus?.hasPin ?? false

  // Create PIN hooks
  const { mutate: createPin, isPending: isCreatingPin } = useCreatePin()
  const { mutate: requestOtp, isPending: isRequestingOtp } = useRequestPinOtp()
  const { mutate: resendOtp, isPending: isResendingOtp } = useResendPinOtp()

  // Change PIN hooks
  const { mutate: changePin, isPending: isChangingPin } = useChangePin()
  const { mutate: requestChangeOtp, isPending: isRequestingChangeOtp } = useRequestChangePinOtp()
  const { mutate: resendChangeOtp, isPending: isResendingChangeOtp } = useResendChangePinOtp()

  // Use appropriate hooks based on hasPin status
  const isPending = hasPin ? isChangingPin : isCreatingPin
  const isRequestingOtpPending = hasPin ? isRequestingChangeOtp : isRequestingOtp
  const isResendingOtpPending = hasPin ? isResendingChangeOtp : isResendingOtp

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
      // Request OTP before moving to OTP step - use appropriate endpoint based on hasPin
      const requestOtpFn = hasPin ? requestChangeOtp : requestOtp
      requestOtpFn(undefined, {
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
    if (isSubmitting || isPending) return

    const pinValue = pin.join('')
    
    // Clear errors and call API - use appropriate endpoint based on hasPin
    setIsSubmitting(true)
    setErrors({})
    
    const handleSuccess = (response: { success: boolean }) => {
      setIsSubmitting(false)
      if (response.success) {
        setPin([])
        setConfirmPin([])
        setOtp(['', '', '', '', '', ''])
        setErrors({})
        setStep('create')
        // Mark PIN modal as shown since PIN was created/changed
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
        setErrors({ general: `Failed to ${hasPin ? 'change' : 'create'} PIN. Please try again.` })
        setStep('create')
        setPin([])
        setConfirmPin([])
        setOtp(['', '', '', '', '', ''])
      }
    }

    const handleError = (error: Error) => {
      setIsSubmitting(false)
      setErrors({ general: error.message || `Failed to ${hasPin ? 'change' : 'create'} PIN. Please try again.` })
      setStep('create')
      setPin([])
      setConfirmPin([])
      setOtp(['', '', '', '', '', ''])
    }

    if (hasPin) {
      // Use newPin for change PIN endpoint
      changePin(
        { newPin: pinValue, otp: otpValue },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      )
    } else {
      // Use pin for create PIN endpoint
      createPin(
        { pin: pinValue, otp: otpValue },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      )
    }
  }, [pin, createPin, changePin, onClose, isSubmitting, isPending, hasPin, queryClient])

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (isRequestingOtpPending || isPending || isSubmitting) return

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
    if (!isRequestingOtpPending && !isPending && !isSubmitting) {
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
    <Modal isOpen={isOpen} onClose={handleClose} title={hasPin ? "Change Transfer PIN" : "Create Transfer PIN"} size="md">
      <div className="space-y-6">
        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Description */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {step === 'create' 
              ? hasPin 
                ? 'Change your transfer PIN. This PIN will be required for all financial operations.'
                : 'Create a transfer PIN to enable transactions. This PIN will be required for all financial operations.'
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
            disabled={isRequestingOtpPending || isPending}
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
            disabled={isRequestingOtpPending || isPending}
            isRequestingOtp={isRequestingOtpPending}
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
            disabled={isPending || isSubmitting}
            isSubmitting={isPending || isSubmitting}
            onResendOtp={() => {
              const resendFn = hasPin ? resendChangeOtp : resendOtp
              resendFn(undefined, {
                onSuccess: (response) => {
                  if (response.success) {
                    setErrors({})
                  } else {
                    setErrors({ general: 'Failed to resend OTP. Please try again.' })
                  }
                },
                onError: (error: Error) => {
                  setErrors({ general: error.message || 'Failed to resend OTP. Please try again.' })
                },
              })
            }}
            isResendingOtp={isResendingOtpPending}
          />
        )}
      </div>
    </Modal>
    <Alert
      message={`Transaction PIN ${hasPin ? 'changed' : 'created'} successfully!`}
      type="success"
      isVisible={showSuccessAlert}
      onClose={() => setShowSuccessAlert(false)}
      duration={3000}
    />
    </>
  )
}

export default CreatePinModal

