import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi, LoginRequest, RegisterRequest, AccountResponse, TokenResponse } from '@/api/auth'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const isAuthenticated = !!localStorage.getItem('access_token')

  // Get current account
  const { data: account, isLoading } = useQuery<AccountResponse>({
    queryKey: ['account', 'me'],
    queryFn: async () => {
      const response = await fetch('/api/v1/accounts/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch account')
      return response.json()
    },
    enabled: isAuthenticated,
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate('/login')
    },
  })

  // Login mutation
  const loginMutation = useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] })
      navigate('/characters')
    },
  })

  // Logout
  const logout = () => {
    authApi.logout()
    queryClient.clear()
    navigate('/login')
  }

  const register = (data: RegisterRequest) => {
    return registerMutation.mutateAsync(data)
  }

  const login = (data: LoginRequest) => {
    return loginMutation.mutateAsync(data)
  }

  return {
    account,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
