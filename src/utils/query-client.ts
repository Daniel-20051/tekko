import { QueryClient } from '@tanstack/react-query'

// Export a singleton query client that will be set from main.tsx
let queryClientInstance: QueryClient | null = null

export const setQueryClient = (client: QueryClient) => {
  queryClientInstance = client
}

export const getQueryClient = (): QueryClient => {
  if (!queryClientInstance) {
    throw new Error('QueryClient has not been initialized')
  }
  return queryClientInstance
}

