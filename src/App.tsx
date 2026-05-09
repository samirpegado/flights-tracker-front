import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Travels from './pages/Travels'
import TravelDetail from './pages/TravelDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/travels" element={<ProtectedRoute><Travels /></ProtectedRoute>} />
          <Route path="/travels/:id" element={<ProtectedRoute><TravelDetail /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/travels" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
