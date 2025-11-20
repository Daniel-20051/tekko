import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor: string
  index?: number
}

const StatCard = ({ title, value, change, changeType = 'neutral', icon: Icon, iconColor, index = 0 }: StatCardProps) => {
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20',
    negative: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </motion.div>
  )
}

export default StatCard

