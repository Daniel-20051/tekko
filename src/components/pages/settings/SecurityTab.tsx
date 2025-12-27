import { motion } from 'framer-motion'
import { useState } from 'react'
import { Lock, LogOut, Loader2, Mail, MailCheck, Phone, PhoneCall, Shield, ShieldCheck, Clock, Key } from 'lucide-react'
import Button from '../../ui/Button'
import ChangePasswordModal from './ChangePasswordModal'
import CreatePinModal from './CreatePinModal'
import { useLogout, useLogoutAll } from '../../../hooks/useAuth'
import { useSecurityStatus } from '../../../hooks/useSettings'

const SecurityTab = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const { mutate: logoutAll, isPending: isLoggingOutAll } = useLogoutAll()
  const { data: securityStatus, isLoading, error, refetch } = useSecurityStatus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4">
        {/* Transaction PIN Card */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Transaction PIN
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {securityStatus?.pinSet 
                  ? 'Update your transaction PIN for secure financial operations'
                  : 'Create a transaction PIN to enable secure financial operations'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Key className="w-4 h-4" />}
              onClick={() => setIsCreatingPin(true)}
            >
              {securityStatus?.pinSet ? 'Set PIN' : 'Create PIN'}
            </Button>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Change Password
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Lock className="w-4 h-4" />}
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          </div>

          {/* Logout Actions */}
          <div className="pt-6 border-t border-gray-200 dark:border-primary/30 space-y-3">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-primary/30 bg-gray-50 dark:bg-gray-800/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Log out from this device
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sign out from your current session only
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="w-4 h-4" />}
                  onClick={() => logout()}
                  disabled={isLoggingOut || isLoggingOutAll}
                >
                  {isLoggingOut ? 'Logging out...' : 'Log Out'}
                </Button>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Log out from all devices
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sign out from all active sessions across all devices
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<LogOut className="w-4 h-4" />}
                  className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => logoutAll()}
                  disabled={isLoggingOut || isLoggingOutAll}
                >
                  {isLoggingOutAll ? 'Logging out...' : 'Log Out All'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Security Status Overview */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:sticky lg:top-4"
        >
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Security Status Overview
            </h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                  {error instanceof Error ? error.message : 'Failed to load security status'}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : securityStatus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    {securityStatus.emailVerified ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <MailCheck className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Email Verification
                      </p>
                      <p className={`text-xs ${
                        securityStatus.emailVerified 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {securityStatus.emailVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    {securityStatus.phoneVerified ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Phone Verification
                      </p>
                      <p className={`text-xs ${
                        securityStatus.phoneVerified 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {securityStatus.phoneVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    {securityStatus.twoFactorEnabled ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-yellow-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className={`text-xs ${
                        securityStatus.twoFactorEnabled 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {securityStatus.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                      </p>
                    </div>
                  </div>
                  {!securityStatus.twoFactorEnabled && (
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Last Login
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(securityStatus.lastLogin.at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
      />

      {/* Create/Set PIN Modal */}
      <CreatePinModal
        isOpen={isCreatingPin}
        onClose={() => {
          setIsCreatingPin(false)
          // Refetch security status to update PIN status
          refetch()
        }}
      />
    </motion.div>
  )
}

export default SecurityTab

