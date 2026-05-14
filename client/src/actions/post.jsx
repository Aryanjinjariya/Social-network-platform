import axios from 'axios'
import { setAlert } from './alert'
import {
	ADD_COMMENT,
	ADD_POST,
	DELETE_COMMENT,
	DELETE_POST,
	GET_POST,
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKES
} from './types'

//GET ALL Posts
export const getPosts = () => async dispatch => {
	try {
		const res = await axios.get('http://localhost:6001/api/post')

		dispatch({
			type: GET_POSTS,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

// Add like
export const addLike = id => async dispatch => {
	try {
		const res = await axios.put(`http://localhost:6001/api/post/like/${id}`)

		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: res.data }
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

// Remove like
export const removeLike = id => async dispatch => {
	try {
		const res = await axios.put(`http://localhost:6001/api/post/unlike/${id}`)

		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: res.data }
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

//Delete Post
export const deletePost = id => async dispatch => {
	try {
		const res = await axios.delete(`http://localhost:6001/api/post/${id}`)

		dispatch({
			type: DELETE_POST,
			payload: id
		})
		dispatch(setAlert('Post Removed', 'success'))
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

//Add Post
export const addPost = formdata => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	try {
		const res = await axios.post(
			'http://localhost:6001/api/post',
			formdata,
			config
		)

		dispatch({
			type: ADD_POST,
			payload: res.data
		})
		dispatch(setAlert('Post Added', 'success'))
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}
//GET  Post
export const getPost = id => async dispatch => {
	try {
		const res = await axios.get(`http://localhost:6001/api/post/${id}`)

		dispatch({
			type: GET_POST,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}

//Add Comment
export const addComment = (postId, formdata) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}
	try {
		const res = await axios.post(
			`http://localhost:6001/api/post/comment/${postId}`,
			formdata,
			config
		)

		dispatch({
			type: ADD_COMMENT,
			payload: res.data
		})
		dispatch(setAlert('Comment Added', 'success'))
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}
//Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
	try {
		await axios.delete(
			`http://localhost:6001/api/post/comment/${postId}/${commentId}`
		)

		dispatch({
			type: DELETE_COMMENT,
			payload: commentId
		})
		dispatch(setAlert('Comment Removed', 'success'))
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				msg: err.response?.statusText || 'Server Error',
				status: err.response?.status || 500
			}
		})
	}
}
