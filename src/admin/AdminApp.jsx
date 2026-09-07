import { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import { isLoggedIn } from './adminService'

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />
  }

  return <AdminDashboard onLogout={() => setLoggedIn(false)} />
}
