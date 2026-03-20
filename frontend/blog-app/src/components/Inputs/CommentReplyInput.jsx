import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import {
  LuLoaderCircle,
  LuReply,
  LuSend,
  LuWandSparkles,
} from 'react-icons/lu';
import Input from './Input';

const CommentReplyInput = ({
  user,
  authorName,
  content,
  replyText,
  setReplyText,
  handleAddReply,
  handleCancelReply,
  disableAutoGen,
  type = 'reply',
}) => {
  const [loading, setLoading] = useState(false);

  const generateReply = async () => {
    setLoading(true);
    try {
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_COMMENT_REPLY,
        {
          author: { name: authorName },
          content,
        }
      );
      const generatedReply = aiResponse.data;
      if (generatedReply?.length > 0) {
        setReplyText(generatedReply);
      }
    } catch (error) {
      console.error('Something is wrong. Please try again: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <img
          src={user.profileImageUrl}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100 mt-1"
        />

        {/* Input + Actions */}
        <div className="flex-1 min-w-0">
          <Input
            value={replyText}
            onChange={({ target }) => setReplyText(target.value)}
            label={type === 'new' ? authorName : `Reply to ${authorName}`}
            placeholder={type === 'new' ? 'Message' : 'Add a reply'}
            type="text"
          />

          <div className="flex items-center gap-2 mt-2">
            {/* AI Generate */}
            {!disableAutoGen && (
              <button
                className="flex items-center gap-1.5 text-[12px] font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full hover:bg-violet-500 hover:text-white transition-colors duration-150 disabled:opacity-50"
                disabled={loading}
                onClick={generateReply}
              >
                {loading ? (
                  <LuLoaderCircle size={13} className="animate-spin" />
                ) : (
                  <LuWandSparkles size={13} />
                )}
                {loading ? 'Generating...' : 'Generate Reply'}
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              {/* Cancel */}
              <button
                className="text-[12px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-150"
                disabled={loading}
                onClick={handleCancelReply}
              >
                Cancel
              </button>

              {/* Submit */}
              <button
                className="flex items-center gap-1.5 text-[12px] font-medium text-sky-700 bg-sky-50 px-3 py-1 rounded-full hover:bg-sky-500 hover:text-white transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={replyText?.length === 0 || loading}
                onClick={handleAddReply}
              >
                {type === 'new' ? <LuSend size={13} /> : <LuReply size={13} />}
                {type === 'new' ? 'Add' : 'Reply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentReplyInput;
