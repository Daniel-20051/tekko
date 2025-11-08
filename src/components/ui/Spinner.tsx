import { type HTMLAttributes } from 'react'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white' | 'gray'
}

const Spinner = ({ size = 'md', variant = 'primary', className = '', ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const variantClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-500 dark:text-gray-400'
  }

  // Unique dual-ring spinner design
  return (
    <div
      className={`flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={`${variantClasses[variant]} animate-spin ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Outer ring with dashed effect */}
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="20 12"
        />
        {/* Inner spinning arc - unique design */}
        <path
          className="opacity-80"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          d="M12 2a10 10 0 0 1 10 10"
          strokeDasharray="20"
          strokeDashoffset="20"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="0.75s"
            values="20;0"
            repeatCount="indefinite"
          />
        </path>
        {/* Pulsing center dot */}
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill="currentColor"
          opacity="0.6"
        >
          <animate
            attributeName="opacity"
            dur="1s"
            values="0.3;0.8;0.3"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner

