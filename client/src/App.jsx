import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { loadUser } from './actions/auth'
import './App.css'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import Alert from './components/layout/Alert'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import Post from './components/post/Post'
import Posts from './components/posts/Posts'
import AddEducation from './components/profile-forms/AddEducation'
import AddExperience from './components/profile-forms/AddExperience'
import CreateProfile from './components/profile-forms/CreateProfile'
import EditProfile from './components/profile-forms/EditProfile'
import Profile from './components/profile/Profile'
import Profiles from './components/profiles/Profiles'
import PrivateRoute from './routing/PrivateRoute'
import store from './store'
import setAuthToken from './utils/setAuthToken'

if (localStorage.token) {
	setAuthToken(localStorage.token)
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser())
	}, [])

	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<section className='container'>
					<Alert />
					<Routes>
						<Route path='/' element={<Landing />} />
						<Route path='/register' element={<Register />} />
						<Route path='/login' element={<Login />} />
						<Route path='/profiles' element={<Profiles />} />
						<Route path='/profile/:id' element={<Profile />} />
						{/* ✅ Protected Route Wrapper */}
						<Route element={<PrivateRoute />}>
							<Route path='/dashboard' element={<Dashboard />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route path='/create-profile' element={<CreateProfile />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route path='/edit-profile' element={<EditProfile />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route path='/add-experience' element={<AddExperience />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route path='/add-education' element={<AddEducation />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route path='/posts' element={<Posts />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route path='/post/:id' element={<Post />} />
						</Route>
					</Routes>
				</section>
			</Router>
		</Provider>
	)
}

export default App
