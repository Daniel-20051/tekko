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
}: OtpStepProps) => {
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

