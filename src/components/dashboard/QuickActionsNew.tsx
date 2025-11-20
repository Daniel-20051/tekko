import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownLeft, Repeat, Send } from 'lucide-react'

const actions = [
  {
    icon: ArrowUpRight,
    label: 'Buy',
    description: 'Purchase crypto',
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    hoverBg: 'hover:bg-green-500 dark:hover:bg-green-600'
  },
  {
    icon: ArrowDownLeft,
    label: 'Sell',
    description: 'Sell your crypto',
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    hoverBg: 'hover:bg-red-500 dark:hover:bg-red-600'
  },
  {
    icon: Repeat,
    label: 'Swap',
    description: 'Exchange tokens',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    hoverBg: 'hover:bg-blue-500 dark:hover:bg-blue-600'
  },
  {
    icon: Send,
    label: 'Send',
    description: 'Transfer funds',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    hoverBg: 'hover:bg-purple-500 dark:hover:bg-purple-600'
  }
]

const QuickActionsNew = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6"
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`
                group relative flex flex-col items-center gap-3 p-4 rounded-xl
                ${action.bgColor} ${action.hoverBg}
                transition-all duration-200 overflow-hidden
              `}
            >
              {/* Background gradient effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <Icon className={`w-6 h-6 ${action.color} group-hover:text-white transition-colors`} />
              </div>
              
              <div className="relative text-center">
                <p className={`text-sm font-semibold ${action.color} group-hover:text-white transition-colors`}>
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                  {action.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default QuickActionsNew


