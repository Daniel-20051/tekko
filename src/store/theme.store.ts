import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

/**
 * Theme Store using Zustand
 * 
 * Features:
 * - Manages light/dark theme state
 * - Persists to localStorage
 * - Syncs with system theme on first load
 * - Updates document class for Tailwind
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial theme - will be overridden by persisted value
      theme: 'light',

      // Set specific theme
      setTheme: (theme: Theme) => {
        set({ theme })
        updateDocumentTheme(theme)
      },

      // Toggle between light and dark
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        updateDocumentTheme(newTheme)
      },
    }),
    {
      name: 'theme-storage', // localStorage key
      onRehydrateStorage: () => (state) => {
        // Apply theme when store is rehydrated from localStorage
        if (state) {
          updateDocumentTheme(state.theme)
        }
      },
    }
  )
)

// Helper function to update document class
function updateDocumentTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize theme on app load (detect system preference if no saved preference)
export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme-storage')
  
  if (!savedTheme) {
    // No saved preference - check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = prefersDark ? 'dark' : 'light'
    useThemeStore.getState().setTheme(theme)
  } else {
    // Apply saved theme
    const state = JSON.parse(savedTheme)
    updateDocumentTheme(state.state.theme)
  }
}

