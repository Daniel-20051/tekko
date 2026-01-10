import { motion } from 'framer-motion'
import { Shield, FileText, Camera, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import Button from '../../components/ui/Button'
import { useCurrentUser } from '../../hooks/useAuth'

const KycPage = () => {
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()

  const kycSteps = [
    {
      icon: FileText,
      title: 'Personal Information',
      description: 'Provide your full name, date of birth, and address',
      status: 'pending' as const,
      color: 'blue'
    },
    {
      icon: Camera,
      title: 'Identity Verification',
      description: 'Upload a government-issued ID (passport, driver\'s license)',
      status: 'pending' as const,
      color: 'purple'
    },
    {
      icon: Camera,
      title: 'Selfie Verification',
      description: 'Take a selfie to verify your identity',
      status: 'pending' as const,
      color: 'green'
    },
    {
      icon: CheckCircle2,
      title: 'Review & Submit',
      description: 'Review your information and submit for verification',
      status: 'pending' as const,
      color: 'amber'
    }
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-500/30'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-200 dark:border-purple-500/30'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-500/30'
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/20',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/30'
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate({ to: '/settings' })}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Settings</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              KYC Verification
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete your identity verification to unlock all features
            </p>
          </div>
        </div>

        {/* Current Status */}
        {currentUser?.kycLevel === 'unverified' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/30"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
                Verification Required
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Your account is currently unverified. Complete the steps below to verify your identity and access higher transaction limits.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Verification Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {kycSteps.map((step, index) => {
          const Icon = step.icon
          const colors = colorClasses[step.color as keyof typeof colorClasses]

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} font-medium`}>
                      Step {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Coming Soon Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-8 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            KYC Verification Coming Soon
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            We're currently building our KYC verification system. You'll be able to complete your identity verification here once it's ready. We'll notify you when this feature becomes available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate({ to: '/settings' })}
            >
              Back to Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/dashboard' })}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl border border-primary/20 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Benefits of KYC Verification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Higher Limits</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Increase your transaction limits</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Full Access</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Unlock all platform features</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Enhanced Security</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Protect your account</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default KycPage
