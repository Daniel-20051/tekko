import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthFormData {
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface AuthState {
  formData: AuthFormData | null
  setFormData: (data: AuthFormData) => void
  clearFormData: () => void
}

/**
 * Auth Store using Zustand
 * 
 * Features:
 * - Manages form data for account creation
 * - Persists to localStorage
 * - Allows data to persist when navigating between pages
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      formData: null,

      setFormData: (data: AuthFormData) => {
        set({ formData: data })
      },

      clearFormData: () => {
        set({ formData: null })
      },
    }),
    {
      name: 'auth-form-storage', // localStorage key
    }
  )
)

