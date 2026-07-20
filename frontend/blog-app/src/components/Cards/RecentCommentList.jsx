import moment from 'moment'
import { LuDot } from 'react-icons/lu'

const RecentCommentsList = ({ comments }) => {
    return (
        <div className="mt-4">
            <ul className="space-y-4">
                {comments
                    ?.filter(comment => comment.post)
                    ?.slice(0, 10)
                    ?.map(comment => (
                        <li key={comment._id} className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-none">
                            <div className="flex items-center gap-2">
                                <img src={comment.author?.profileImageUrl} alt={comment.author?.name} className="w-9 h-9 rounded-full object-cover" />
                                <p className="font-medium text-[13px] text-gray-500">@{comment.author?.name}</p>
                                <LuDot className="text-gray-400" />
                                <span className="text-[12px] text-gray-500">{moment(comment.updatedAt).format('Do MMM YYYY')}</span>
                            </div>

                            <p className="text-sm text-gray-800 ml-11">{comment.content}</p>

                            {comment.post?.coverImageUrl && (
                                <div className="flex items-center gap-2 ml-11">
                                    <img src={comment.post.coverImageUrl} alt={comment.post.title} className="w-8 h-8 rounded-md object-cover" />
                                    <p className="text-[13px] text-gray-600 line-clamp-1">{comment.post.title}</p>
                                </div>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default RecentCommentsList
