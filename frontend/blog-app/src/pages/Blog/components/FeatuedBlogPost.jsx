import React from 'react'

const FeaturedBlogPost = ({ title, coverImageUrl, description, tags = [], updatedOn, authorName, authProfileImg, onClick }) => {
    return (
        <article onClick={onClick} className="group grid grid-cols-12 bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200">
            {/* Cover image */}
            <div className="col-span-5 overflow-hidden">
                <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" style={{ minHeight: '280px' }} />
            </div>

            {/* Content */}
            <div className="col-span-7 flex flex-col justify-between p-8">
                {/* Tags */}
                <div className="flex items-center flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-sky-50 text-sky-600 text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border border-sky-100">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title & description */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-3 leading-snug">{title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{description}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-5" />

                {/* Author */}
                <div className="flex items-center gap-3">
                    <img src={authProfileImg} alt={authorName} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">{authorName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{updatedOn}</p>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default FeaturedBlogPost
