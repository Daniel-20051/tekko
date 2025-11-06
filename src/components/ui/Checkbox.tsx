import { type InputHTMLAttributes, forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={`
            w-4 h-4 rounded-md
            bg-gray-50 dark:bg-gray-800 
            border-2 border-gray-300 dark:border-gray-600
            text-primary focus:ring-2 focus:ring-primary/50
            hover:border-primary/50
            cursor-pointer transition-all duration-200
            ${className}
          `}
          {...props}
        />
        {label && (
          <label 
            htmlFor={checkboxId} 
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none font-medium"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

