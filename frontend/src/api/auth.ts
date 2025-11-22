import apiClient from './client'

export interface LoginRequest {
  name: string
  password: string
}

export interface RegisterRequest {
  name: string
  password: string
  email?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface AccountResponse {
  id: number
  name: string
  email?: string
  premdays?: number
  coins?: number
  character_count: number
}

export const authApi = {
  async register(data: RegisterRequest): Promise<AccountResponse> {
    const response = await apiClient.post('/api/v1/auth/register', data)
    return response.data
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post('/api/v1/auth/login', data)
    // Store tokens
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
    }
    return response.data
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}
