import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogPostSummaryCard = ({ title, coverImageUrl, description, tags = [], updatedOn, authorName, authProfileImg, onClick }) => {
    const navigate = useNavigate()

    return (
        <article
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200 flex flex-col"
        >
            {/* Cover image */}
            <img
                src={coverImageUrl}
                alt={title}
                className="w-full h-64 object-cover"
            />

            {/* Content */}
            <div className="flex flex-col flex-1 justify-between p-6">

                {/* Tags */}
                <div className="flex items-center flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-sky-50 text-sky-600 text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border border-sky-100"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/tag/${tag}`)
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title & description */}
                <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-4" />

                {/* Author */}
                <div className="flex items-center gap-3">
                    <img
                        src={authProfileImg}
                        alt={authorName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{authorName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{updatedOn}</p>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default BlogPostSummaryCard