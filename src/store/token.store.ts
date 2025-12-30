import { create } from 'zustand'

interface TokenState {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clearAccessToken: () => void
  isAuthenticated: () => boolean
}

/**
 * Token Store using Zustand
 * 
 * Features:
 * - Stores access token in memory only (no persistence)
 * - Token is cleared when browser tab closes
 * - Secure: No token in localStorage or sessionStorage
 * - Refresh token is handled by backend as HttpOnly cookie
 */
export const useTokenStore = create<TokenState>((set, get) => ({
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
}))

