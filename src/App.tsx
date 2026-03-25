import { Routes, Route, Navigate } from "react-router";

import { LoginPage } from './pages/Login/Login'
import { RegisterPage } from './pages/Register/Register'
import { HomeLayout } from './layouts/Home/Home'
import { ConnectionsPage } from './pages/Connections/Connections'
import { ConversationsPage } from './pages/Conversations/Conversations'
import { InsightsPage } from './pages/Insights/Insights'
import { VoicePage } from './pages/Voice/Voice'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<HomeLayout />}>
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/conversations/:id" element={<VoicePage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/home" element={<Navigate to="/connections" replace />} />
      </Route>
    </Routes>
  )
}

export default App
