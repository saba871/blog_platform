const BlogPost = require('../models/BlogPost')
const mongoose = require('mongoose')

// @desc Create a blog post
// @route POST api/posts
// @access Private(Admin only)

const createPost = async (req, res) => {
	try {
		const { title, content, coverImageUrl, tags, isDraft, generatedByAi } = req.body

		const slug = title
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '')

		const newPost = await BlogPost.create({
			title,
			slug,
			content,
			coverImageUrl,
			tags,
			author: req.user._id,
			isDraft,
			generatedByAi,
		})

		res.status(201).json(newPost)
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create post: ',
			error: error.message,
		})
	}
}

// @desc Update an exsisting blog post
// @route POST api/posts/:id
// @access Private(Author or Admin only)

const updatePost = async (req, res) => {
	try {
		const post = await BlogPost.findById(req.params.id)
		if (!post) return res.status(404).json({ message: 'Post Not Found' })

		if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
			return res.status(403).json({ message: 'Not Authorized To Update This Post' })
		}

		const updateData = req.body

		if (updateData.title) {
			updateData.slug = updateData.title
				.toLowerCase()
				.replace(/ /g, '-')
				.replace(/[^\w-]+/g, '')
		}

		const updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true })
		res.json(updatedPost)
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Delete a blog post
// @route POST api/posts/:id
// @access Private(Author or Admin only)

const deletePost = async (req, res) => {
	try {
		const post = await BlogPost.findByIdAndDelete(req.params.id)

		if (!post) {
			return res.status(404).json({ message: 'Post Not Found' })
		}
		await Comment.deleteMany({ post: req.params.id })

		res.json({ message: 'Post Deleted' })
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Get blog posts by status (all, published, draft)
// @route GET api/posts/:slug
// @access Public

const getAllPosts = async (req, res) => {
	try {
		const status = req.query.status || 'published'
		const page = parseInt(req.query.page) || 1
		const limit = 5
		const skip = (page - 1) * limit

		let filter = {}
		if (status == 'published') filter.isDraft = false
		else if (status == 'draft') filter.isDraft = true

		const posts = await BlogPost.find(filter).populate('author', 'name profileImageUrl').sort({ updatedAt: -1 }).skip(skip).limit(limit)

		const [totalCount, allCount, publishedCount, draftCount] = await Promise.all([BlogPost.countDocuments(filter), BlogPost.countDocuments(), BlogPost.countDocuments({ isDraft: false }), BlogPost.countDocuments({ isDraft: true })])

		res.json({
			posts,
			page,
			totalPages: Math.ceil(totalCount / limit),
			totalCount,
			counts: {
				all: allCount,
				published: publishedCount,
				draft: draftCount,
			},
		})
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Get a single blog posts by Slug
// @route GET api/posts/:slug
// @access Public

const getPostBySlug = async (req, res) => {
	try {
		const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author', 'name profileImageUrl')
		if (!post) return res.status(404).json({ message: 'Post not Found' })
		res.json(post)
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Get posts by Tags
// @route GET api/posts/tag/:tag
// @access Public

const getPostByTag = async (req, res) => {
	try {
		const posts = await BlogPost.find({
			tags: req.params.tag,
			isDraft: false,
		}).populate('author', 'name profileImageUrl')
		res.json(posts)
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Search posts by title or content
// @route GET api/posts/search
// @access Public

const searchPosts = async (req, res) => {
	try {
		const q = req.query.q
		const posts = await BlogPost.find({
			isDraft: false,
			$or: [{ title: { $regex: q, $options: 'i' } }, { content: { $regex: q, $options: 'i' } }],
		}).populate('author', 'name profileImageUrl')
		res.json(posts)
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Increment post view
// @route GET api/posts/:id/view
// @access Public

const incrementView = async (req, res) => {
	try {
		await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
		res.json({ message: 'View count incremented' })
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc Like a Post
// @route GET api/posts/:id/like
// @access Public

const likePost = async (req, res) => {
	try {
		await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } })
		res.json({ message: 'Like added' })
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

// @desc get Top trending posts
// @route GET api/posts/trending
// @access Private

const getTopPosts = async (req, res) => {
	try {
		const posts = await BlogPost.find({ isDraft: false }).sort({ views: -1, likes: -1 }).limit(5)

		res.json(posts)
	} catch (error) {
		res.status(500).json({
			message: 'Server Error: ',
			error: error.message,
		})
	}
}

module.exports = {
	createPost,
	updatePost,
	deletePost,
	getAllPosts,
	getPostBySlug,
	getPostByTag,
	searchPosts,
	incrementView,
	likePost,
	getTopPosts,
}
