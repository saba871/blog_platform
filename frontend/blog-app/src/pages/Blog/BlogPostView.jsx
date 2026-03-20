import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuCircleAlert, LuDot, LuSparkles } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import CommentInfoCard from '../../components/CommentInfoCard'
import CommentReplyInput from '../../components/Inputs/CommentReplyInput'
import BlogLayout from '../../components/Layouts/BlogLayout/BlogLayout'
import SkeletonLoader from '../../components/Loader/SkeletonLoader'
import { UserContext } from '../../context/userContext'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import { sanitizeMarkdown } from '../../utils/helper'
import Drawer from './components/Drawer'
import LikedCommentButton from './components/LikedCommentButton'
import MarkDownContent from './components/MarkDownContent'
import SharePost from './components/SharePost'
import TrendingPostSection from './components/TrendingPostSection'

const BlogPostView = () => {
	const { slug } = useParams()
	const navigate = useNavigate()

	const [blogPostData, setBlogPostData] = useState(null)
	const [comments, setComments] = useState(null)

	const { user, setOpenAuthForm } = useContext(UserContext)

	const [replyText, setReplyText] = useState('')
	const [showReplyForm, setShowReplyForm] = useState(false)

	const [openSummarizeDrawer, setOpenSummarizeDrawer] = useState(false)
	const [summaryContent, setSummaryContent] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')

	const [setOpenDeleteAlert] = useState({
		open: false,
		data: null,
	})

	const fetchPostDetailBySlug = async () => {
		try {
			const response = await axiosInstance.get(API_PATHS.POSTS.GET_BY_SLUG(slug))
			if (response.data) {
				const data = response.data
				setBlogPostData(data)
				fetchCommentPostById(data._id)
				incrementViews(data._id)
			}
		} catch (error) {
			console.error('Error: ', error)
		}
	}

	const fetchCommentPostById = async postId => {
		try {
			const response = await axiosInstance.get(API_PATHS.COMMENTS.GET_ALL_BY_POST(postId))
			if (response.data) {
				setComments(response.data)
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}

	const generateBlogPostSummary = async () => {
		try {
			setErrorMsg('')
			setSummaryContent(null)
			setIsLoading(true)
			setOpenSummarizeDrawer(true)

			const response = await axiosInstance.post(API_PATHS.AI.GENERATE_POST_SUMMARY, {
				content: blogPostData.content || '',
			})

			if (response.data) {
				setSummaryContent(response.data)
			}
		} catch (error) {
			setSummaryContent(null)
			setErrorMsg('Failed to generate summary, please try again later')
			console.error('Error: ', error)
		} finally {
			setIsLoading(false)
		}
	}

	const incrementViews = async postId => {
		if (!postId) return
		try {
			await axiosInstance.post(API_PATHS.POSTS.INCREMENT_VIEW(postId))
		} catch (error) {
			console.error('Error: ', error)
		}
	}

	const handleCancelReply = () => {
		setReplyText('')
		setShowReplyForm(false)
	}

	const handleAddReply = async () => {
		if (!replyText.trim()) return

		try {
			const response = await axiosInstance.post(API_PATHS.COMMENTS.ADD(blogPostData._id), { content: replyText })
			if (response.data) {
				toast.success('Comment added!')
				setReplyText('')
				setShowReplyForm(false)
				fetchCommentPostById(blogPostData._id)
			}
		} catch (error) {
			console.error('Error: ', error)
			toast.error('Failed to add comment')
		}
	}

	useEffect(() => {
		fetchPostDetailBySlug()
		return () => {}
	}, [slug])

	return (
		<BlogLayout activeMenu="">
			{blogPostData && (
				<>
					<title>{blogPostData.title}</title>
					<meta name="description" content={blogPostData.title} />
					<meta property="og:title" content={blogPostData.title} />
					<meta property="og:image" content={blogPostData.coverImageUrl} />
					<meta property="og:type" content="article" />

					<div className="grid grid-cols-12 gap-8 relative">
						<div className="col-span-12 md:col-span-8 relative">
							<h1 className="text-lg md:text-2xl font-bold mb-2 line-clamp-3">{blogPostData.title}</h1>

							<div className="flex items-center gap-1 flex-wrap mt-3 mb-5">
								<span className="text-[13px] text-gray-500 font-medium">{moment(blogPostData.updatedAt || '').format('Do MMM yyyy')}</span>
								<LuDot className="text-xl text-gray-400" />

								<div className="flex items-center flex-wrap gap-2">
									{blogPostData.tags.slice(0, 3).map((tag, index) => (
										<button
											key={index}
											className="bg-sky-200/50 text-sky-800/80 text-xs font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer"
											onClick={e => {
												e.preventDefault()
												navigate(`/tag/${tag}`)
											}}
										>
											#{tag}
										</button>
									))}
								</div>

								<LuDot className="text-xl text-gray-400" />

								<button className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-cyan-400 text-xs text-white font-medium px-3 py-0.5 rounded-full text-nowrap cursor-pointer hover:scale-[1.02] transition-all my-1" onClick={generateBlogPostSummary}>
									<LuSparkles />
									Summarize Post
								</button>
							</div>

							<img src={blogPostData.coverImageUrl || ''} alt={blogPostData.title} className="w-full h-96 object-cover mb-6 rounded-lg" />

							<MarkDownContent content={sanitizeMarkdown(blogPostData?.content || '')} />

							<div className="flex items-center justify-between mt-6">
								<LikedCommentButton postId={blogPostData._id || ''} likes={blogPostData.likes || 0} comments={comments?.length || 0} />
								<SharePost title={blogPostData.title} />
							</div>

							<div className="mt-10 pt-6 border-t border-gray-100">
								<div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl">
									<h4 className="text-base font-bold text-gray-900">Comments</h4>
									<button
										className="px-5 py-2 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-medium transition-all duration-150 shadow-sm"
										onClick={() => {
											if (!user) {
												setOpenAuthForm(true)
												return
											}
											setShowReplyForm(true)
										}}
									>
										Add Comment
									</button>
								</div>

								{showReplyForm && (
									<div className="mt-4 p-4 rounded-xl border border-sky-100 bg-sky-50/40">
										<CommentReplyInput user={user} authorName={user.name} content={''} replyText={replyText} setReplyText={setReplyText} handleAddReply={handleAddReply} handleCancelReply={handleCancelReply} disableAutoGen type="new" />
									</div>
								)}

								{comments?.map(comment => (
									<CommentInfoCard
										key={comment._id}
										commentId={comment._id || null}
										authorName={comment.author.name}
										authorPhoto={comment.author.profileImageUrl}
										content={comment.content}
										updatedOn={comment.updatedAt ? moment(comment.updatedAt).format('Do MMM yyyy') : '-'}
										post={comment.post}
										replies={comment.replies || []}
										getAllComments={() => fetchCommentPostById(blogPostData._id)}
										onDelete={() =>
											setOpenDeleteAlert({
												open: true,
												data: comment._id,
											})
										}
									/>
								))}
							</div>
						</div>

						<div className="col-span-12 md:col-span-4">
							<TrendingPostSection />
						</div>
					</div>

					<Drawer isOpen={openSummarizeDrawer} onClose={() => setOpenSummarizeDrawer(false)} title={!isLoading && summaryContent?.title}>
						{errorMsg && (
							<p className="flex gap-2 text-sm text-amber-600 font-medium">
								<LuCircleAlert className="mt-1" />
								{errorMsg}
							</p>
						)}
						{isLoading && <SkeletonLoader className="" />}
						{!isLoading && summaryContent && <MarkDownContent content={summaryContent?.summary || ''} />}
					</Drawer>
				</>
			)}
		</BlogLayout>
	)
}

export default BlogPostView
