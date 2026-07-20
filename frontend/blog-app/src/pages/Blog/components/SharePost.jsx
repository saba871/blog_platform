import { useState } from 'react'
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from 'react-share'
import { LuCheck, LuCopy } from 'react-icons/lu'

const SharePost = ({ title }) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const [isCopied, setIsCopied] = useState(false)

    const handleCopyClick = () => {
        navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            })
            .catch(error => {
                console.error('Failed To Copy.: ', error)
            })
    }

    return (
        <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Share this post</p>
            <div className="flex items-center gap-2 flex-wrap">
                <FacebookShareButton url={shareUrl} quote={title}>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-medium transition-colors duration-150">
                        <FacebookIcon size={16} round />
                        <span>Facebook</span>
                    </div>
                </FacebookShareButton>

                <TwitterShareButton url={shareUrl} title={title}>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] text-xs font-medium transition-colors duration-150">
                        <TwitterIcon size={16} round />
                        <span>Twitter</span>
                    </div>
                </TwitterShareButton>

                <LinkedinShareButton url={shareUrl} title={title}>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-xs font-medium transition-colors duration-150">
                        <LinkedinIcon size={16} round />
                        <span>LinkedIn</span>
                    </div>
                </LinkedinShareButton>

                <button onClick={handleCopyClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium transition-colors duration-150">
                    {isCopied ? (
                        <>
                            <LuCheck size={14} className="text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <LuCopy size={14} />
                            <span>Copy Link</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default SharePost
