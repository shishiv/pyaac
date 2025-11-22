import { useServerStatus, useOnlinePlayers } from '@/hooks/useServer'
import Card from '@/components/Card'

export default function ServerStatusPage() {
  const { status, isLoading: statusLoading } = useServerStatus()
  const { players, isLoading: playersLoading } = useOnlinePlayers()

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Server Status</h1>

        {/* Server Info Card */}
        <Card className="mb-6">
          {statusLoading ? (
            <div className="text-center py-4">Loading server status...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <p className="mt-1 flex items-center">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      status?.online ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-lg font-semibold">
                    {status?.online ? 'Online' : 'Offline'}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Players Online
                </h3>
                <p className="mt-1 text-lg font-semibold">
                  {status?.players_online} / {status?.players_max}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
                <p className="mt-1 text-lg font-semibold">{status?.uptime}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</h3>
                <p className="mt-1 text-lg font-semibold">{status?.version}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Online Players */}
        <Card title={`Players Online (${status?.players_online || 0})`}>
          {playersLoading ? (
            <div className="text-center py-8">Loading online players...</div>
          ) : players && players.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No players online
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Vocation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {players?.map((player) => (
                    <tr key={player.name}>
                      <td className="px-6 py-4 whitespace-nowrap">{player.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.level}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{player.vocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
