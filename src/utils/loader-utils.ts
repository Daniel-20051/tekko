/**
 * Utility functions for showing/hiding the refresh token loader
 * These work by directly manipulating the DOM, so they work even
 * before React components are rendered (e.g., during beforeLoad)
 */

const LOADER_ID = 'refresh-token-loader'

/**
 * Get the current theme from localStorage or system preference
 */
function getCurrentTheme(): 'light' | 'dark' {
  // Check if dark class is on html element
  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }
  
  // Check localStorage
  const savedTheme = localStorage.getItem('theme-storage')
  if (savedTheme) {
    try {
      const state = JSON.parse(savedTheme)
      return state.state?.theme || 'light'
    } catch {
      return 'light'
    }
  }
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

/**
 * Show the refresh token loader by injecting it into the DOM
 */
export function showRefreshLoader() {
  // Ensure DOM is ready
  if (typeof document === 'undefined') {
    return
  }
  
  // Remove existing loader if any
  removeRefreshLoader()
  
  // Set body background color immediately to prevent white flash
  const theme = getCurrentTheme()
  const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff'
  
  // Set body background immediately
  if (document.body) {
    document.body.style.backgroundColor = bgColor
  } else {
    // If body isn't ready, wait for DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.style.backgroundColor = bgColor
        createLoader()
      })
      return
    }
    return
  }
  
  createLoader()
  
  function createLoader() {
    const textColor = theme === 'dark' ? '#ffffff' : '#111827'
    const primaryColor = '#743a34'
    
    const loader = document.createElement('div')
    loader.id = LOADER_ID
    loader.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${bgColor};
      transition: background-color 0.3s;
    `
    
    loader.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="${primaryColor}" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          style="animation: spin 1s linear infinite;"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <p style="font-size: 0.875rem; font-weight: 500; color: ${textColor}; margin: 0;">
          Refreshing session...
        </p>
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `
    
    document.body.appendChild(loader)
  }
}

/**
 * Remove the refresh token loader from the DOM
 */
export function removeRefreshLoader() {
  if (typeof document === 'undefined') {
    return
  }
  
  const existingLoader = document.getElementById(LOADER_ID)
  if (existingLoader) {
    existingLoader.remove()
  }
}

