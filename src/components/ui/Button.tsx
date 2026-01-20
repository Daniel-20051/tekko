import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
  'onDrag' | 'onDragEnd' | 'onDragStart' | 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props 
}, ref) => {
  
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 dark:bg-transparent text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-primary/30 border-2 border-gray-200 dark:border-primary/50',
    outline: 'bg-transparent border-2 border-primary dark:border-primary text-primary dark:text-primary hover:bg-primary/5 dark:hover:bg-primary/10',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  }
  
  return (
    <motion.button
      ref={ref}
      whileHover={!disabled ? { 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
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
      {/* Ripple effect background */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-xl"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ borderRadius: 'inherit' }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && (
          <motion.span 
            className="flex items-center justify-center shrink-0"
            whileHover={!disabled ? { rotate: 5, scale: 1.1 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <motion.span 
            className="flex items-center justify-center shrink-0"
            whileHover={!disabled ? { rotate: -5, scale: 1.1 } : {}}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button

