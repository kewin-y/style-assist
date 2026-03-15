import { createContext, useContext } from "react"

const HARDCODED_UUID = "your-supabase-uuid-here"

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