import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api'

interface Guild {
  id: number
  name: string
  ownerid: number
  creationdata: number
  motd: string
  description?: string
  member_count?: number
}

export function useGuild(guildId: number) {
  const queryClient = useQueryClient()

  const { data: guild, isLoading, error } = useQuery<Guild>({
    queryKey: ['guild', guildId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/guilds/${guildId}`)
      return response.data
    },
    enabled: !!guildId && !isNaN(guildId),
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/guilds/${guildId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guilds'] })
      queryClient.removeQueries({ queryKey: ['guild', guildId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { motd?: string; description?: string }) => {
      const response = await apiClient.patch(`/api/v1/guilds/${guildId}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guild', guildId] })
      queryClient.invalidateQueries({ queryKey: ['guilds'] })
    },
  })

  return {
    guild,
    isLoading,
    error,
    deleteGuild: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    updateGuild: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}
