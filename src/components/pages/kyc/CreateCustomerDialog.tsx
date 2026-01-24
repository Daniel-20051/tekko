import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useMutation } from '@tanstack/react-query'
import { createCustomer, submitBvn } from '../../../api/kyc.api'
import Spinner from '../../ui/Spinner'
import type { CreateCustomerRequest } from '../../../types/kyc'

// Country codes for phone numbers
const countryCodes = [
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
]

interface CreateCustomerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Utility to detect country from IP (defaults to NGA if Nigeria)
const detectCountryFromIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    // If IP is from Nigeria, return NGA, otherwise return the country code or default to NGA
    return data.country_code === 'NG' ? 'NGA' : (data.country_code || 'NGA')
  } catch (error) {
    console.error('Failed to detect country from IP:', error)
    // Default to NGA if detection fails
    return 'NGA'
  }
}

const CreateCustomerDialog = ({ isOpen, onClose, onSuccess }: CreateCustomerDialogProps) => {
  const [step, setStep] = useState(1)
  const [country, setCountry] = useState<string>('NGA')
  const [isDetectingCountry, setIsDetectingCountry] = useState(true)
  const [countryCode, setCountryCode] = useState('+234')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [bvn, setBvn] = useState('')
  const [customerCreated, setCustomerCreated] = useState(false)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  
  // Form data
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    firstName: '',
    lastName: '',
    middleName: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: 'NGA',
    address: {
      line: '',
      city: '',
      state: ''
    }
  })

  // Detect country on mount
  useEffect(() => {
    if (isOpen) {
      setIsDetectingCountry(true)
      detectCountryFromIP().then((detectedCountry) => {
        setCountry(detectedCountry)
        setFormData(prev => ({ ...prev, country: detectedCountry }))
        // Set default country code based on detected country
        if (detectedCountry === 'NGA') {
          setCountryCode('+234')
        }
        setIsDetectingCountry(false)
      })
    }
  }, [isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
    }
    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCountryDropdown])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setCountryCode('+234')
      setPhoneNumber('')
      setBvn('')
      setCustomerCreated(false)
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        dateOfBirth: '',
        country: 'NGA',
        address: {
          line: '',
          city: '',
          state: ''
        }
      })
    }
  }, [isOpen])

  // Update phoneNumber in formData when countryCode or phoneNumber changes
  useEffect(() => {
    // Remove the + from country code and combine with phone number
    const codeWithoutPlus = countryCode.replace('+', '')
    const fullPhoneNumber = codeWithoutPlus + phoneNumber
    setFormData(prev => ({ ...prev, phoneNumber: fullPhoneNumber }))
  }, [countryCode, phoneNumber])

  // Mutation for creating customer
  const createCustomerMutation = useMutation({
    mutationFn: (data: CreateCustomerRequest) => createCustomer(data),
    onSuccess: () => {
      setCustomerCreated(true)
      setStep(3) // Move to BVN step after successful customer creation
    }
  })

  // Mutation for submitting BVN
  const submitBvnMutation = useMutation({
    mutationFn: (data: { bvn: string }) => submitBvn(data),
    onSuccess: () => {
      onSuccess?.()
      setTimeout(() => {
        onClose()
      }, 2000)
    }
  })

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CreateCustomerRequest] as any,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateStep1 = (): boolean => {
    return !!(
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      phoneNumber.trim() &&
      phoneNumber.length >= 7 // Minimum phone number length
    )
  }

  const validateStep2 = (): boolean => {
    return !!(
      formData.dateOfBirth &&
      formData.address.line.trim() &&
      formData.address.city.trim() &&
      formData.address.state.trim()
    )
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else if (step === 3) {
      // Don't allow going back from BVN step
      // User must complete BVN verification
    }
  }

  const handleSubmit = () => {
    if (validateStep2()) {
      createCustomerMutation.mutate({
        ...formData,
        country: country // Use detected country
      })
    }
  }

  const handleBvnSubmit = () => {
    if (validateBvn()) {
      submitBvnMutation.mutate({ bvn })
    }
  }

  const validateBvn = (): boolean => {
    return bvn.trim().length === 11 && /^\d+$/.test(bvn)
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              max-w-lg
              w-[calc(100%-2rem)] sm:w-full
              bg-white dark:bg-dark-surface
              rounded-xl border border-gray-200 dark:border-primary/50
              shadow-2xl z-50
              overflow-hidden
              max-h-[90vh] overflow-y-auto
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-primary/50 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                {step > 1 && step < 3 && (
                  <button
                    onClick={handleBack}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  KYC Verification
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className={step >= 1 ? 'text-primary font-semibold' : ''}>Personal Info</span>
                <span className={step >= 2 ? 'text-primary font-semibold' : ''}>Address</span>
                <span className={step >= 3 ? 'text-primary font-semibold' : ''}>BVN</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitBvnMutation.isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    KYC Verification Complete!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your BVN has been verified successfully. Your account has been upgraded to Level 2.
                  </p>
                </div>
              ) : (
                <>
                  {/* Step 1: Name and Phone */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Personal Information
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                          Please provide your personal details to continue.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your first name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your last name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Middle Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.middleName}
                            onChange={(e) => handleInputChange('middleName', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter your middle name (optional)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            {/* Country Code Dropdown */}
                            <div className="relative" ref={countryDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent whitespace-nowrap min-w-[100px]"
                              >
                                <span>{countryCodes.find(c => c.code === countryCode)?.flag || '🇳🇬'}</span>
                                <span className="text-sm">{countryCode}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {showCountryDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                  {countryCodes.map((item) => (
                                    <button
                                      key={item.code}
                                      type="button"
                                      onClick={() => {
                                        setCountryCode(item.code)
                                        setShowCountryDropdown(false)
                                      }}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-left transition-colors ${
                                        countryCode === item.code ? 'bg-primary/10 dark:bg-primary/20' : ''
                                      }`}
                                    >
                                      <span className="text-lg">{item.flag}</span>
                                      <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.country}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.code}</div>
                                      </div>
                                      {countryCode === item.code && (
                                        <CheckCircle2 className="w-4 h-4 text-primary" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Phone Number Input */}
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '') // Only numbers
                                setPhoneNumber(value)
                              }}
                              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="8012345678"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Address */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Address Information
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                          {isDetectingCountry ? (
                            <span className="flex items-center gap-2">
                              <Spinner size="sm" variant="primary" />
                              Detecting your location...
                            </span>
                          ) : (
                            `Your country has been set to ${country === 'NGA' ? 'Nigeria' : country}.`
                          )}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Street Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.line}
                            onChange={(e) => handleInputChange('address.line', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="123 Main Street"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleInputChange('address.city', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Lagos"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            State <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => handleInputChange('address.state', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Lagos"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: BVN Submission */}
                  {step === 3 && customerCreated && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          BVN Verification
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                          Your customer profile has been created successfully. Please provide your BVN to complete KYC verification and upgrade to Level 2.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            BVN (Bank Verification Number) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={bvn}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '') // Only numbers
                              if (value.length <= 11) {
                                setBvn(value)
                              }
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="12345678901"
                            maxLength={11}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Enter your 11-digit BVN
                          </p>
                          {submitBvnMutation.isError && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              {submitBvnMutation.error instanceof Error 
                                ? submitBvnMutation.error.message 
                                : 'Failed to submit BVN. Please try again.'}
                            </p>
                          )}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                            Benefits of BVN Verification:
                          </h4>
                          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                            <li>Upgrade to Level 2 KYC</li>
                            <li>Higher daily transaction limits</li>
                            <li>Access to NGN deposits</li>
                            <li>Enhanced account security</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!submitBvnMutation.isSuccess && (
              <div className="sticky bottom-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-primary/50 p-4 flex items-center justify-between gap-3">
                {step === 1 ? (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                {step === 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!validateStep1()}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : step === 2 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!validateStep2() || createCustomerMutation.isPending}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    {createCustomerMutation.isPending ? (
                      <>
                        <Spinner size="sm" variant="white" />
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        Create Profile
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleBvnSubmit}
                    disabled={!validateBvn() || submitBvnMutation.isPending}
                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ml-auto"
                  >
                    {submitBvnMutation.isPending ? (
                      <>
                        <Spinner size="sm" variant="white" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify BVN
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

export default CreateCustomerDialog
