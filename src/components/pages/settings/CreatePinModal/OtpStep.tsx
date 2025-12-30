import { useState, useEffect } from 'react'
import { Loader2, ArrowLeft } from 'lucide-react'
import Button from '../../../ui/Button'
import CodeInput from '../../../ui/CodeInput'

interface OtpStepProps {
  otp: string[]
  onOtpChange: (code: string[]) => void
  onOtpComplete: (code: string) => void
  error?: string
  onBack: () => void
  onCancel: () => void
  disabled: boolean
  isSubmitting: boolean
  onResendOtp: () => void
  isResendingOtp: boolean
}

const OtpStep = ({
  otp,
  onOtpChange,
  onOtpComplete,
  error,
  onBack,
  onCancel,
  disabled,
  isSubmitting,
  onResendOtp,
  isResendingOtp,
}: OtpStepProps) => {
  const [countdown, setCountdown] = useState(300) // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleResend = () => {
    if (canResend && !isResendingOtp) {
      onResendOtp()
      setCountdown(300) // Reset to 5 minutes
      setCanResend(false)
    }
  }

  return (
    <div className="space-y-4">
      <CodeInput
        value={otp}
        onChange={onOtpChange}
        onComplete={onOtpComplete}
        error={error}
        autoFocus={true}
        disabled={disabled}
      />
      
      {/* Resend OTP Section */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Didn't receive the code?
        </p>
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendingOtp || disabled}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResendingOtp ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Resending...
              </span>
            ) : (
              'Resend OTP'
            )}
          </button>
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Resend OTP in {formatTime(countdown)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={disabled}
          icon={<ArrowLeft className="w-4 h-4" />}
          fullWidth
        >
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={disabled}
          fullWidth
        >
          Cancel
        </Button>
      </div>
      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Creating PIN...</span>
        </div>
      )}
    </div>
  )
}

export default OtpStep

