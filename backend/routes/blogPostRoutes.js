const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createPost, getPostBySlug, updatePost, deletePost, getPostByTag, searchPosts, incrementView, likePost, getTopPosts, getAllPosts } = require('../controllers/blogPostController');

const blogPostRoutes = express.Router();

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next()
    } else {
        return res.status(403).json({ message: "Admin Access Only" })
    }
}



blogPostRoutes.post("/", protect, adminOnly, createPost);
blogPostRoutes.get("/", getAllPosts)
blogPostRoutes.get("/slug/:slug", getPostBySlug)
blogPostRoutes.put("/:id", protect, adminOnly, updatePost)
blogPostRoutes.delete("/:id", protect, adminOnly, deletePost)
blogPostRoutes.get("/tag/:tag", getPostByTag)
blogPostRoutes.get("/search", searchPosts)
blogPostRoutes.post("/:id/view", incrementView)
blogPostRoutes.post("/:id/like", protect, likePost)
blogPostRoutes.get("/trending", getTopPosts)


module.exports = blogPostRoutes
