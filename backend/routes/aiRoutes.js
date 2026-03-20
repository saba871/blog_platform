const express = require('express')
const aiRoutes = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { generateByBlogPost, generateBlogPostIdeas, generateCommentReply, generatePostSummary } = require('../controllers/aiController')


aiRoutes.post("/generate", protect, generateByBlogPost)
aiRoutes.post("/generate-ideas", protect, generateBlogPostIdeas)
aiRoutes.post("/generate-reply", protect, generateCommentReply)
aiRoutes.post("/generate-summary", generatePostSummary)

module.exports = { aiRoutes }
