import { useState, type FormEvent } from 'react'
import { CheckCircle } from 'lucide-react'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import { useChangePassword } from '../../../hooks/useAuth'
import { validatePassword, validatePasswordMatch } from '../../../services/validation.service'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [apiError, setApiError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const changePasswordMutation = useChangePassword()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setCurrentPasswordError('')
    setNewPasswordError('')
    setConfirmPasswordError('')
    setApiError('')
    setIsSuccess(false)
    
    // Validate current password
    if (!currentPassword) {
      setCurrentPasswordError('Current password is required')
      return
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      setNewPasswordError(passwordValidation.errors[0])
      return
    }
    
    // Validate password match
    if (!validatePasswordMatch(newPassword, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match')
      return
    }
    
    // Check if new password is same as current
    if (currentPassword === newPassword) {
      setNewPasswordError('New password must be different from current password')
      return
    }
    
    // Call change password API
    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsSuccess(true)
            // Reset form
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            // Close modal after 3 seconds
            setTimeout(() => {
              handleClose()
            }, 3000)
          }
        },
        onError: (error: unknown) => {
          // Handle API errors gracefully without breaking UI
          let errorMessage = 'Failed to change password. Please try again.'
          
          try {
            if (error instanceof Error) {
              // Error from api-client interceptor (already extracted)
              errorMessage = error.message || errorMessage
            } else if (typeof error === 'object' && error !== null) {
              // Handle axios error structure directly
              const axiosError = error as { 
                response?: { 
                  data?: { 
                    error?: string
                    message?: string
                  }
                }
                message?: string
              }
              errorMessage = axiosError.response?.data?.error || 
                           axiosError.response?.data?.message || 
                           axiosError.message || 
                           errorMessage
            }
          } catch (err) {
            // Fallback to default message if error parsing fails
            console.error('Error parsing change password error:', err)
          }
          
          setApiError(errorMessage)
        }
      }
    )
  }

  const handleClose = () => {
    onClose()
    // Reset form state
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPasswordError('')
    setNewPasswordError('')
    setConfirmPasswordError('')
    setApiError('')
    setIsSuccess(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {isSuccess && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Password changed successfully
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                All other sessions have been logged out for security.
              </p>
            </div>
          </div>
        )}

        {apiError && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-900 dark:text-red-100">{apiError}</p>
          </div>
        )}

        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value)
            if (currentPasswordError) setCurrentPasswordError('')
            if (apiError) setApiError('')
          }}
          error={currentPasswordError}
          required
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value)
            if (newPasswordError) setNewPasswordError('')
            if (confirmPasswordError && validatePasswordMatch(e.target.value, confirmPassword)) {
              setConfirmPasswordError('')
            }
            if (apiError) setApiError('')
          }}
          error={newPasswordError}
          required
        />

        {/* Password Requirements */}
        {newPassword && (
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-1">
            <div className="flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span>Include uppercase, lowercase, & number</span>
            </div>
          </div>
        )}

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (confirmPasswordError) {
              if (validatePasswordMatch(newPassword, e.target.value)) {
                setConfirmPasswordError('')
              }
            }
            if (apiError) setApiError('')
          }}
          error={confirmPasswordError}
          required
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={changePasswordMutation.isPending || isSuccess}
            className="flex-1"
          >
            {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={changePasswordMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ChangePasswordModal

