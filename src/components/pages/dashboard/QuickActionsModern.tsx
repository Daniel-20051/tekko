import { motion } from 'framer-motion'
import { Download, Upload, Send, CreditCard, DollarSign, ArrowLeftRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

const actions = [
  {
    icon: Download,
    label: 'Deposit',
    description: 'Add funds',
    onClick: () => ({ to: '/deposit' })
  },
  {
    icon: Send,
    label: 'Send Money',
    description: 'Send to others',
    onClick: () => ({ to: '/send' })
  },
  {
    icon: Upload,
    label: 'Withdraw',
    description: 'Withdraw funds',
    onClick: () => ({ to: '/withdraw' })
  },
  {
    icon: CreditCard,
    label: 'Buy Crypto',
    description: 'Purchase crypto',
    onClick: () => ({ to: '/buy-crypto' })
  },
  {
    icon: DollarSign,
    label: 'Sell Crypto',
    description: 'Sell your crypto',
    onClick: () => ({ to: '/sell-crypto' })
  },
  {
    icon: ArrowLeftRight,
    label: 'Swap',
    description: 'Swap currencies',
    onClick: () => ({ to: '/swap' })
  }
]

const QuickActionsModern = () => {
  const navigate = useNavigate()

  const handleActionClick = (onClick: () => { to: string }) => {
    const route = onClick()
    navigate(route)
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-t-xl border border-gray-200 dark:border-primary/50 border-b-0 p-3 flex flex-col">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleActionClick(action.onClick)}
              className="flex flex-col items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-primary/5 hover:border-primary dark:hover:border-primary hover:bg-gray-100 dark:hover:bg-primary/10 transition-all duration-200"
            >
              <motion.div 
                className="p-1.5 rounded-md bg-primary/10"
                whileHover={{ scale: 1.05, rotate: 3 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
              </motion.div>
              
              <div className="flex-1 text-center">
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {action.label}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActionsModern

