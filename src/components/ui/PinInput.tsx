import { useRef, type KeyboardEvent, useEffect } from 'react'

interface PinInputProps {
  value: string[]
  onChange: (code: string[]) => void
  onComplete?: (code: string) => void
  length?: number
  error?: string
  autoFocus?: boolean
  disabled?: boolean
  label?: string
}

const PinInput = ({ 
  value, 
  onChange, 
  onComplete,
  length = 6,
  error,
  autoFocus = false,
  disabled = false,
  label
}: PinInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const hasCalledComplete = useRef(false)
  
  // Auto-focus first input if enabled
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  // Reset completion flag when value changes (user is editing)
  useEffect(() => {
    const isComplete = value.every(digit => digit !== '') && value.length === length
    if (!isComplete) {
      hasCalledComplete.current = false
    }
  }, [value, length])

  // Call onComplete when all digits are filled (only once)
  useEffect(() => {
    const isComplete = value.every(digit => digit !== '') && value.length === length
    if (isComplete && onComplete && !hasCalledComplete.current) {
      hasCalledComplete.current = true
      onComplete(value.join(''))
    }
  }, [value, length, onComplete])

  const handleCodeChange = (index: number, inputValue: string) => {
    // Only allow single digit
    if (inputValue.length > 1) return
    
    // Only allow numbers
    if (inputValue && !/^\d$/.test(inputValue)) return

    const newCode = [...value]
    newCode[index] = inputValue
    onChange(newCode)

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, length).split('')
        const newCode = [...value]
        digits.forEach((digit, i) => {
          if (i < length) {
            newCode[i] = digit
          }
        })
        onChange(newCode)
        // Focus the last filled input or the last input
        const lastFilledIndex = Math.min(digits.length - 1, length - 1)
        inputRefs.current[lastFilledIndex]?.focus()
      })
    }
  }

  // Ensure value array matches length
  const displayValue = Array.from({ length }, (_, i) => value[i] || '')

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium mb-3 text-gray-700 dark:text-[#666666] text-center">
          {label}
        </label>
      )}
      <div className="flex justify-center gap-2">
        {displayValue.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={`
              w-12 h-12
              text-center
              text-lg font-semibold
              rounded-lg
              border-2
              bg-white dark:bg-[#2A2A2A]
              border-gray-300 dark:border-[#374151]
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${digit ? 'border-primary dark:border-primary' : ''}
              ${error ? 'border-red-500 dark:border-red-500' : ''}
            `}
            style={{
              // Ensure password masking works
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          />
        ))}
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}
    </div>
  )
}

export default PinInput

