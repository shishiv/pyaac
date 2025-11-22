import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCharacters } from '@/hooks/useCharacters'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createCharacterSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(29, 'Name must be at most 29 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  vocation: z.number().min(0).max(8),
  sex: z.number().min(0).max(1),
})

type CreateCharacterForm = z.infer<typeof createCharacterSchema>

export default function CharactersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { characters, isLoading, createCharacter, isCreating } = useCharacters()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCharacterForm>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      vocation: 0,
      sex: 1,
    },
  })

  const onSubmit = async (data: CreateCharacterForm) => {
    try {
      await createCharacter(data)
      setIsCreateModalOpen(false)
      reset()
    } catch (error) {
      console.error('Failed to create character:', error)
    }
  }

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
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Character</Button>
        </div>

        {characters && characters.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any characters yet.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Character
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters?.map((character) => (
              <Link
                key={character.id}
                to={`/characters/${character.name}`}
                className="block"
              >
                <Card className="hover:shadow-lg transition-shadow">
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
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Character"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} isLoading={isCreating}>
              Create
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Character Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="vocation" className="block text-sm font-medium mb-1">
              Vocation
            </label>
            <select
              {...register('vocation', { valueAsNumber: true })}
              id="vocation"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              <option value={0}>None</option>
              <option value={1}>Sorcerer</option>
              <option value={2}>Druid</option>
              <option value={3}>Paladin</option>
              <option value={4}>Knight</option>
            </select>
          </div>

          <div>
            <label htmlFor="sex" className="block text-sm font-medium mb-1">
              Gender
            </label>
            <select
              {...register('sex', { valueAsNumber: true })}
              id="sex"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              <option value={0}>Female</option>
              <option value={1}>Male</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
