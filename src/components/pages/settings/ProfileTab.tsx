import { motion } from 'framer-motion'
import { useState } from 'react'
import { Edit2, Loader2, Shield, User, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import { useProfile } from '../../../hooks/useSettings'

const ProfileTab = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const { data: profileData, isLoading, error, refetch } = useProfile()

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6">
          <div className="text-center py-8">
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              {error instanceof Error ? error.message : 'Failed to load profile'}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!profileData) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* Personal Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
        className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150 cursor-default"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your contact details
              </p>
            </div>
          </div>
          {!isEditingProfile && (
            <Button
              variant="outline"
              size="sm"
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => setIsEditingProfile(true)}
            >
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            {isEditingProfile ? (
              <Input
                label="Email Address"
                type="email"
                defaultValue={profileData.email}
                placeholder="Enter email address"
                className="bg-white dark:bg-[#2A2A2A]"
              />
            ) : (
              <>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  Email Address
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profileData.email}
                </p>
                {profileData.emailVerified ? (
                  <span className="inline-block mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Not verified
                  </span>
                )}
              </>
            )}
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            {isEditingProfile ? (
              <Input
                label="Phone Number"
                type="tel"
                defaultValue={profileData.phoneNumber || ''}
                placeholder="Enter phone number"
                className="bg-white dark:bg-[#2A2A2A]"
              />
            ) : (
              <>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  Phone Number
                </label>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profileData.phoneNumber || 'Not set'}
                </p>
                {profileData.phoneVerified ? (
                  <span className="inline-block mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Verified
                  </span>
                ) : profileData.phoneNumber ? (
                  <span className="inline-block mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Not verified
                  </span>
                ) : null}
              </>
            )}
          </div>
          {isEditingProfile && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => setIsEditingProfile(false)}
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Account Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
        className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150 cursor-default"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Account Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your account details and verification status
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Role
            </label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {profileData.role}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Account Status
            </label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {profileData.status}
            </p>
          </div>
        </div>
      </motion.div>

      {/* KYC Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
        className={`bg-white dark:bg-dark-surface rounded-xl border p-6 hover:shadow-lg transition-all duration-150 cursor-default ${
          profileData.kycLevel === 'unverified'
            ? 'border-amber-200 dark:border-amber-500/30 hover:border-amber-300 dark:hover:border-amber-500/50'
            : 'border-gray-200 dark:border-primary/50 hover:border-primary/50 dark:hover:border-primary/70'
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            profileData.kycLevel === 'unverified'
              ? 'bg-amber-100 dark:bg-amber-900/20'
              : 'bg-green-100 dark:bg-green-900/20'
          }`}>
            {profileData.kycLevel === 'unverified' ? (
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              KYC Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Know Your Customer verification level
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            KYC Level
          </label>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
              {profileData.kycLevel}
            </p>
            {profileData.kycLevel !== 'unverified' && (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Login Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
        className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-150 cursor-default"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Login Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Account activity and login history
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {profileData.lastLoginAt && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                Last Login
              </label>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(profileData.lastLoginAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {profileData.lastLoginIp && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  IP: {profileData.lastLoginIp}
                </p>
              )}
            </div>
          )}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Account Created
            </label>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfileTab

