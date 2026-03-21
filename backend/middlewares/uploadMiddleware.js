const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: 'blog-platform',
		allowed_formats: ['jpeg', 'png', 'jpg'],
	},
})

const fileFilter = (req, file, cb) => {
	const allowedType = ['image/jpeg', 'image/png', 'image/jpg']
	if (allowedType.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(new Error('Only .jpeg, .png, .jpg formats are allowed'), false)
	}
}

const upload = multer({ storage, fileFilter })

module.exports = { upload }
