import { type HTMLAttributes } from 'react'

interface ValidationErrorProps extends HTMLAttributes<HTMLDivElement> {
  message: string
  show?: boolean
}

const ValidationError = ({ message, show = true, className = '', ...props }: ValidationErrorProps) => {
  if (!show || !message) return null

  return (
    <div
      className={`
        mt-1.5 flex items-start gap-2 p-2.5 rounded-lg
        bg-red-50 dark:bg-red-900/20
        border border-red-200 dark:border-red-800/50
        transition-all duration-200 ease-in-out
        ${className}
      `}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Error Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className="w-4 h-4 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      {/* Error Message */}
      <p className="text-xs font-medium text-red-700 dark:text-red-300 leading-relaxed">
        {message}
      </p>
    </div>
  )
}

export default ValidationError

