import { motion } from 'framer-motion'
import { User, Shield, Monitor, Award } from 'lucide-react'

interface SettingsHeaderProps {
  activeTab: 'profile' | 'security' | 'sessions' | 'tiers'
  onTabChange: (tab: 'profile' | 'security' | 'sessions' | 'tiers') => void
}

const tabs = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'security' as const, label: 'Security', icon: Shield },
  { id: 'tiers' as const, label: 'Account Tiers', icon: Award },
  { id: 'sessions' as const, label: 'Sessions', icon: Monitor }
]

const SettingsHeader = ({ activeTab, onTabChange }: SettingsHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 dark:bg-dark-bg pb-4 -mx-3 md:-mx-4 px-3 md:px-4 pt-2 border-b border-gray-200 dark:border-primary/50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Settings & Security
          </h1>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and security preferences
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-x-auto -mx-3 md:-mx-4 px-3 md:px-4 border-b border-gray-200 dark:border-primary/50 -mb-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-2 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex-shrink-0
                  ${isActive 
                    ? 'text-primary dark:text-primary border-b-2 border-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsHeader

