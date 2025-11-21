import { motion } from "framer-motion"
import PortfolioWithWallets from "../../components/pages/dashboard/PortfolioWithWallets"
import QuickActionsModern from "../../components/pages/dashboard/QuickActionsModern"
import ActivityCard from "../../components/pages/dashboard/ActivityCard"
import MarketOverviewCompact from "../../components/pages/dashboard/MarketOverviewCompact"


const DashboardPage = () => {
     // Get current time for last login
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return (
    <div className="max-w-[1600px] mx-auto space-y-3">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start md:items-center justify-between gap-2 md:gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-0.5">
            Welcome back, SAGE! 
          </h1>
          <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        
        <div className="bg-white dark:bg-dark-surface rounded-lg px-2 md:px-3 py-1 md:py-1.5 border border-gray-200 dark:border-primary/50 shrink-0">
          <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Last login</p>
          <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">Today, {timeString}</p>
        </div>
      </motion.div>

      {/* Main Layout - Portfolio and Quick Actions Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column - Portfolio and Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-3">
          {/* Portfolio Card with Wallets */}
          <PortfolioWithWallets 
            totalValue={2500000000.00}
            change24h={5.2}
            changeAmount={12400}
          />
          
          {/* Quick Actions - Mobile Only */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-0">
              <QuickActionsModern />
              <ActivityCard />
            </div>
          </div>
          
          {/* Market Overview */}
          <MarketOverviewCompact />
        </div>
        
        {/* Right Column - Quick Actions and Activity (1/3 width) - Desktop Only */}
        <div className="hidden lg:flex lg:col-span-1 flex-col gap-0">
          {/* Quick Actions */}
          <QuickActionsModern />
          
          {/* Activity Card */}
          <ActivityCard />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage