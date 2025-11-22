import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

interface Character {
  id: number
  name: string
  level: number
  vocation: number
  vocation_name: string
  online: number | null
}

export default function CharactersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // TODO: Implement actual API call
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['characters'],
    queryFn: async () => {
      // Placeholder - replace with actual API call
      return []
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading characters...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Characters</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Create Character
          </button>
        </div>

        {characters && characters.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any characters yet.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Create Your First Character
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters?.map((character) => (
              <Link
                key={character.id}
                to={`/characters/${character.name}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">{character.name}</h2>
                  {character.online && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                      Online
                    </span>
                  )}
                </div>
                <div className="text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Level: {character.level}</p>
                  <p>Vocation: {character.vocation_name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
