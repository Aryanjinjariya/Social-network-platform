import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import { setAlert } from './alert'
import { clearProfile, getCurrentProfile } from './profile'
import {
	AUTH_ERROR,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
	REGISTER_FAIL,
	REGISTER_SUCCESS,
	USER_LOADED
} from './types'

// ✅ Load User
export const loadUser = () => async dispatch => {
	if (localStorage.token) {
		setAuthToken(localStorage.token) // ✅ sets Authorization header
	}

	try {
		const res = await axios.get('http://localhost:6001/api/auth')
		dispatch({
			type: USER_LOADED,
			payload: res.data
		})
	} catch (err) {
		dispatch({ type: AUTH_ERROR })
	}
}
// ✅ Register User
export const register =
	({ name, email, password }) =>
	async dispatch => {
		const config = { headers: { 'Content-Type': 'application/json' } }
		const body = JSON.stringify({ name, email, password })

		try {
			const res = await axios.post(
				'http://localhost:6001/api/user',
				body,
				config
			)

			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data // { token, user }
			})
			dispatch(loadUser())
		} catch (err) {
			if (err.response && err.response.data.errors) {
				err.response.data.errors.forEach(error =>
					dispatch(setAlert(error.msg, 'danger'))
				)
			}
			dispatch({ type: REGISTER_FAIL })
		}
	}
// ✅ Login User
export const login = (email, password) => async dispatch => {
	const config = { headers: { 'Content-Type': 'application/json' } }
	const body = JSON.stringify({ email, password })

	try {
		const res = await axios.post('http://localhost:6001/api/auth', body, config)

		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data // { token }
		})
		dispatch(loadUser())
		dispatch(getCurrentProfile())
	} catch (err) {
		const errors = err.response?.data?.errors
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}

		dispatch({ type: LOGIN_FAIL })
	}
}

// ✅ Logout
export const logout = () => async dispatch => {
	dispatch(clearProfile())
	dispatch({ type: LOGOUT })
}
