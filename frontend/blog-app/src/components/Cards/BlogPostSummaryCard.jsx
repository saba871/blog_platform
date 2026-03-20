import React from 'react'
import { LuEye, LuHeart, LuTrash2 } from 'react-icons/lu'

const BlogPostSummaryCard = ({
    title,
    imgUrl,
    updatedOn,
    tags,
    likes,
    views,
    onClick,
    onDelete,
}) => {
    return (
        <div
            className="flex items-start gap-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 mb-4 cursor-pointer group"
            onClick={onClick}
        >
            {/* Cover Image */}
            <img
                src={imgUrl}
                alt={title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[14px] md:text-[15px] text-gray-900 font-semibold leading-snug line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    {/* Date */}
                    <span className="text-[11px] text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                        {updatedOn}
                    </span>

                    <div className="h-4 w-[1px] bg-gray-200" />

                    {/* Stats */}
                    <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[11px] text-sky-700 font-medium bg-sky-50 px-2.5 py-1 rounded-full">
                            <LuEye size={13} className="text-sky-500" /> {views}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-full">
                            <LuHeart size={13} className="text-rose-400" />{' '}
                            {likes}
                        </span>
                    </div>

                    <div className="h-4 w-[1px] bg-gray-200" />

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {tags.map((tag, index) => (
                            <span
                                key={`tag_${index}`}
                                className="text-[11px] text-cyan-700 font-medium bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delete Button */}
            <button
                className="hidden md:group-hover:flex items-center gap-1.5 text-[12px] text-rose-500 font-medium bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-colors duration-150 cursor-pointer flex-shrink-0"
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                }}
            >
                <LuTrash2 size={13} />
                <span className="hidden md:block">Delete</span>
            </button>
        </div>
    )
}

export default BlogPostSummaryCard
