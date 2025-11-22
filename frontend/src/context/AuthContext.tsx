import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AccountResponse } from '@/api/auth'

interface AuthContextType {
  account: AccountResponse | undefined
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: { name: string; password: string }) => Promise<unknown>
  register: (data: { name: string; password: string; email?: string }) => Promise<unknown>
  logout: () => void
  isLoggingIn: boolean
  isRegistering: boolean
  loginError: Error | null
  registerError: Error | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
