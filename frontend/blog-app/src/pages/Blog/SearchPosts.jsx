import moment from 'moment'
import { useEffect, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BlogLayout from '../../components/Layouts/BlogLayout/BlogLayout'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import BlogPostSummaryCard from './components/BlogPostSummaryCard'

const SearchPosts = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')

    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.POSTS.SEARCH, {
                params: { q: query },
            })
            if (response.data) {
                setSearchResult(response.data || [])
            }
        } catch (error) {
            console.error('Error searching: ', error)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = post => {
        navigate(`/${post.slug}`)
    }

    useEffect(() => {
        if (query) handleSearch()
        return () => {}
    }, [query])

    return (
        <BlogLayout>
            {/* Header */}
            {!loading && searchResult.length > 0 && (
                <p className="text-gray-500 text-[15px] mb-6">
                    Showing search results matching <span className="text-gray-900 font-semibold">"{query}"</span>
                </p>
            )}

            {/* Results */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : searchResult.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchResult.map(item => (
                        <BlogPostSummaryCard key={item._id} title={item.title} coverImageUrl={item.coverImageUrl} description={item.content} tags={item.tags} updatedOn={item.updatedAt ? moment(item.updatedAt).format('Do MMM YYYY') : '-'} authorName={item.author.name} authProfileImg={item.author.profileImageUrl} onClick={() => handleClick(item)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                        <LuSearch className="text-gray-300 text-2xl" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        No results for <span className="text-gray-600 font-medium">"{query}"</span>
                    </p>
                </div>
            )}
        </BlogLayout>
    )
}

export default SearchPosts
