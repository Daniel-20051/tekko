import { create } from 'zustand'

interface LoadingState {
  isRefreshingToken: boolean
  setRefreshingToken: (isRefreshing: boolean) => void
}

/**
 * Loading Store using Zustand
 * 
 * Features:
 * - Tracks when refresh token is being called
 * - Used to show loader during token refresh
 */
export const useLoadingStore = create<LoadingState>()((set) => ({
  isRefreshingToken: false,
  setRefreshingToken: (isRefreshing: boolean) => set({ isRefreshingToken: isRefreshing }),
}))

