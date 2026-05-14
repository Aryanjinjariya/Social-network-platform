// actions/profile.js
import axios from 'axios'
import { setAlert } from './alert'
import {
	Account_DELETED,
	CLEAR_PROFILE,
	GET_PROFILE,
	GET_PROFILES,
	GET_REPOS,
	PROFILE_ERROR,
	UPDATE_PROFILE
} from './types'

// Get current profile
export const getCurrentProfile = () => async dispatch => {
	try {
		const res = await axios.get(
			'https://social-network-platform-rsf7.onrender.com/api/profile/me'
		)

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})
	} catch (err) {
		console.error('PROFILE ERROR:', err?.response || err.message)

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

// Get profiles
export const getProfiles = () => async dispatch => {
	dispatch({ type: CLEAR_PROFILE })
	try {
		const res = await axios.get(
			'https://social-network-platform-rsf7.onrender.com/api/profile'
		)

		dispatch({
			type: GET_PROFILES,
			payload: res.data
		})
	} catch (err) {
		console.error('PROFILE ERROR:', err?.response || err.message)

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}
// Get profile by ID
export const getProfileById = userid => async dispatch => {
	try {
		const res = await axios.get(
			`https://social-network-platform-rsf7.onrender.com/api/profile/user/${userid}`
		)

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})
	} catch (err) {
		console.error('PROFILE ERROR:', err?.response || err.message)

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}
// Get Github repos
export const getGithubRepos = username => async dispatch => {
	try {
		const res = await axios.get(
			`https://social-network-platform-rsf7.onrender.com/api/profile/github/${username}`
		)

		dispatch({
			type: GET_REPOS,
			payload: res.data
		})
	} catch (err) {
		console.error('PROFILE ERROR:', err?.response || err.message)

		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

// Clear profile
export const clearProfile = () => async dispatch => {
	console.log('👉 Clearing profile')
	dispatch({ type: CLEAR_PROFILE })
}

//create or update profile
export const createProfile =
	(formData, navigate, edit = false) =>
	async dispatch => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json'
				}
			}

			const res = await axios.post(
				'https://social-network-platform-rsf7.onrender.com/api/profile',
				formData,
				config
			)

			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})

			dispatch(
				setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success')
			)

			// ✅ Replace history.push with navigate
			if (!edit) {
				navigate('/dashboard')
			}
		} catch (err) {
			const errors = err.response?.data?.errors
			if (errors) {
				errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
			}
			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response?.statusText || 'Server Error',
					status: err.response?.status || 500
				}
			})
		}
	}

// Add Experience
export const addExperience = (formData, navigate) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const res = await axios.put(
			'https://social-network-platform-rsf7.onrender.com/api/profile/experience',
			formData,
			config
		)

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		})

		dispatch(setAlert('Experience Added', 'success'))

		// ✅ Replace history.push with navigate

		navigate('/dashboard')
	} catch (err) {
		const errors = err.response?.data?.errors
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

// Add Education
export const addEducation = (formData, navigate) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const res = await axios.put(
			'https://social-network-platform-rsf7.onrender.com/api/profile/education',
			formData,
			config
		)

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		})

		dispatch(setAlert('Education Added', 'success'))

		// ✅ Correct: redirect after successful submission
		navigate('/dashboard')
	} catch (err) {
		const errors = err.response?.data?.errors
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

//Delete experience
export const deleteExperience = id => async dispatch => {
	try {
		const res = await axios.delete(
			`https://social-network-platform-rsf7.onrender.com/api/profile/experience/${id}`
		)
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		})
		dispatch(setAlert('Experience Removed', 'success'))
	} catch (err) {
		const errors = err.response?.data?.errors
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

//Delete education
export const deleteEducation = id => async dispatch => {
	try {
		const res = await axios.delete(
			`https://social-network-platform-rsf7.onrender.com/api/profile/education/${id}`
		)
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data
		})
		dispatch(setAlert('Education Removed', 'success'))
	} catch (err) {
		const errors = err.response?.data?.errors
		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

//Delete Account & Profile
export const deleteAccount = () => async dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone!')) {
		try {
			await axios.delete(
				'https://social-network-platform-rsf7.onrender.com/api/profile'
			)

			dispatch({ type: CLEAR_PROFILE })
			dispatch({ type: Account_DELETED })
			dispatch(setAlert('Account Deleted', 'success'))
		} catch (err) {
			const errors = err.response?.data?.errors
			if (errors) {
				errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
			}

			dispatch({
				type: PROFILE_ERROR,
				payload: {
					msg: err.response?.statusText || 'Server Error',
					status: err.response?.status || 500
				}
			})
		}
	}
}
