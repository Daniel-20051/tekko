import { Link, useMatchRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { Home, Wallet, ArrowUp, ArrowLeftRight, History } from 'lucide-react'

const MobileBottomNav = memo(() => {
  const matchRoute = useMatchRoute()

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Wallet, label: 'Wallets', path: '/wallets' },
    { icon: ArrowUp, label: 'Send Money', path: '/send' },
    { icon: ArrowLeftRight, label: 'Swap', path: '/swap' },
    { icon: History, label: 'Transactions', path: '/transactions' },
  ]

  const isActive = (path: string) => {
    return matchRoute({ to: path }) !== false
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-primary/50 lg:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              preload="intent"
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative px-1"
            >
              <div
                className={`flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-full transition-colors duration-200 ${
                  active
                    ? 'bg-primary/10 dark:bg-primary/20'
                    : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active
                      ? 'text-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 whitespace-nowrap ${
                    active
                      ? 'text-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}, () => {
  // Always re-render to check active route
  return false
})

MobileBottomNav.displayName = 'MobileBottomNav'

export default MobileBottomNav
