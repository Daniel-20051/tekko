import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TokenState {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clearAccessToken: () => void
  isAuthenticated: () => boolean
}

/**
 * Token Store using Zustand with Persistence
 * 
 * Features:
 * - Stores access token in localStorage for persistence across refreshes
 * - Prevents logout on mobile when refreshing (especially important for PWA/mobile browsers)
 * - Refresh token is still handled by backend as HttpOnly cookie
 * - Token is automatically loaded from storage on app start
 * 
 * Security Notes:
 * - Access tokens are short-lived (typically 15-30 minutes)
 * - If access token is compromised, refresh token is still secure (HttpOnly cookie)
 * - On logout, both tokens are cleared (client-side and server-side)
 * - This approach is recommended for SPAs and mobile web apps
 */
export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      accessToken: null,

      setAccessToken: (token: string | null) => {
        set({ accessToken: token })
      },

      clearAccessToken: () => {
        set({ accessToken: null })
      },

      isAuthenticated: () => {
        return !!get().accessToken
      },
    }),
    {
      name: 'access-token-storage', // localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
)

