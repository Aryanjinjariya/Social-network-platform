import { configureStore } from '@reduxjs/toolkit'
import { thunk as thunkMiddleware } from 'redux-thunk' // ✅ FIX: Use named import
import rootReducer from './reducers'
const initialState = {}
const store = configureStore({
	preloadedState: initialState,
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(thunkMiddleware)
})

export default store
