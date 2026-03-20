const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { addComment, getCommentsByPost, getAllComments, deleteComment } = require('../controllers/commentsController');

const commentsRoutes = express.Router();

commentsRoutes.post("/:postId", protect, addComment)
commentsRoutes.get("/", getAllComments)
commentsRoutes.get("/:postId", getCommentsByPost)
commentsRoutes.delete("/:commentId", protect, deleteComment)

module.exports = { commentsRoutes }
