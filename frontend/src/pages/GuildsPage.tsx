import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGuilds } from '@/hooks/useGuilds'
import { useCharacters } from '@/hooks/useCharacters'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createGuildSchema = z.object({
  name: z
    .string()
    .min(3, 'Guild name must be at least 3 characters')
    .max(255, 'Guild name must be at most 255 characters'),
  motd: z.string().max(255, 'MOTD must be at most 255 characters').default(''),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  characterName: z.string().min(1, 'Please select a character'),
})

type CreateGuildForm = z.infer<typeof createGuildSchema>

export default function GuildsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { guilds, isLoading, createGuild, isCreating } = useGuilds()
  const { characters } = useCharacters()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGuildForm>({
    resolver: zodResolver(createGuildSchema),
  })

  const onSubmit = async (data: CreateGuildForm) => {
    try {
      await createGuild({
        guildData: {
          name: data.name,
          motd: data.motd,
          description: data.description,
        },
        characterName: data.characterName,
      })
      setIsCreateModalOpen(false)
      reset()
    } catch (error) {
      console.error('Failed to create guild:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading guilds...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Guilds</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Guild</Button>
        </div>

        {guilds && guilds.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No guilds exist yet. Be the first to create one!
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Create First Guild</Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guilds?.map((guild) => (
              <Link key={guild.id} to={`/guilds/${guild.id}`} className="block">
                <Card className="hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{guild.name}</h2>
                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="text-sm italic">"{guild.motd}"</p>
                    <p className="text-sm">Members: {guild.member_count}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Guild Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Guild"
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
              Guild Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="characterName" className="block text-sm font-medium mb-1">
              Guild Leader (Your Character)
            </label>
            <select
              {...register('characterName')}
              id="characterName"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            >
              <option value="">Select a character</option>
              {characters?.map((char) => (
                <option key={char.id} value={char.name}>
                  {char.name} (Level {char.level})
                </option>
              ))}
            </select>
            {errors.characterName && (
              <p className="mt-1 text-sm text-red-600">{errors.characterName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="motd" className="block text-sm font-medium mb-1">
              Message of the Day
            </label>
            <input
              {...register('motd')}
              type="text"
              id="motd"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.motd && <p className="mt-1 text-sm text-red-600">{errors.motd.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  )
}
