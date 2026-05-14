import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		historyApiFallback: true,
		watch: {
			usePolling: true
		},
		hmr: {
			overlay: false // Disable error overlay
		} // ✅ Ensures React Router works in Vite
	}
})
