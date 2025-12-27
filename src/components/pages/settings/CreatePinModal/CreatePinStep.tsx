import Button from '../../../ui/Button'
import PinInput from '../../../ui/PinInput'

interface CreatePinStepProps {
  pin: string[]
  onPinChange: (pin: string[]) => void
  error?: string
  onNext: () => void
  onCancel: () => void
  disabled: boolean
  pinLength: number
}

const CreatePinStep = ({
  pin,
  onPinChange,
  error,
  onNext,
  onCancel,
  disabled,
  pinLength,
}: CreatePinStepProps) => {
  const isPinComplete = pin.length === pinLength && pin.every(digit => digit !== '')

  return (
    <div className="space-y-4">
      <PinInput
        value={pin}
        onChange={onPinChange}
        length={pinLength}
        error={error}
        autoFocus={true}
        disabled={disabled}
        label="Enter your PIN (4 digits)"
      />
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={disabled}
          fullWidth
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onNext}
          disabled={!isPinComplete || disabled}
          fullWidth
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default CreatePinStep

