import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BalanceState {
  hideBalance: boolean
  setHideBalance: (hide: boolean) => void
  toggleHideBalance: () => void
}

/**
 * Balance Visibility Store using Zustand
 * 
 * Features:
 * - Manages balance visibility state (hide/show)
 * - Persists to localStorage
 * - Accessible across all components
 */
export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      // Initial state - balance is visible by default
      hideBalance: false,

      // Set balance visibility
      setHideBalance: (hide: boolean) => {
        set({ hideBalance: hide })
      },

      // Toggle balance visibility
      toggleHideBalance: () => {
        set({ hideBalance: !get().hideBalance })
      },
    }),
    {
      name: 'balance-visibility', // localStorage key
    }
  )
)

