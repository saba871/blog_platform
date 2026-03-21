import moment from 'moment'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { LuChevronDown, LuDot, LuReply, LuTrash2 } from 'react-icons/lu'
import { UserContext } from '../context/userContext'
import { API_PATHS } from '../utils/apiPath'
import axiosInstance from '../utils/axiosInstance'
import CommentReplyInput from './Inputs/CommentReplyInput'

const CommentInfoCard = ({ commentId, authorName, authorPhoto, content, updatedOn, post, replies, getAllComments, onDelete, isSubReply = false }) => {
	const { user, setOpenAuthForm } = useContext(UserContext)
	const [replyText, setReplyText] = useState('')
	const [showReplyForm, setShowReplyForm] = useState(false)
	const [showSubReplies, setShowSubReplies] = useState(false)

	const handleCancelReply = () => {
		setReplyText('')
		setShowReplyForm(false)
	}

	const handleAddReply = async () => {
		if (!replyText.trim()) return
		try {
			const postId = post?._id || post
			await axiosInstance.post(API_PATHS.COMMENTS.ADD(postId), {
				content: replyText,
				parentComment: commentId,
			})
			toast.success('Reply added successfully')
			setReplyText('')
			setShowReplyForm(false)
			getAllComments()
		} catch (error) {
			console.error('Error adding reply.: ', error)
			toast.error('Failed to add reply')
		}
	}

	return (
		<div className={`group relative flex gap-3 ${!isSubReply ? 'py-5 border-b border-gray-100' : 'py-3'}`}>
			{/* Avatar */}
			<div className="flex-shrink-0 mt-0.5">
				<img src={authorPhoto} alt={authorName} className={`rounded-full object-cover ${isSubReply ? 'w-8 h-8' : 'w-10 h-10'}`} />
			</div>

			{/* Body */}
			<div className="flex-1 min-w-0">
				{/* Author + date */}
				<div className="flex items-center gap-1.5">
					<span className="text-[13px] font-semibold text-gray-800">@{authorName}</span>
					<LuDot className="text-gray-300 text-[10px]" />
					<span className="text-[12px] text-gray-400">{updatedOn}</span>
				</div>

				{/* Content */}
				<p className="mt-1 text-[14px] text-gray-700 leading-relaxed">{content}</p>

				{/* Actions */}
				{!isSubReply && (
					<div className="flex items-center gap-2 mt-2.5">
						{/* Reply pill button */}
						<button
							className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-cyan-50 text-[12px] text-gray-500 hover:text-cyan-600 transition-colors duration-150 font-medium"
							onClick={() => {
								if (!user) {
									setOpenAuthForm(true)
									return
								}
								setShowReplyForm(prev => !prev)
							}}
						>
							<LuReply className="text-[13px]" />
							<span>Reply</span>
						</button>

						{/* Replies count pill button */}
						{replies?.length > 0 && (
							<button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-cyan-50 text-[12px] text-gray-500 hover:text-cyan-600 transition-colors duration-150 font-medium" onClick={() => setShowSubReplies(prev => !prev)}>
								<span>
									{replies.length} {replies.length === 1 ? 'reply' : 'replies'}
								</span>
								<LuChevronDown className={`text-[13px] transition-transform duration-200 ${showSubReplies ? 'rotate-180' : ''}`} />
							</button>
						)}
					</div>
				)}

				{/* Delete — top right on hover */}
				{onDelete && (
					<button className="absolute top-5 right-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all duration-150" onClick={() => onDelete(commentId)}>
						<LuTrash2 className="text-[13px]" />
					</button>
				)}

				{/* Reply input */}
				{!isSubReply && showReplyForm && (
					<div className="mt-3">
						<CommentReplyInput user={user} authorName={authorName} content={content} replyText={replyText} setReplyText={setReplyText} handleAddReply={handleAddReply} handleCancelReply={handleCancelReply} disableAutoGen />
					</div>
				)}

				{/* Sub-replies */}
				{showSubReplies && replies?.length > 0 && (
					<div className="mt-3 pl-4 border-l-2 border-gray-100">
						{replies.map((comment, index) => (
							<div key={comment._id} className={index !== 0 ? 'mt-1' : ''}>
								<CommentInfoCard authorName={comment.author.name} authorPhoto={comment.author.profileImageUrl} content={comment.content} post={comment.post} replies={comment.replies || []} isSubReply updatedOn={comment.updatedAt ? moment(comment.updatedAt).format('Do MMM YYYY') : '-'} onDelete={() => onDelete(comment._id)} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default CommentInfoCard
