const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// @desc add Comment
// @route POST api/comment/:postId
// @access Private

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    const post = await BlogPost.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });

    await comment.populate('author', 'name profileImageUrl');
    res.status(201).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to add comment', error: error.message });
  }
};

// @desc get all Comments
// @route POST api/comment
// @access Public

const getAllComments = async (req, res) => {
  try {
    // 1. წამოვიღოთ ყველა კომენტარი და დავალაგოთ დროით
    const comments = await Comment.find()
      .populate('author', 'name profileImageUrl')
      .populate('post', 'title coverImageUrl')
      .sort({ createdAt: 1 });

    // 2. შევქმნათ Map სწრაფი ძებნისთვის
    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject(); // ვაქცევთ ობიექტად
      comment.replies = []; // ვამზადებთ ადგილს პასუხებისთვის
      commentMap[comment._id] = comment; // ვინახავთ Map-ში
    });

    // 3. დავალაგოთ "შვილები" "მშობლების" ქვეშ
    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        // თუ პასუხია, ვპოულობთ მშობელს Map-ში
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        // თუ მთავარი კომენტარია, ვამატებთ მთავარ სიაში
        nestedComments.push(commentMap[comment._id]);
      }
    });

    res.json(nestedComments);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch comments', error: error.message });
  }
};

// @desc get all Comments for a blog post
// @route GET api/comment/:postId
// @access Public

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name profileImageUrl')
      .populate('post', 'title coverImageUrl')
      .sort({ createdAt: 1 });

    // 2. შევქმნათ Map სწრაფი ძებნისთვის
    const commentMap = {};
    comments.forEach((comment) => {
      comment = comment.toObject(); // ვაქცევთ ობიექტად
      comment.replies = []; // ვამზადებთ ადგილს პასუხებისთვის
      commentMap[comment._id] = comment; // ვინახავთ Map-ში
    });

    // 3. დავალაგოთ "შვილები" "მშობლების" ქვეშ
    const nestedComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        // თუ პასუხია, ვპოულობთ მშობელს Map-ში
        const parent = commentMap[comment.parentComment];
        if (parent) {
          parent.replies.push(commentMap[comment._id]);
        }
      } else {
        // თუ მთავარი კომენტარია, ვამატებთ მთავარ სიაში
        nestedComments.push(commentMap[comment._id]);
      }
    });

    res.json(nestedComments);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch comments', error: error.message });
  }
};

// @desc Delete A comment
// @route POST api/comment/:commentId
// @access Private

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment Not Found' });
    }

    // delete comment
    await Comment.deleteOne({ _id: commentId });

    // delete all replays to
    await Comment.deleteMany({ parentComment: commentId });
    res.json({ message: 'Comment and replay deleted succsessfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete a comment', error: error.message });
  }
};

module.exports = {
  addComment,
  getAllComments,
  getCommentsByPost,
  deleteComment,
};
