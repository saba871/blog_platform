import moment from 'moment'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { LuChevronDown, LuDot, LuReply, LuTrash2 } from 'react-icons/lu'
import { UserContext } from '../../context/userContext'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import CommentReplyInput from '../Inputs/CommentReplyInput'

const CommentInCard = ({ commentId, authorName, authorPhoto, content, updatedOn, post, postId, replies, getAllComments, onDelete, isSubReply }) => {
	const { user } = useContext(UserContext)
	const [replyText, setReplyText] = useState('')
	const [showReplyForm, setShowReplyForm] = useState(false)
	const [showReplies, setShowReplies] = useState(false)

	// postId prop-იდან ან post ობიექტიდან ამოვიღოთ
	const resolvedPostId = postId || post?._id || post

	const handleCancelReply = () => {
		setReplyText('')
		setShowReplyForm(false)
	}

	const handleAppReply = async () => {
		console.log('post: ', post)
		try {
			await axiosInstance.post(API_PATHS.COMMENTS.ADD(resolvedPostId), {
				content: replyText,
				parentComment: commentId,
			})
			toast.success('Reply Added Sucsessfully')
			setReplyText('')
			setShowReplyForm(false)
			getAllComments()
		} catch (error) {
			console.error('Error adding reply: ', error)
		}
	}

	return (
		<div className={`bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 ${isSubReply ? 'mb-2' : 'mb-4'}`}>
			{/* Main Row */}
			<div className="flex items-start justify-between gap-4">
				{/* Left: Avatar + Content */}
				<div className="flex gap-3 flex-1 min-w-0">
					<img src={authorPhoto} alt={authorName} className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100" />

					<div className="flex-1 min-w-0">
						{/* Author + Date */}
						<div className="flex items-center gap-1 mb-1">
							<h3 className="text-[13px] font-semibold text-gray-700">@{authorName}</h3>
							<LuDot className="text-gray-300" />
							<span className="text-[12px] text-gray-400">{updatedOn}</span>
						</div>

						{/* Comment Text */}
						<p className="text-sm text-gray-800 font-medium leading-relaxed mb-3">{content}</p>

						{/* Actions */}
						<div className="flex items-center gap-2 flex-wrap">
							{!isSubReply && (
								<>
									<button onClick={() => setShowReplyForm(prev => !prev)} className="flex items-center gap-1.5 text-[12px] font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full hover:bg-sky-500 hover:text-white transition-colors duration-150">
										<LuReply size={13} /> Reply
									</button>

									<button onClick={() => setShowReplies(prev => !prev)} className="flex items-center gap-1.5 text-[12px] font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full hover:bg-sky-500 hover:text-white transition-colors duration-150">
										{replies?.length || 0} {replies?.length === 1 ? 'reply' : 'replies'}
										<LuChevronDown size={13} className={`transition-transform duration-200 ${showReplies ? 'rotate-180' : ''}`} />
									</button>
								</>
							)}

							<button onClick={() => onDelete()} className="flex items-center gap-1.5 text-[12px] font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full hover:bg-rose-500 hover:text-white transition-colors duration-150">
								<LuTrash2 size={13} /> Delete
							</button>
						</div>
					</div>
				</div>

				{/* Right: Post Preview */}
				{post && (
					<div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-2 flex-shrink-0 max-w-[240px]">
						<img src={post?.coverImageUrl} alt="post cover" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
						<p className="text-[12px] font-medium text-gray-700 line-clamp-2 leading-snug">{post?.title}</p>
					</div>
				)}
			</div>

			{/* Reply Form */}
			{!isSubReply && showReplyForm && <CommentReplyInput user={user} authorName={authorName} content={content} replyText={replyText} setReplyText={setReplyText} handleAppReply={handleAppReply} handleCancelReply={handleCancelReply} />}

			{/* Nested Replies */}
			{showReplies && replies?.length > 0 && (
				<div className="mt-4 ml-3 pl-4 border-l-2 border-gray-100 space-y-2">
					{replies.map(comment => (
						<CommentInCard
							key={comment._id}
							commentId={comment._id}
							authorName={comment.author.name}
							authorPhoto={comment.author.profileImageUrl}
							content={comment.content}
							post={comment.post}
							postId={resolvedPostId} // ✅ parent-იდან გადაეცემა
							replies={comment.replies || []}
							isSubReply
							updatedOn={comment.updatedAt ? moment(comment.updatedAt).format('Do MMM YYYY') : '_'}
							getAllComments={getAllComments}
							onDelete={() => onDelete(comment._id)}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default CommentInCard
