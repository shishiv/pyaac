import { useState } from 'react'
import { useHighscores, HighscoreType } from '@/hooks/useHighscores'
import Card from '@/components/Card'
import { VOCATIONS, getVocationName } from '@/lib/vocations'
import { SKILLS, getSkillName } from '@/lib/skills'

export default function HighscoresPage() {
  const [activeTab, setActiveTab] = useState<'experience' | 'magic' | 'skill'>('experience')
  const [selectedSkill, setSelectedSkill] = useState('fist')
  const [selectedVocation, setSelectedVocation] = useState<number | undefined>(undefined)

  const { highscores, isLoading } = useHighscores(
    activeTab,
    activeTab === 'skill' ? selectedSkill : undefined,
    selectedVocation,
    100
  )

  const getValueColumn = (entry: any) => {
    if (activeTab === 'experience') return entry.experience?.toLocaleString() || '0'
    if (activeTab === 'magic') return entry.maglevel || '0'
    return entry.skill_value || '0'
  }

  const getColumnHeader = () => {
    if (activeTab === 'experience') return 'Experience'
    if (activeTab === 'magic') return 'Magic Level'
    return SKILLS.find((s) => s.name === selectedSkill)?.label || 'Skill'
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Highscores</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('experience')}
              className={`${
                activeTab === 'experience'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('magic')}
              className={`${
                activeTab === 'magic'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Magic Level
            </button>
            <button
              onClick={() => setActiveTab('skill')}
              className={`${
                activeTab === 'skill'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Skills
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Skill selector (only for skill tab) */}
          {activeTab === 'skill' && (
            <div>
              <label className="block text-sm font-medium mb-2">Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 min-w-[200px]"
              >
                {SKILLS.map((skill) => (
                  <option key={skill.name} value={skill.name}>
                    {skill.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Vocation filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Vocation</label>
            <select
              value={selectedVocation ?? 'all'}
              onChange={(e) =>
                setSelectedVocation(e.target.value === 'all' ? undefined : Number(e.target.value))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 min-w-[200px]"
            >
              <option value="all">All Vocations</option>
              {Object.entries(VOCATIONS).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Highscores Table */}
        {isLoading ? (
          <div className="text-center py-8">Loading highscores...</div>
        ) : highscores.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No characters found for this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Character
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Vocation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {getColumnHeader()}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {highscores.map((entry) => (
                  <tr
                    key={entry.rank}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      #{entry.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {VOCATIONS[entry.vocation] || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {getValueColumn(entry)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
