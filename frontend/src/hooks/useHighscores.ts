import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

interface HighscoreEntry {
  rank: number
  name: string
  level: number
  vocation: number
  experience?: number
  maglevel?: number
  skill_value?: number
}

export type HighscoreType = 'experience' | 'magic' | 'skill'

export function useHighscores(
  type: HighscoreType,
  skillName?: string,
  vocation?: number,
  limit: number = 100
) {
  const { data, isLoading, error } = useQuery<HighscoreEntry[]>({
    queryKey: ['highscores', type, skillName, vocation, limit],
    queryFn: async () => {
      let url = `/api/v1/highscores/${type}`

      if (type === 'skill' && skillName) {
        url = `/api/v1/highscores/skill/${skillName}`
      }

      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (vocation !== undefined && vocation !== null) params.append('vocation', vocation.toString())

      const response = await apiClient.get(`${url}?${params.toString()}`)
      return response.data
    },
  })

  return {
    highscores: data || [],
    isLoading,
    error,
  }
}
