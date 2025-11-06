# Zustand State Management Guide

## 📁 Store Structure

```
src/store/
├── theme.store.ts      # Light/Dark theme management
├── auth.store.ts       # Authentication state
└── README.md          # This file
```

## 🎯 What is Zustand?

Zustand is a minimal, fast state management library for React. It's simpler than Redux and more powerful than Context API.

**Key Features:**
- ✅ No boilerplate code
- ✅ TypeScript support
- ✅ Persist state to localStorage
- ✅ No Context Provider needed
- ✅ Can be used outside React components
- ✅ DevTools support

## 📚 How to Use Zustand

### 1. Creating a Store

```typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

### 2. Using the Store in Components

```typescript
import { useCounterStore } from './store/counter.store'

function Counter() {
  // Select specific values (recommended for performance)
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  // Or select multiple at once
  const { count, increment, decrement } = useCounterStore()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

### 3. Persisting State (localStorage)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage', // localStorage key
    }
  )
)
```

## 🎨 Theme Store Example

### Features:
- Light/Dark mode toggle
- Persists to localStorage
- Auto-detects system preference
- Updates document class for Tailwind

### Usage:

```typescript
import { useThemeStore } from './store/theme.store'

function ThemeButton() {
  const { theme, toggleTheme } = useThemeStore()
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  )
}
```

### Selecting State:

```typescript
// ✅ Recommended: Select only what you need
const theme = useThemeStore((state) => state.theme)

// ❌ Not recommended: Selects entire store (unnecessary re-renders)
const store = useThemeStore()
```

## 🔐 Auth Store Example

### Features:
- User authentication state
- Token management
- Persists to localStorage
- Login/Logout actions

### Usage:

```typescript
import { useAuthStore } from './store/auth.store'

function Profile() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  
  if (!user) return <div>Not logged in</div>
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// Login action
function LoginForm() {
  const login = useAuthStore((state) => state.login)
  
  const handleLogin = () => {
    login(
      { id: '1', email: 'user@example.com', name: 'John' },
      'token-123'
    )
  }
  
  return <button onClick={handleLogin}>Login</button>
}
```

## 🚀 Advanced Patterns

### 1. Computed Values (Derived State)

```typescript
export const useStore = create<State>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  // Computed value
  get itemCount() {
    return get().items.length
  },
}))
```

### 2. Async Actions

```typescript
export const useStore = create<State>((set) => ({
  data: null,
  loading: false,
  
  fetchData: async () => {
    set({ loading: true })
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      set({ data, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  },
}))
```

### 3. Resetting State

```typescript
const initialState = {
  count: 0,
  user: null,
}

export const useStore = create<State>((set) => ({
  ...initialState,
  
  reset: () => set(initialState),
}))
```

### 4. Subscribing Outside Components

```typescript
// Listen to changes outside React
useStore.subscribe((state) => {
  console.log('State changed:', state)
})

// Get state without hooks
const currentState = useStore.getState()

// Update state without hooks
useStore.setState({ count: 5 })
```

## 📝 Best Practices

### 1. **Selector Optimization**
```typescript
// ✅ Good: Only re-renders when count changes
const count = useStore((state) => state.count)

// ❌ Bad: Re-renders on any state change
const { count } = useStore()
```

### 2. **Small, Focused Stores**
```typescript
// ✅ Good: Separate concerns
useThemeStore()
useAuthStore()
useCartStore()

// ❌ Bad: One giant store
useAppStore()
```

### 3. **Immutable Updates**
```typescript
// ✅ Good: Create new array
set((state) => ({ items: [...state.items, newItem] }))

// ❌ Bad: Mutate existing array
set((state) => {
  state.items.push(newItem)
  return state
})
```

### 4. **TypeScript Types**
```typescript
// ✅ Good: Fully typed
interface State {
  count: number
  increment: () => void
}

export const useStore = create<State>()(...)

// ❌ Bad: No types
export const useStore = create((set) => ...)
```

## 🔧 DevTools

Install the extension:
```bash
npm install @redux-devtools/extension
```

Enable devtools:
```typescript
import { devtools } from 'zustand/middleware'

export const useStore = create(
  devtools((set) => ({
    // your store
  }))
)
```

## 📖 Comparison with Other Solutions

| Feature | Zustand | Redux | Context API |
|---------|---------|-------|-------------|
| Boilerplate | Minimal | Heavy | Medium |
| Performance | Excellent | Excellent | Good |
| DevTools | Yes | Yes | No |
| Middleware | Yes | Yes | No |
| Learning Curve | Easy | Hard | Easy |
| Bundle Size | 1KB | 3KB | Built-in |

## 🎯 When to Use Zustand

✅ **Use Zustand when:**
- You need global state
- You want minimal boilerplate
- You need middleware (persist, devtools)
- You want to access state outside components

❌ **Use Context API when:**
- State is only used in a small component tree
- You don't need persistence or middleware

❌ **Use Redux when:**
- You need time-travel debugging
- Your team already knows Redux
- You have very complex state logic

## 📚 Resources

- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)

