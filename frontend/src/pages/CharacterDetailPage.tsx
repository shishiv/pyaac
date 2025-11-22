import { useParams, useNavigate } from 'react-router-dom'
import { useCharacter, useCharacters } from '@/hooks/useCharacters'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import { useState } from 'react'

export default function CharacterDetailPage() {
  const { characterName } = useParams<{ characterName: string }>()
  const navigate = useNavigate()
  const { character, isLoading } = useCharacter(characterName || '')
  const { deleteCharacter, isDeleting } = useCharacters()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = async () => {
    if (!characterName) return
    try {
      await deleteCharacter(characterName)
      navigate('/characters')
    } catch (error) {
      console.error('Failed to delete character:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading character...</div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Character not found</p>
            <Button onClick={() => navigate('/characters')}>Back to Characters</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">{character.name}</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={() => navigate('/characters')}>
            Back
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            Delete Character
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card title="Basic Information">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Level:</span>
              <span className="font-semibold">{character.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vocation:</span>
              <span className="font-semibold">{character.vocation_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Experience:</span>
              <span className="font-semibold">{character.experience.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span
                className={`font-semibold ${character.online ? 'text-green-600' : 'text-gray-600'}`}
              >
                {character.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </Card>

        {/* Health & Mana */}
        <Card title="Health & Mana">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Health:</span>
                <span className="font-semibold">
                  {character.health} / {character.healthmax}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${(character.health / character.healthmax) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 dark:text-gray-400">Mana:</span>
                <span className="font-semibold">
                  {character.mana} / {character.manamax}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${character.manamax > 0 ? (character.mana / character.manamax) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Soul:</span>
              <span className="font-semibold">{character.soul}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
              <span className="font-semibold">{character.cap}</span>
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card title="Skills">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Magic Level:</span>
              <span className="font-semibold">{character.maglevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fist Fighting:</span>
              <span className="font-semibold">{character.skill_fist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Club Fighting:</span>
              <span className="font-semibold">{character.skill_club}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sword Fighting:</span>
              <span className="font-semibold">{character.skill_sword}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Axe Fighting:</span>
              <span className="font-semibold">{character.skill_axe}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Distance Fighting:</span>
              <span className="font-semibold">{character.skill_dist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shielding:</span>
              <span className="font-semibold">{character.skill_shielding}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fishing:</span>
              <span className="font-semibold">{character.skill_fishing}</span>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card title="Additional Information">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Gender:</span>
              <span className="font-semibold">{character.sex === 1 ? 'Male' : 'Female'}</span>
            </div>
            {character.stamina !== null && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Stamina:</span>
                <span className="font-semibold">{character.stamina} minutes</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Character"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <strong>{character.name}</strong>? This action cannot
          be undone.
        </p>
      </Modal>
    </div>
  )
}
