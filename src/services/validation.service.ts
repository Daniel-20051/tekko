export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface CreateAccountFormData {
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - Include uppercase letter
 * - Include lowercase letter
 * - Include number
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!password) {
    errors.push('Password is required')
    return { isValid: false, errors }
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates that passwords match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  if (!password || !confirmPassword) return false
  return password === confirmPassword
}

/**
 * Validates the entire create account form
 */
export const validateCreateAccountForm = (formData: CreateAccountFormData): ValidationResult => {
  const errors: string[] = []

  // Validate email
  if (!formData.email) {
    errors.push('Email address is required')
  } else if (!validateEmail(formData.email)) {
    errors.push('Please enter a valid email address')
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors)
  }

  // Validate password match
  if (!formData.confirmPassword) {
    errors.push('Please confirm your password')
  } else if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
    errors.push('Passwords do not match')
  }

  // Validate terms agreement
  if (!formData.agreeToTerms) {
    errors.push('You must agree to the Terms & Conditions')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

