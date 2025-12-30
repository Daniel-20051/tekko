import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'
import * as authApi from '../../api/auth.api'
import { settingsKeys } from '../../hooks/useSettings'
import { useTokenStore } from '../../store/token.store'
import { getQueryClient } from '../../utils/query-client'

const SettingsPage = lazy(() => import('../../pages/settings/SettingsPage'))

export const Route = createFileRoute('/_authenticated/settings')({
  loader: async () => {
    // Prefetch sessions data in the background when settings route is navigated to
    const accessToken = useTokenStore.getState().accessToken
    if (accessToken) {
      try {
        const queryClient = getQueryClient()
        // Prefetch sessions query
        await queryClient.prefetchQuery({
          queryKey: settingsKeys.sessions(),
          queryFn: authApi.getSessions,
        })
      } catch (error) {
        // Silently fail if queryClient is not available yet
        console.warn('Failed to prefetch sessions:', error)
      }
    }
  },
  component: SettingsPage,
})
