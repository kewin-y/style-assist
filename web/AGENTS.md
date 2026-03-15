# Frontend Architecture & Context (Hackathon Speedrun)

## Goal
Build a React (Vite) frontend for an AI Stylist app. We are currently in Hackathon Mode, which means authentication is strictly hardcoded and bypassed. Do not generate login screens, JWT interceptors, or Supabase Auth UI components. The backend (FastAPI) is already hardcoded to accept all requests as a specific user.

## Tech Stack
- Framework: React + Vite (TypeScript)
- Routing: `react-router` with declarative routing
- Data Fetching: `@tanstack/react-query` + `axios`
- Styling: Tailwind CSS + shadcn/ui

---

## 1. Mocked Auth Context (`src/contexts/AuthContext.tsx`)
We use a fake `AuthProvider` so the entire app instantly thinks it is logged in.

```tsx
import { createContext, useContext } from "react"

const HARDCODED_UUID = "YOUR-SUPABASE-UUID-GOES-HERE"

interface AuthContextType {
  user: { id: string } | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: { id: HARDCODED_UUID },
  isAuthenticated: true,
  isLoading: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        user: { id: HARDCODED_UUID },
        isAuthenticated: true,
        isLoading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

## 2. Axios Client (`src/lib/api.ts`)
Because the FastAPI backend uses a hardcoded `CurrentUser` dependency and ignores JWTs, the Axios client is completely stripped down. Do not add auth headers here.

```ts
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

export const apiForm = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "multipart/form-data",
  },
})
```

## 3. App Providers (`src/main.tsx`)
The app is wrapped with the mocked `AuthProvider`, `QueryClientProvider`, and existing theme provider.

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/contexts/AuthContext.tsx"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)
```

## 4. Closet Data Flow
- Fetch wardrobe data with TanStack Query via `src/hooks/useClothes.ts`
- Use server-side filtering through `GET /clothes`
- Filters are passed as repeated query params like `?categories=INNER_TOP&colors=RED`
- Closet query keys should stay consistent; current closet fetch uses `['clothes', filters]`
- Upload mutations should invalidate the closet query so the grid refreshes immediately

## 5. Routing Notes (`src/App.tsx`)
This project currently uses `react-router`, not TanStack Router. Preserve the existing declarative routing setup unless explicitly asked to migrate it.

## Directives for the Frontend Agent
1. Never write auth logic. Assume `useAuth()` always returns a valid user ID.
2. Use `api` or `apiForm` from `src/lib/api.ts` for backend requests.
3. Use TanStack Query for async server state. Do not use `useEffect` for data fetching.
4. Invalidate closet-related queries aggressively after uploads or other mutations that change wardrobe data.
5. Keep routing in `react-router` unless a migration is explicitly requested.
6. Match backend field names when consuming API data: `category`, `color`, `formality`, `image_url`.
