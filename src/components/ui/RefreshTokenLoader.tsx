import { useLoadingStore } from '../../store/loading.store'
import { useThemeStore } from '../../store/theme.store'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { removeRefreshLoader } from '../../utils/loader-utils'

/**
 * RefreshTokenLoader Component
 * 
 * Shows a full-screen loader with theme-aware background
 * when refresh token is being called (for cases where React is already mounted)
 * Also cleans up any DOM-injected loaders
 */
export default function RefreshTokenLoader() {
  const isRefreshingToken = useLoadingStore((state) => state.isRefreshingToken)
  const theme = useThemeStore((state) => state.theme)

  // Clean up any DOM-injected loader when component mounts
  useEffect(() => {
    removeRefreshLoader()
  }, [])

  // Also clean up when loading finishes
  useEffect(() => {
    if (!isRefreshingToken) {
      removeRefreshLoader()
    }
  }, [isRefreshingToken])

  if (!isRefreshingToken) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center ${
        theme === 'dark' ? 'bg-dark-bg' : 'bg-white'
      } transition-colors`}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p
          className={`text-sm font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Refreshing session...
        </p>
      </div>
    </div>
  )
}

