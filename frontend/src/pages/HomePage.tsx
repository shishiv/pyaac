import { Link } from 'react-router-dom'
import { useNews } from '@/hooks/useNews'
import { useServerStatus } from '@/hooks/useServer'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function HomePage() {
  const { news, isLoading: newsLoading } = useNews(3)
  const { status, isLoading: statusLoading } = useServerStatus()

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to PyAAC
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Python Alternative to MyAAC for Open Tibia Servers - Modern, Fast, and Type-Safe
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Create Account</Button>
          </Link>
          <Link to="/server-status">
            <Button variant="secondary" size="lg">
              Server Status
            </Button>
          </Link>
        </div>
      </div>

      {/* Server Status */}
      <div className="mb-12">
        <Card title="Server Status">
          {statusLoading ? (
            <div className="text-center py-4">Loading server status...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      status?.online ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-lg font-semibold">
                    {status?.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Server Status</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {status?.players_online || 0}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Players Online</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {status?.players_max || 0}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Max Players</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Latest News */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest News</h2>
        </div>
        {newsLoading ? (
          <div className="text-center py-8">Loading news...</div>
        ) : news.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No news articles yet. Check back soon!
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {news.map((article) => (
              <Card key={article.id} title={article.title}>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {formatDate(article.date)}
                    {article.category && (
                      <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs uppercase">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                    {article.body.length > 300
                      ? `${article.body.substring(0, 300)}...`
                      : article.body}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="🚀 Modern & Fast">
            <p className="text-gray-600 dark:text-gray-400">
              Built with FastAPI (Python) and React for optimal performance and developer
              experience.
            </p>
          </Card>
          <Card title="🔒 Type Safe">
            <p className="text-gray-600 dark:text-gray-400">
              Full type hints with Python and TypeScript, reducing bugs and improving code
              quality.
            </p>
          </Card>
          <Card title="✅ Compatible">
            <p className="text-gray-600 dark:text-gray-400">
              Works seamlessly with existing OTS database schemas (TFS, Canary, OTServBR).
            </p>
          </Card>
          <Card title="🎨 Beautiful UI">
            <p className="text-gray-600 dark:text-gray-400">
              Modern, responsive interface built with Tailwind CSS and Headless UI
              components.
            </p>
          </Card>
          <Card title="⚡ Real-time">
            <p className="text-gray-600 dark:text-gray-400">
              Live server status updates, character management, and guild features.
            </p>
          </Card>
          <Card title="🔐 Secure">
            <p className="text-gray-600 dark:text-gray-400">
              JWT authentication, bcrypt password hashing, and secure API endpoints.
            </p>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your account today and join the adventure!
          </p>
          <Link to="/register">
            <Button size="lg">Create Account Now</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
