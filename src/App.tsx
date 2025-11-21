import { Routes, Route } from "react-router";

import { LoginPage } from './pages/Login/Login'
import { RegisterPage } from './pages/Register/Register'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
