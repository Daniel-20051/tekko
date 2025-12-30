import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthFormData {
  email: string
  agreeToTerms: boolean
}

interface AuthState {
  formData: AuthFormData | null
  setFormData: (data: AuthFormData) => void
  clearFormData: () => void
  loginEmail: string
  setLoginEmail: (email: string) => void
  clearLoginEmail: () => void
}

/**
 * Auth Store using Zustand
 * 
 * Features:
 * - Manages form data for account creation (email only, no passwords)
 * - Persists to sessionStorage (cleared when browser tab closes)
 * - Allows data to persist when navigating between pages
 * - Passwords are NOT stored for security
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      formData: null,
      loginEmail: '',

      setFormData: (data: AuthFormData) => {
        set({ formData: data })
      },

      clearFormData: () => {
        set({ formData: null })
      },

      setLoginEmail: (email: string) => {
        set({ loginEmail: email })
      },

      clearLoginEmail: () => {
        set({ loginEmail: '' })
      },
    }),
    {
      name: 'auth-form-storage', // sessionStorage key
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
)

