const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Connect Database
connectDB()

// Middleware
app.use(express.json())

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true
	})
)

app.get('/', (req, res) => {
	res.send('API Running Successfully')
})

// Define Routes
app.use('/api/user', require('./route/user'))
app.use('/api/auth', require('./route/auth'))
app.use('/api/profile', require('./route/profile'))
app.use('/api/post', require('./route/post'))

// Start Server
const PORT = process.env.PORT || 6001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
