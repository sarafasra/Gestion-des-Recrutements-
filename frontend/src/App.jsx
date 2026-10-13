import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import UserManagement from './pages/admin/UserManagement'
import AdminDashboard from './pages/admin/AdminDashboard' // <--- Importi l-page
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* <--- Route dyal Supervision */}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App