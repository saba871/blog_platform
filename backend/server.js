require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const blogPostRoutes = require('./routes/blogPostRoutes')
const { commentsRoutes } = require('./routes/commentsRoutes')
const { dashboardRoutes } = require('./routes/dashboardRoutes')
const { aiRoutes } = require('./routes/aiRoutes')

const app = express()

// middleware to handle Cors
app.use(
	cors({
		origin: 'https://blog-platform-nu-gilt.vercel.app',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
)

// connect database
connectDB()

// middleware
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', blogPostRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/dashboard-summary', dashboardRoutes)

app.use('/api/ai', aiRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {}))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`))
