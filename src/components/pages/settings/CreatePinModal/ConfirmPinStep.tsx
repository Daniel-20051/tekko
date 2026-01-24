import { ArrowLeft } from 'lucide-react'
import Button from '../../../ui/Button'
import Spinner from '../../../ui/Spinner'
import PinInput from '../../../ui/PinInput'

interface ConfirmPinStepProps {
  pin: string[]
  confirmPin: string[]
  onConfirmPinChange: (pin: string[]) => void
  error?: string
  onBack: () => void
  onNext: () => void
  disabled: boolean
  isRequestingOtp: boolean
  pinLength: number
}

const ConfirmPinStep = ({
  confirmPin,
  onConfirmPinChange,
  error,
  onBack,
  onNext,
  disabled,
  isRequestingOtp,
  pinLength,
}: ConfirmPinStepProps) => {
  return (
    <div className="space-y-4">
      <PinInput
        value={confirmPin}
        onChange={onConfirmPinChange}
        length={pinLength}
        error={error}
        autoFocus={true}
        disabled={disabled}
        label="Confirm your PIN"
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
          variant="primary"
          onClick={onNext}
          disabled={!confirmPin.every(digit => digit !== '') || confirmPin.length !== pinLength || disabled}
          icon={isRequestingOtp ? <Spinner size="sm" variant="white" /> : undefined}
          fullWidth
        >
          {isRequestingOtp ? 'Requesting OTP...' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

export default ConfirmPinStep

