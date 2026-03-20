import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const PriveRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext)
  if (loading) {
    return <p>Loading...</p>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PriveRoute
