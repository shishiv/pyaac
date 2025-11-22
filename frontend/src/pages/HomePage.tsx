export default function HomePage() {
  return (
    <div className="px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to PyAAC
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Python Alternative to MyAAC for Open Tibia Servers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Modern & Fast</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Built with FastAPI and React for optimal performance
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Type Safe</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Full type hints with Python and TypeScript
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Compatible</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Works with existing OTS database schemas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
