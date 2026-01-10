import { motion } from 'framer-motion'
import { Shield, CheckCircle2, Lock, ArrowRight, TrendingUp, Wallet, Crown } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useCurrentUser } from '../../../hooks/useAuth'
import Button from '../../ui/Button'

interface KycTier {
  level: number
  name: string
  title: string
  icon: typeof Shield
  color: string
  bgColor: string
  borderColor: string
  badgeColor: string
  advantages: string[]
  requirements: string[]
  limits: {
    label: string
    value: string
  }[]
}

const kycTiers: KycTier[] = [
  {
    level: 0,
    name: 'unverified',
    title: 'Tier 0 - Unverified',
    icon: Lock,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-700',
    badgeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    advantages: [
      'Create an account',
      'Explore the platform',
      'Make deposits',
      'View market prices',
    ],
    requirements: [
      'Valid email address',
      'Account registration',
    ],
    limits: [
      { label: 'Deposits', value: 'Allowed' },
      { label: 'Withdrawals', value: 'Not allowed' },
      { label: 'Trading', value: 'View only' },
    ]
  },
  {
    level: 1,
    name: 'tier1',
    title: 'Tier 1 - Basic Verification',
    icon: Shield,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-500/30',
    badgeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    advantages: [
      'Limited withdrawals enabled',
      'Basic trading features',
      'Email support',
      'Transaction history',
    ],
    requirements: [
      'Email verification',
      'Phone number verification',
      'Basic personal information',
    ],
    limits: [
      { label: 'Daily Withdrawal', value: '₦500,000' },
      { label: 'Monthly Withdrawal', value: '₦5,000,000' },
      { label: 'Trading', value: 'Basic' },
    ]
  },
  {
    level: 2,
    name: 'tier2',
    title: 'Tier 2 - Full Verification',
    icon: TrendingUp,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-500/30',
    badgeColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    advantages: [
      'Higher withdrawal limits',
      'Advanced trading features',
      'Priority support',
      'Lower fees',
      'Access to premium features',
    ],
    requirements: [
      'Government-issued ID',
      'Proof of address',
      'Selfie verification',
      'Complete KYC form',
    ],
    limits: [
      { label: 'Daily Withdrawal', value: '₦10,000,000' },
      { label: 'Monthly Withdrawal', value: '₦100,000,000' },
      { label: 'Trading', value: 'Advanced' },
    ]
  },
  {
    level: 3,
    name: 'tier3',
    title: 'Tier 3 - Enhanced Verification',
    icon: Crown,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20',
    borderColor: 'border-amber-300 dark:border-amber-500/40',
    badgeColor: 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-800 dark:text-amber-200',
    advantages: [
      'Unlimited withdrawals',
      'VIP support (24/7)',
      'Lowest fees',
      'Early access to new features',
      'Dedicated account manager',
      'Custom solutions',
    ],
    requirements: [
      'Enhanced due diligence',
      'Source of funds verification',
      'Video call verification',
      'Additional documentation',
    ],
    limits: [
      { label: 'Daily Withdrawal', value: 'Unlimited' },
      { label: 'Monthly Withdrawal', value: 'Unlimited' },
      { label: 'Trading', value: 'Professional' },
    ]
  }
]

const KycTiersTab = () => {
  const navigate = useNavigate()
  const { data: currentUser } = useCurrentUser()

  const getCurrentTierLevel = (kycLevel: string): number => {
    if (kycLevel === 'unverified') return 0
    if (kycLevel === 'tier1') return 1
    if (kycLevel === 'tier2') return 2
    if (kycLevel === 'tier3') return 3
    return 0
  }

  const currentTierLevel = currentUser ? getCurrentTierLevel(currentUser.kycLevel) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-primary/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Account Tiers
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose the verification level that suits your needs
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Each tier offers different benefits and transaction limits. Complete the requirements to unlock higher tiers and enjoy enhanced features.
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {kycTiers.map((tier, index) => {
          const Icon = tier.icon
          const isCurrentTier = currentTierLevel === tier.level
          const isPastTier = currentTierLevel > tier.level
          const isNextTier = currentTierLevel + 1 === tier.level

          return (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative bg-white dark:bg-dark-surface rounded-xl border-2 p-6 transition-all duration-200 ${
                isCurrentTier
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : tier.borderColor
              } hover:shadow-lg`}
            >
              {/* Current Tier Badge */}
              {isCurrentTier && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                >
                  Current Tier
                </motion.div>
              )}

              {/* Completed Badge */}
              {isPastTier && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${tier.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${tier.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {tier.title}
                    </h3>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${tier.badgeColor} mt-1`}>
                      Level {tier.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Transaction Limits
                </h4>
                <div className="space-y-1.5">
                  {tier.limits.map((limit, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{limit.label}:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{limit.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advantages */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Benefits
                </h4>
                <ul className="space-y-1.5">
                  {tier.advantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${tier.color}`} />
                      <span className="text-gray-700 dark:text-gray-300">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Requirements
                </h4>
                <ul className="space-y-1.5">
                  {tier.requirements.map((requirement, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${tier.bgColor} flex-shrink-0 mt-1.5`} />
                      <span className="text-gray-600 dark:text-gray-400">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {isCurrentTier && tier.level < 3 && (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate({ to: '/settings/kyc' })}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Upgrade to Tier {tier.level + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              )}

              {isNextTier && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate({ to: '/settings/kyc' })}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Unlock This Tier</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              )}

              {isPastTier && (
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}

              {!isCurrentTier && !isNextTier && !isPastTier && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-600 font-medium">
                  <Lock className="w-4 h-4" />
                  <span>Locked</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200 dark:border-blue-500/30 p-6"
      >
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Need Help Choosing?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Start with basic verification to unlock withdrawals, then upgrade as your needs grow. Our support team is here to help you through the verification process.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default KycTiersTab
