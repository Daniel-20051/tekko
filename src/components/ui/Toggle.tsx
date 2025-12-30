import { motion } from 'framer-motion'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  disabled?: boolean
  label?: string
}

const Toggle = ({ enabled, onChange, disabled = false, label }: ToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      {label && (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <motion.span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg"
          animate={{
            x: enabled ? 20 : 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </div>
  )
}

export default Toggle

