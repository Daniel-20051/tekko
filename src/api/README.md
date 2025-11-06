# API Setup Guide

## 📁 Folder Structure

```
src/
├── api/                    # API endpoint functions
│   ├── auth.api.ts        # Authentication endpoints
│   └── dashboard.api.ts   # Dashboard endpoints
├── hooks/                  # React Query hooks
│   ├── useAuth.ts         # Auth-related hooks
│   └── useDashboard.ts    # Dashboard-related hooks
├── lib/                    # Utilities and configurations
│   └── api-client.ts      # Axios instance with interceptors
└── types/                  # TypeScript type definitions
    ├── auth.ts            # Auth types
    └── dashboard.ts       # Dashboard types
```

## 🚀 How It Works

### 1. **API Client** (`src/lib/api-client.ts`)
- Centralized Axios instance
- Request interceptor: Adds auth token to all requests
- Response interceptor: Handles 401 errors and redirects to login
- Configurable base URL via environment variables

### 2. **API Functions** (`src/api/*.api.ts`)
- Pure functions that call endpoints
- Organized by domain (auth, dashboard, etc.)
- Returns typed responses
- Easy to test and mock

### 3. **React Query Hooks** (`src/hooks/*.ts`)
- Custom hooks using `useQuery` and `useMutation`
- Handles loading, error, and success states
- Automatic cache invalidation
- Type-safe

## 📝 Usage Examples

### Fetching Data (Query)

```typescript
import { useProducts } from '../hooks/useDashboard'

function MyComponent() {
  const { data, isLoading, error } = useProducts()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Mutating Data (Create/Update/Delete)

```typescript
import { useCreateProduct } from '../hooks/useDashboard'

function MyComponent() {
  const createMutation = useCreateProduct()

  const handleCreate = () => {
    createMutation.mutate(
      { name: 'New Product', price: 99.99, stock: 100, description: 'Cool product' },
      {
        onSuccess: () => {
          alert('Product created!')
        },
        onError: (error) => {
          alert(`Error: ${error.message}`)
        }
      }
    )
  }

  return (
    <button 
      onClick={handleCreate}
      disabled={createMutation.isPending}
    >
      {createMutation.isPending ? 'Creating...' : 'Create Product'}
    </button>
  )
}
```

### Authentication

```typescript
import { useLogin, useCurrentUser } from '../hooks/useAuth'

function LoginForm() {
  const loginMutation = useLogin()
  const { data: user } = useCurrentUser()

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## 🔧 Configuration

1. **Set API Base URL** in `.env`:
```bash
VITE_API_BASE_URL=https://api.example.com/api/v1
```

2. **Customize Query Client** in `src/main.tsx`:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
})
```

## 🎯 Key Concepts

### Query Keys
Query keys are used to identify and cache queries:
```typescript
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  products: () => [...dashboardKeys.all, 'products'] as const,
}
```

### Cache Invalidation
After mutations, invalidate related queries to refetch fresh data:
```typescript
queryClient.invalidateQueries({ queryKey: dashboardKeys.products() })
```

### Optimistic Updates
Update UI immediately before API response:
```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ['products'] })
  const previousData = queryClient.getQueryData(['products'])
  queryClient.setQueryData(['products'], (old) => [...old, newData])
  return { previousData }
}
```

## 🛠️ Adding New Endpoints

1. **Define types** in `src/types/`
2. **Create API function** in `src/api/`
3. **Create React Query hook** in `src/hooks/`
4. **Use in components**

Example:
```typescript
// 1. Type
export interface User {
  id: string
  name: string
}

// 2. API Function
export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users')
  return response.data
}

// 3. Hook
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

// 4. Component
function UserList() {
  const { data } = useUsers()
  return <div>{data?.map(u => u.name)}</div>
}
```

## 🐛 Debugging

- **React Query Devtools**: Open the devtools panel in browser
- **Network Tab**: Check actual API calls
- **Query Keys**: Use descriptive, hierarchical keys for better debugging

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/docs/intro)

