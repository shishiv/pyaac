import { useParams, useNavigate } from 'react-router-dom'
import { useGuild } from '@/hooks/useGuilds'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import { useState } from 'react'

export default function GuildDetailPage() {
  const { guildId } = useParams<{ guildId: string }>()
  const navigate = useNavigate()
  const { guild, isLoading, deleteGuild, isDeleting } = useGuild(Number(guildId))
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteGuild()
      navigate('/guilds')
    } catch (error) {
      console.error('Failed to delete guild:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading guild...</div>
      </div>
    )
  }

  if (!guild) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Guild not found</p>
            <Button onClick={() => navigate('/guilds')}>Back to Guilds</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{guild.name}</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={() => navigate('/guilds')}>
            Back
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Disband Guild
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card title="Guild Information">
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400 block mb-1">
                Message of the Day:
              </span>
              <p className="italic">"{guild.motd}"</p>
            </div>
            {guild.description && (
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-1">Description:</span>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {guild.description}
                </p>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Members:</span>
              <span className="font-semibold">{guild.member_count}</span>
            </div>
          </div>
        </Card>

        {/* Members Section - Placeholder */}
        <Card title="Members">
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            Member list coming soon...
          </p>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Disband Guild"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Disband
            </Button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to disband <strong>{guild.name}</strong>? This action cannot be
          undone and all members will lose their guild membership.
        </p>
      </Modal>
    </div>
  )
}
