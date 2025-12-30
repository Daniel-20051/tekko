import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Lock, LogOut, Loader2, Mail, MailCheck, Phone, PhoneCall, Shield, ShieldCheck, Clock, Key } from 'lucide-react'
import Button from '../../ui/Button'
import Toggle from '../../ui/Toggle'
import ChangePasswordModal from './ChangePasswordModal'
import CreatePinModal from './CreatePinModal'
import TwoFactorSetupModal from './TwoFactorSetupModal'
import TwoFactorEnableModal from './TwoFactorEnableModal'
import TwoFactorDisableModal from './TwoFactorDisableModal'
import LinkGoogleAccountModal from './LinkGoogleAccountModal'
import { useLogout, useLogoutAll } from '../../../hooks/useAuth'
import { useSecurityStatus } from '../../../hooks/useSettings'

const SecurityTab = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false)
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)
  const [isDisabling2FA, setIsDisabling2FA] = useState(false)
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false)
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const { mutate: logoutAll, isPending: isLoggingOutAll } = useLogoutAll()
  const { data: securityStatus, isLoading, error, refetch } = useSecurityStatus()
  
  // Use twoFactorSetupStarted to determine if 2FA has been set up
  const is2FASetup = securityStatus?.twoFactorSetupStarted ?? false

  // Auto-open linking modal if we have linking data from OAuth callback
  useEffect(() => {
    const linkingData = sessionStorage.getItem('google_linking_data')
    if (linkingData) {
      setIsLinkingGoogle(true)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-4">
        {/* Transaction PIN Card */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.1 } }}
          className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-100 cursor-default"
        >
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
        </motion.div>

        {/* Link Google Account Card */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.1 } }}
          className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-100 cursor-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Link Google Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect your Google account for easier sign-in
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
              onClick={() => setIsLinkingGoogle(true)}
            >
              Link Google
            </Button>
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.1 } }}
          className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-100 cursor-default"
        >
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
        </motion.div>
      </div>

      {/* Sidebar - Security Status Overview */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.1 } }}
          className="lg:sticky lg:top-4"
        >
          <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-100 cursor-default">
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
                        {securityStatus.twoFactorEnabled ? 'Enabled' : is2FASetup ? 'Disabled' : 'Not set up'}
                      </p>
                    </div>
                  </div>
                  {!is2FASetup ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsSettingUp2FA(true)}
                    >
                      Setup
                    </Button>
                  ) : (
                    <Toggle
                      enabled={securityStatus.twoFactorEnabled}
                      onChange={(enabled) => {
                        if (enabled) {
                          // Enable 2FA - show enable modal (just needs verification code)
                          setIsEnabling2FA(true)
                        } else {
                          // Disable 2FA - show disable modal (needs password and code)
                          setIsDisabling2FA(true)
                        }
                      }}
                    />
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

      {/* 2FA Setup Modal */}
      <TwoFactorSetupModal
        isOpen={isSettingUp2FA}
        onClose={() => {
          setIsSettingUp2FA(false)
          refetch()
        }}
      />

      {/* 2FA Enable Modal */}
      <TwoFactorEnableModal
        isOpen={isEnabling2FA}
        onClose={() => {
          setIsEnabling2FA(false)
          refetch()
        }}
      />

      {/* 2FA Disable Modal */}
      <TwoFactorDisableModal
        isOpen={isDisabling2FA}
        onClose={() => {
          setIsDisabling2FA(false)
          refetch()
        }}
      />

      {/* Link Google Account Modal */}
      <LinkGoogleAccountModal
        isOpen={isLinkingGoogle}
        onClose={() => setIsLinkingGoogle(false)}
      />
    </motion.div>
  )
}

export default SecurityTab

