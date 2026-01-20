import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface BalanceState {
  hiddenBalances: Record<string, boolean> // assetId -> isHidden
  setBalanceVisibility: (assetId: string, isHidden: boolean) => void
  toggleBalanceVisibility: (assetId: string) => void
  isBalanceHidden: (assetId: string) => boolean
  clearAllHiddenBalances: () => void
}

/**
 * Balance Visibility Store using Zustand
 * 
 * Features:
 * - Manages balance visibility state per asset (hide/show)
 * - Persists to localStorage (separate state for each asset)
 * - Accessible across all components
 * - State persists across login sessions
 */
export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      // Initial state - all balances are visible by default
      hiddenBalances: {},

      // Set balance visibility for a specific asset
      setBalanceVisibility: (assetId: string, isHidden: boolean) => {
        set((state) => ({
          hiddenBalances: {
            ...state.hiddenBalances,
            [assetId]: isHidden,
          },
        }))
      },

      // Toggle balance visibility for a specific asset
      toggleBalanceVisibility: (assetId: string) => {
        set((state) => ({
          hiddenBalances: {
            ...state.hiddenBalances,
            [assetId]: !state.hiddenBalances[assetId],
          },
        }))
      },

      // Check if balance is hidden for a specific asset
      isBalanceHidden: (assetId: string) => {
        return get().hiddenBalances[assetId] || false
      },

      // Clear all hidden balances
      clearAllHiddenBalances: () => {
        set({ hiddenBalances: {} })
      },
    }),
    {
      name: 'balance-visibility', // localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
)

