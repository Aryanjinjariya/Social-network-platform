// routing/PrivateRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
	const { isAuthenticated, loading } = useSelector(state => state.auth)

	if (loading) return null // or spinner

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute
