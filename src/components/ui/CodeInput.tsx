import { useRef, type KeyboardEvent, useEffect } from 'react'

interface CodeInputProps {
  value: string[]
  onChange: (code: string[]) => void
  onComplete?: (code: string) => void
  error?: string
  autoFocus?: boolean
  disabled?: boolean
}

const CodeInput = ({ 
  value, 
  onChange, 
  onComplete,
  error,
  autoFocus = false,
  disabled = false
}: CodeInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto-focus first input if enabled
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  // Call onComplete when all digits are filled
  useEffect(() => {
    if (value.every(digit => digit !== '') && onComplete) {
      onComplete(value.join(''))
    }
  }, [value, onComplete])

  const handleCodeChange = (index: number, inputValue: string) => {
    // Only allow single digit
    if (inputValue.length > 1) return
    
    // Only allow numbers
    if (inputValue && !/^\d$/.test(inputValue)) return

    const newCode = [...value]
    newCode[index] = inputValue
    onChange(newCode)

    // Auto-focus next input
    if (inputValue && index < 5) {
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
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        const newCode = [...value]
        digits.forEach((digit, i) => {
          if (i < 6) {
            newCode[i] = digit
          }
        })
        onChange(newCode)
        // Focus the last filled input or the last input
        const lastFilledIndex = Math.min(digits.length - 1, 5)
        inputRefs.current[lastFilledIndex]?.focus()
      })
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2">
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
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

export default CodeInput

