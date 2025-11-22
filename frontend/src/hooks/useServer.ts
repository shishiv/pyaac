import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface ServerStatus {
  online: boolean
  players_online: number
  players_max: number
  uptime: string
  server_name: string
  version: string
}

interface OnlinePlayer {
  name: string
  level: number
  vocation: number
}

export function useServerStatus() {
  const { data: status, isLoading, error } = useQuery<ServerStatus>({
    queryKey: ['server-status'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/server/status')
      return response.data
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  return {
    status,
    isLoading,
    error,
  }
}

export function useOnlinePlayers() {
  const { data: players, isLoading, error } = useQuery<OnlinePlayer[]>({
    queryKey: ['online-players'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/server/online-players')
      return response.data
    },
    refetchInterval: 30000,
  })

  return {
    players,
    isLoading,
    error,
  }
}
