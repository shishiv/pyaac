import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

interface Guild {
  id: number
  name: string
  ownerid: number
  motd: string
  description: string | null
  member_count: number
}

interface CreateGuildData {
  name: string
  motd: string
  description?: string
}

export function useGuilds() {
  const queryClient = useQueryClient()

  // List guilds
  const { data: guilds, isLoading, error } = useQuery<Guild[]>({
    queryKey: ['guilds'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/guilds')
      return response.data
    },
  })

  // Create guild
  const createMutation = useMutation({
    mutationFn: async (data: { guildData: CreateGuildData; characterName: string }) => {
      const response = await apiClient.post(
        `/api/v1/guilds?character_name=${data.characterName}`,
        data.guildData
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })

  return {
    guilds,
    isLoading,
    error,
    createGuild: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  }
}

export function useGuild(guildId: number) {
  const queryClient = useQueryClient()

  const { data: guild, isLoading, error } = useQuery<Guild>({
    queryKey: ['guild', guildId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/guilds/${guildId}`)
      return response.data
    },
    enabled: !!guildId,
  })

  // Update guild
  const updateMutation = useMutation({
    mutationFn: async (data: CreateGuildData) => {
      const response = await apiClient.patch(`/api/v1/guilds/${guildId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guild', guildId] })
      queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })

  // Delete guild
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/guilds/${guildId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })

  return {
    guild,
    isLoading,
    error,
    updateGuild: updateMutation.mutateAsync,
    deleteGuild: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}
