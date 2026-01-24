import { type HTMLAttributes } from 'react'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'white' | 'gray'
}

const Spinner = ({ size = 'md', variant = 'primary', className = '', ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }

  const variantClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-500 dark:text-gray-400'
  }

  return (
    <div
      className={`flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}
      {...props}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={`${variantClasses[variant]} ${sizeClasses[size]} animate-spin`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* Background circle */}
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        {/* Animated arc - using stroke-dasharray for the arc effect */}
        <circle
          className="opacity-80"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="47.12 15.71"
          strokeDashoffset="0"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner

