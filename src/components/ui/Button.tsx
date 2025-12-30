import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98]'
  
  const variantStyles = {
    primary: 'bg-linear-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 shadow-gray-200/50 dark:shadow-gray-800/50',
    outline: 'bg-transparent border-2 border-primary dark:border-primary text-primary dark:text-primary hover:bg-primary/5 dark:hover:bg-primary/10',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none'
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  }
  
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
      {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
    </button>
  )
}

export default Button

