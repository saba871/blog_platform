const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const { upload } = require("../middlewares/uploadMiddleware");


const authRoutes = express.Router();


authRoutes.post("/register", registerUser); // register user
authRoutes.post("/login", loginUser) // login user
authRoutes.get("/profile", protect, getUserProfile) // get user profile


authRoutes.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No File Uploaded" })
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl: imageUrl})
})

module.exports = authRoutes;
