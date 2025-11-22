import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface Character {
  id: number
  name: string
  level: number
  vocation: number
  vocation_name: string
  health: number
  healthmax: number
  mana: number
  manamax: number
  experience: number
  sex: number
  online: number | null
}

interface CharacterDetail extends Character {
  soul: number
  cap: number
  stamina: number | null
  skill_fist: number
  skill_club: number
  skill_sword: number
  skill_axe: number
  skill_dist: number
  skill_shielding: number
  skill_fishing: number
  maglevel: number
}

interface CreateCharacterData {
  name: string
  vocation: number
  sex: number
}

export function useCharacters() {
  const queryClient = useQueryClient()

  // List characters
  const { data: characters, isLoading, error } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/characters')
      return response.data
    },
  })

  // Create character
  const createMutation = useMutation({
    mutationFn: async (data: CreateCharacterData) => {
      const response = await apiClient.post('/api/v1/characters', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] })
    },
  })

  // Delete character
  const deleteMutation = useMutation({
    mutationFn: async (characterName: string) => {
      await apiClient.delete(`/api/v1/characters/${characterName}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] })
    },
  })

  return {
    characters,
    isLoading,
    error,
    createCharacter: createMutation.mutateAsync,
    deleteCharacter: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    deleteError: deleteMutation.error,
  }
}

export function useCharacter(characterName: string) {
  const { data: character, isLoading, error } = useQuery<CharacterDetail>({
    queryKey: ['character', characterName],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/characters/${characterName}`)
      return response.data
    },
    enabled: !!characterName,
  })

  return {
    character,
    isLoading,
    error,
  }
}
