import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Link, useMatchRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  ArrowLeftRight, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  PieChart,
  History
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const Sidebar = memo(({ isOpen, onToggle }: SidebarProps) => {
  const matchRoute = useMatchRoute()
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-gray-500 dark:text-white' },
    { icon: Wallet, label: 'Wallets', path: '/wallets', color: 'text-gray-500 dark:text-white' },
    { icon: TrendingUp, label: 'Markets', path: '/markets', color: 'text-gray-500 dark:text-white' },
    { icon: ArrowLeftRight, label: 'Trade', path: '/trade', color: 'text-gray-500 dark:text-white' },
    { icon: History, label: 'Transactions', path: '/transactions', color: 'text-gray-500dark:text-white' },
    { icon: PieChart, label: 'Analytics', path: '/analytics', color: 'text-gray-500 dark:text-white' },
  ]

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500 dark:text-white' },
    { icon: HelpCircle, label: 'Help & Support', path: '/help', color: 'text-gray-500 dark:text-white' },
  ]

  const sidebarVariants: Variants = {
    open: {
      width: '280px',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 35,
        mass: 0.8
      }
    },
    closed: {
      width: '80px',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 35,
        mass: 0.8
      }
    }
  }

  const itemVariants: Variants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
        mass: 0.5
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    }
  }

  const isActive = (path: string) => {
    return matchRoute({ to: path }) !== false
  }

  return (
    <motion.aside
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-primary/50 z-40 flex flex-col will-change-transform"
    >
      {/* Navigation Items */}
      <nav className="flex-1 pt-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  preload="intent"
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                    ${active 
                      ? 'bg-primary/10 dark:bg-dark-bg text-primary dark:text-gray-300 border-l-4 border-primary' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/30 border-l-4 border-transparent'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : item.color}`} />
                  
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="font-medium text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for closed state */}
                  {!isOpen && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Items */}
        <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                preload="intent"
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  ${active 
                   ? 'bg-primary/10 dark:bg-dark-bg text-primary dark:text-gray-300 border-l-4 border-primary' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/30 border-l-4 border-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-primary' : item.color}`} />
                
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for closed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Toggle Button - Desktop Only */}
      <motion.button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-4 top-20 w-8 h-8 rounded-full bg-primary text-white shadow-lg items-center justify-center hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
    </motion.aside>
  )
}, (prevProps, nextProps) => {
  // Only re-render if isOpen changes
  return prevProps.isOpen === nextProps.isOpen
})

Sidebar.displayName = 'Sidebar'

export default Sidebar

