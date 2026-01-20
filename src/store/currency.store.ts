import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Currency = 'NGN' | 'USD'

interface CurrencyState {
  selectedCurrency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
}

/**
 * Currency Store using Zustand
 * 
 * Features:
 * - Manages selected currency (NGN or USD)
 * - Persists to localStorage
 * - Accessible across all components
 * - State persists across login sessions
 */
export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      // Initial state - default to NGN
      selectedCurrency: 'NGN',

      // Set currency
      setCurrency: (currency: Currency) => {
        set({ selectedCurrency: currency })
      },

      // Toggle between NGN and USD
      toggleCurrency: () => {
        set((state) => ({
          selectedCurrency: state.selectedCurrency === 'NGN' ? 'USD' : 'NGN'
        }))
      },
    }),
    {
      name: 'currency-preference', // localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
)
