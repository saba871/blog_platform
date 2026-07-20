import React from 'react'
import { LuSparkles, LuX } from 'react-icons/lu'

const Drawer = ({ isOpen, onClose, title, children }) => {
    return (
        <div className={`fixed flex flex-col top-[70px] right-0 z-40 h-[calc(100dvh-70px)] p-4 overflow-y-auto transition-transform bg-white w-full md:w-[35vw] shadow-2xl shadow-cyan-800/10 border-l border-gray-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} tabIndex="-1" aria-labelledby="drawer-right-label">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-xs text-cyan-500 font-medium">
                        <LuSparkles className="text-sm" />
                        Summarize this Post
                    </span>
                    <h5 id="drawer-right-label" className="text-sm font-semibold text-gray-800">
                        {title}
                    </h5>
                </div>

                <button type="button" onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150">
                    <LuX className="text-base" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1">{children}</div>
        </div>
    )
}

export default Drawer
