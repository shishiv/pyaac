import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api'

interface News {
  id: number
  title: string
  body: string
  author_id: number
  date: number
  category: string | null
  icon: string | null
  type: number | null
  comments: number | null
  hidden: number | null
}

export function useNews(limit: number = 5) {
  const { data: news, isLoading, error } = useQuery<News[]>({
    queryKey: ['news', limit],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/news?limit=${limit}`)
      return response.data
    },
  })

  return {
    news: news || [],
    isLoading,
    error,
  }
}
