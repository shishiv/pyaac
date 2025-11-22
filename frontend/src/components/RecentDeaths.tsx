import { useRecentDeaths } from '@/hooks/useDeaths'
import Card from '@/components/Card'

interface RecentDeathsProps {
  limit?: number
}

export default function RecentDeaths({ limit = 10 }: RecentDeathsProps) {
  const { deaths, isLoading } = useRecentDeaths(limit)

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000
    const diff = now - timestamp

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <Card title="Recent Deaths">
      {isLoading ? (
        <div className="text-center py-4">Loading deaths...</div>
      ) : deaths.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No recent deaths
        </div>
      ) : (
        <div className="space-y-3">
          {deaths.map((death) => (
            <div
              key={death.id}
              className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {death.player_name}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400"> (Level {death.level})</span>
                  <span className="text-gray-700 dark:text-gray-300"> was killed by </span>
                  <span
                    className={
                      death.is_player
                        ? 'font-medium text-red-600 dark:text-red-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }
                  >
                    {death.killed_by}
                  </span>
                </p>
                {death.mostdamage_by && death.mostdamage_by !== death.killed_by && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Most damage by {death.mostdamage_by}
                  </p>
                )}
              </div>
              <div className="ml-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatTimeAgo(death.time)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
