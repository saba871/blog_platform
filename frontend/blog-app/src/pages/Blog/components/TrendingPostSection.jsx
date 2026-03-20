import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'
import { API_PATHS } from '../../../utils/apiPath'
import { useNavigate } from 'react-router-dom'

const TrendingPostSection = () => 
{
    const navigate = useNavigate()
    const [postList, setPostList] = useState([])

    // fetch trenging posts
    const getTrendingPosts = async (params) => 
    {
        try {
            const response = await axiosInstance.get(API_PATHS.POSTS.GET_TRENDING_POSTS)
            setPostList(response?.data.length > 0 ? response.data : [])
        } catch (error) {
            console.error("Error fetching Data: ", error)
        }
    }


    // handle post click
    const handleClick = (post) =>
    {
        navigate(`/${post.slug}`)
    }

    useEffect(() => {
        getTrendingPosts()
        return () => {}
    }, [])
    return (
        <div>
            <h4 className='text-base text-black font-medium mb-3'>Recent Posts</h4>

            {postList.length > 0 &&
                postList.map((item) => (
                    <PostList 
                        key={item._id}
                        title={item.title}
                        coverImageUrl={item.coverImageUrl}
                        tags={item.tags}
                        onClick={() => handleClick(item)}
                    />
                ))}
        </div>
    )
}

export default TrendingPostSection


const PostList = ({title, coverImageUrl, tags, onClick}) => 
{
    return (
        <div className='cursor-ponter mb-3' onClick={onClick}>
            <h6 className='text-[10px] font-semibold text-sky-500'>{tags[0]?.toUpperCase() || "BLOG"}</h6>

            <div className='flex items-start gap-4 mt-2'>
                <img src={coverImageUrl} alt={title} className='w-14 h-14 object-cover' />
                <h2 className='text-sm md:text-sm font-medium mb-2 line-clamp-1'>{title}</h2>
            </div>
        </div>
    )
}