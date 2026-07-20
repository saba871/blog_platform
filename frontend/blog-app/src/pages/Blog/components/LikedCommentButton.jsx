import clsx from 'clsx'
import { useState } from 'react'
import { LuMessageCircleDashed } from 'react-icons/lu'
import { PiHandsClapping } from 'react-icons/pi'
import { API_PATHS } from '../../../utils/apiPath'
import axiosInstance from '../../../utils/axiosInstance'

const LikedCommentButton = ({ postId, likes, comments }) => {
    const [postLikes, setPostLikes] = useState(likes || 0)
    const [liked, setLiked] = useState(false)

    const handleClick = async () => {
        if (!postId) return

        try {
            const response = await axiosInstance.post(API_PATHS.POSTS.LIKE(postId))
            if (response.data) {
                setPostLikes(prevState => prevState + 1)
                setLiked(true)
                setTimeout(() => setLiked(false), 500)
            }
        } catch (error) {
            console.error('Error: ', error)
        }
    }

    return (
        <div className="inline-flex items-center bg-gray-900 rounded-full px-4 py-2 gap-3">
            <button onClick={handleClick} className="flex items-center gap-1.5 cursor-pointer">
                <PiHandsClapping className={clsx('text-[18px] transition-all duration-300', liked ? 'text-cyan-400 scale-125' : 'text-white')} />
                <span className="text-white text-sm">{postLikes}</span>
            </button>

            <div className="w-px h-4 bg-gray-600" />

            <button className="flex items-center gap-1.5 cursor-pointer">
                <LuMessageCircleDashed className="text-[18px] text-white" />
                <span className="text-white text-sm">{comments || 0}</span>
            </button>
        </div>
    )
}

export default LikedCommentButton
