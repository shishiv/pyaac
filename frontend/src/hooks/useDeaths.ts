import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

interface Death {
  id: number
  player_id: number
  player_name: string | null
  time: number
  level: number
  killed_by: string
  is_player: number
  mostdamage_by: string | null
  mostdamage_is_player: number | null
}

export function useRecentDeaths(limit: number = 20) {
  const { data, isLoading, error } = useQuery<Death[]>({
    queryKey: ['deaths', limit],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/deaths?limit=${limit}`)
      return response.data
    },
    refetchInterval: 60000, // Refresh every minute
  })

  return {
    deaths: data || [],
    isLoading,
    error,
  }
}

export function useCharacterDeaths(characterName: string, limit: number = 10) {
  const { data, isLoading, error } = useQuery<Death[]>({
    queryKey: ['deaths', 'character', characterName, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/deaths/character/${characterName}?limit=${limit}`)
      return response.data
    },
    enabled: !!characterName,
  })

  return {
    deaths: data || [],
    isLoading,
    error,
  }
}
