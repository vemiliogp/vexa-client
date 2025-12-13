import { Routes, Route, Navigate } from "react-router";

import { LoginPage } from './pages/Login/Login'
import { RegisterPage } from './pages/Register/Register'
import { HomeLayout } from './layouts/Home/Home'
import { ConnectionsPage } from './pages/Connections/Connections'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<HomeLayout />}>
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/home" element={<Navigate to="/connections" replace />} />
      </Route>
    </Routes>
  )
}

export default App
