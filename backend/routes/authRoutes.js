const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController')
const { upload } = require('../middlewares/uploadMiddleware')

const authRoutes = express.Router()

authRoutes.post('/register', registerUser)
authRoutes.post('/login', loginUser)
authRoutes.get('/profile', protect, getUserProfile)

authRoutes.post('/upload-image', upload.single('image'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No File Uploaded' })
	}

	const imageUrl = req.file.path
	res.status(200).json({ imageUrl: imageUrl })
})

module.exports = authRoutes
