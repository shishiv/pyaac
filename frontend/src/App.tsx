import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CharactersPage from './pages/CharactersPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import GuildsPage from './pages/GuildsPage'
import GuildDetailPage from './pages/GuildDetailPage'
import AccountSettingsPage from './pages/AccountSettingsPage'
import ServerStatusPage from './pages/ServerStatusPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/server-status" element={<ServerStatusPage />} />

        {/* Protected Routes */}
        <Route
          path="/characters"
          element={
            <ProtectedRoute>
              <CharactersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/characters/:characterName"
          element={
            <ProtectedRoute>
              <CharacterDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guilds"
          element={
            <ProtectedRoute>
              <GuildsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guilds/:guildId"
          element={
            <ProtectedRoute>
              <GuildDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/settings"
          element={
            <ProtectedRoute>
              <AccountSettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
