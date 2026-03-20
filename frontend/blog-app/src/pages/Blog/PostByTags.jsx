import React, { useEffect, useState } from 'react';
import BlogLayout from '../../components/Layouts/BlogLayout/BlogLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import BlogPostSummaryCard from './components/BlogPostSummaryCard';
import moment from 'moment';
import TrendingPostSection from './components/TrendingPostSection';
import { useNavigate, useParams } from 'react-router-dom';
import { BLOG_NAVBAR_DATA } from '../../utils/data';

const PostByTags = () => {
  const { tagName } = useParams();
  const navigate = useNavigate();
  const [blogPostList, setBlogPostList] = useState([]);

  // ✅ tagName-ის მიხედვით active menu id-ის პოვნა
  const getActiveMenu = () => {
    const found = BLOG_NAVBAR_DATA.find(
      (item) => item.path === `/tag/${tagName}`
    );
    return found?.id || '';
  };

  async function getPostsByTag() {
    try {
      const response = await axiosInstance.get(
        API_PATHS.POSTS.GET_BY_TAG(tagName)
      );
      setBlogPostList(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  function handleClick(post) {
    navigate(`/${post.slug}`);
  }

  useEffect(() => {
    getPostsByTag();
    return () => {};
  }, [tagName]);

  return (
    // ✅ activeMenu გადაეცა
    <BlogLayout activeMenu={getActiveMenu()}>
      {/* Banner */}
      <div className="w-full bg-gradient-to-r from-sky-100 via-cyan-50 to-blue-100 rounded-2xl py-10 mb-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-1"># {tagName}</h3>
        <p className="text-sm text-gray-500">
          Showing {blogPostList.length} post
          {blogPostList.length !== 1 ? 's' : ''} tagged with{' '}
          <span className="font-medium">#{tagName}</span>
        </p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-9">
          {blogPostList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPostList.map((item) => (
                <BlogPostSummaryCard
                  key={item._id}
                  title={item.title}
                  coverImageUrl={item.coverImageUrl}
                  description={item.content}
                  tags={item.tags}
                  updatedOn={
                    item.updatedAt
                      ? moment(item.updatedAt).format('Do MMM YYYY')
                      : '-'
                  }
                  authorName={item.author.name}
                  authProfileImg={item.author.profileImageUrl}
                  onClick={() => handleClick(item)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-500 text-sm">
                No posts found for{' '}
                <span className="text-sky-500 font-medium">#{tagName}</span>
              </p>
            </div>
          )}
        </div>

        <div className="col-span-12 md:col-span-3">
          <TrendingPostSection />
        </div>
      </div>
    </BlogLayout>
  );
};

export default PostByTags;
