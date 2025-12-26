import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { initializeTheme } from './store/theme.store'
import { setQueryClient } from './utils/query-client'
import './index.css'

// Configure axios to include credentials (cookies) in all requests
axios.defaults.withCredentials = true

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Initialize theme on app load
initializeTheme()

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
})

// Set the query client instance for use in loaders
setQueryClient(queryClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)

