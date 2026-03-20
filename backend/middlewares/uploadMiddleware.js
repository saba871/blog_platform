const multer = require('multer');

// save image on my disk storage not in Ram
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})


// filter image types which is allow or not
const fileFilter = (req, file, cb) => {
    const allowedType = ["image/jpeg", "image/png", "image/jpg"]

    if (allowedType.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only .jpeg, .png, .jpg formats are allowed"), false)
    }
}

const upload = multer({ storage, fileFilter });

module.exports = { upload }
