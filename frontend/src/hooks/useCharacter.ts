import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api'

interface Character {
  id: number
  name: string
  account_id: number
  level: number
  vocation: number
  health: number
  healthmax: number
  mana: number
  manamax: number
  experience: number
  soul: number
  skill_fist: number
  skill_club: number
  skill_sword: number
  skill_axe: number
  skill_dist: number
  skill_shielding: number
  skill_fishing: number
  maglevel: number
  town_id: number
  conditions: string
}

export function useCharacter(characterName: string) {
  const queryClient = useQueryClient()

  const { data: character, isLoading, error } = useQuery<Character>({
    queryKey: ['character', characterName],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/characters/${characterName}`)
      return response.data
    },
    enabled: !!characterName,
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/characters/${characterName}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] })
      queryClient.removeQueries({ queryKey: ['character', characterName] })
    },
  })

  return {
    character,
    isLoading,
    error,
    deleteCharacter: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}
