import { motion } from 'framer-motion'
import { ArrowUpDown } from 'lucide-react'

interface SwapButtonProps {
  onClick: () => void
  disabled?: boolean
}

const SwapButton = ({ onClick, disabled = false }: SwapButtonProps) => {
  return (
    <div className="flex items-center justify-center -my-1 relative z-10">
      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        className={`
          w-10 h-10 rounded-full bg-white dark:bg-dark-surface border-2 border-primary
          flex items-center justify-center shadow-lg
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:bg-primary/5'}
        `}
      >
        <ArrowUpDown className="w-5 h-5 text-primary" />
      </motion.button>
    </div>
  )
}

export default SwapButton
