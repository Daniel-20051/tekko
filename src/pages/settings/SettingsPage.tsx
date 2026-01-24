import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react'
import SettingsHeader from '../../components/pages/settings/SettingsHeader'
import { useSecurityStatus, useSessions, useProfile } from '../../hooks/useSettings'
import { useCurrentUser } from '../../hooks/useAuth'
import ProfileTab from '../../components/pages/settings/ProfileTab'
import SecurityTab from '../../components/pages/settings/SecurityTab'
import SessionsTab from '../../components/pages/settings/SessionsTab'
import KycTiersTab from '../../components/pages/settings/KycTiersTab'
import SubmitBvnModal from '../../components/pages/settings/SubmitBvnModal'
import CreateCustomerDialog from '../../components/pages/kyc/CreateCustomerDialog'
import Button from '../../components/ui/Button'
import { useQueryClient } from '@tanstack/react-query'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions' | 'tiers'>('profile')
  const [showBvnModal, setShowBvnModal] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUser()
  
  // Prefetch data in the background when settings page loads
  useSecurityStatus()
  useSessions()
  useProfile()

  return (
    <div className="max-w-[1600px] mx-auto w-full overflow-x-hidden">
      <SettingsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      {/* KYC Verification Alert - Shows on all tabs when unverified */}
      {currentUser?.kycLevel === 'unverified' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 md:mt-4 mb-3 md:mb-4"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-500/30 p-3 md:p-5"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-2.5 md:gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-9 h-9 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-500/30 rounded-xl flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 md:w-6 md:h-6 text-amber-600 dark:text-amber-400" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-base font-bold text-gray-900 dark:text-white mb-0.5 md:mb-1">
                  KYC Verification Required
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  Complete your identity verification to unlock higher transaction limits and access all platform features.
                </p>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 whitespace-nowrap w-full md:w-auto mt-1 md:mt-0"
                onClick={() => setShowCustomerDialog(true)}
              >
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span>Verify Now</span>
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Upgrade to Tier 2 Alert - Shows when kycLevel is "1" */}
      {currentUser?.kycLevel === '1' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 md:mt-4 mb-3 md:mb-4"
        >
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/30 dark:border-primary/50 p-3 md:p-5">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/70 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2.5 md:gap-4 mb-3 md:mb-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-9 h-9 md:w-12 md:h-12 bg-primary/20 dark:bg-primary/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-primary dark:text-primary" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs md:text-base font-bold text-gray-900 dark:text-white mb-0.5 md:mb-1">
                    Upgrade Your Account to Tier 2
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    Add your BVN to upgrade to Tier 2 and unlock higher transaction limits and access to NGN deposits.
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 whitespace-nowrap w-full md:w-auto mt-1 md:mt-0"
                  onClick={() => setShowBvnModal(true)}
                >
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span>Verify Now</span>
                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                </Button>
              </div>

              {/* Benefits List */}
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-primary/20 dark:border-primary/30">
                <h4 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">
                  Benefits of Tier 2:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Higher daily transaction limits
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Access to NGN deposits
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Enhanced account security
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Faster transaction processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4 pt-4">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'tiers' && <KycTiersTab />}
        {activeTab === 'sessions' && <SessionsTab />}
      </div>

      {/* BVN Submission Modal */}
      <SubmitBvnModal
        isOpen={showBvnModal}
        onClose={() => setShowBvnModal(false)}
      />

      {/* Create Customer Dialog */}
      <CreateCustomerDialog
        isOpen={showCustomerDialog}
        onClose={() => setShowCustomerDialog(false)}
        onSuccess={() => {
          // Invalidate user query to refresh KYC status
          queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        }}
      />
    </div>
  )
}

export default SettingsPage

