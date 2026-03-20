import React, { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import moment from 'moment'
import {
    LuChartLine,
    LuCheckCheck,
    LuGalleryVerticalEnd,
    LuHeart,
} from 'react-icons/lu'
import DashboardSummaryCard from '../../components/Cards/DashboardSummaryCard'
import TagInsights from '../../components/Cards/TagInsights'
import TopPostsCard from '../../components/Cards/TopPostsCard'
import RecentCommentList from '../../components/Cards/RecentCommentList'

const Dashboard = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [dashboardData, setDashboardData] = useState(null)
    const [maxViews, setMaxViews] = useState(0)

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.DASHBOARD.GET_DASHBOARD_DATA,
            )
            if (response.data) {
                setDashboardData(response.data)
                const topPosts = response.data?.topPosts || []
                const totalViews = Math.max(...topPosts.map((e) => e.views), 1)
                setMaxViews(totalViews)
            }
        } catch (error) {
            console.error('Error Fetching Users: ', error)
        }
    }

    useEffect(() => {
        getDashboardData()
    }, [])

    return (
        <DashboardLayout activeMenu="Dashboard">
            {dashboardData && (
                <div className="px-0 py-5 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="mb-5">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                Good Morning, {user.name} 👋
                            </h2>
                            <p className="text-xs md:text-[13px] text-gray-400 mt-1">
                                {moment().format('dddd, MMM YYYY')}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                            <DashboardSummaryCard
                                icon={<LuGalleryVerticalEnd />}
                                label="Total Posts"
                                value={dashboardData?.stats?.totalPosts || 0}
                                bgColor="bg-sky-50"
                                color="text-sky-500"
                            />
                            <DashboardSummaryCard
                                icon={<LuCheckCheck />}
                                label="Published"
                                value={dashboardData?.stats?.published || 0}
                                bgColor="bg-emerald-50"
                                color="text-emerald-500"
                            />
                            <DashboardSummaryCard
                                icon={<LuChartLine />}
                                label="Total Views"
                                value={dashboardData?.stats?.totalViews || 0}
                                bgColor="bg-violet-50"
                                color="text-violet-500"
                            />
                            <DashboardSummaryCard
                                icon={<LuHeart />}
                                label="Total Likes"
                                value={dashboardData?.stats?.totalLikes || 0}
                                bgColor="bg-rose-50"
                                color="text-rose-500"
                            />
                        </div>
                    </div>

                    {/* Middle Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                        {/* Tag Insights */}
                        <div className="col-span-12 md:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h5 className="text-[15px] font-semibold text-gray-800 mb-4">
                                Tag Insights
                            </h5>
                            <TagInsights
                                tagUsage={dashboardData?.tagUsage || []}
                            />
                        </div>

                        {/* Top Posts */}
                        <div className="col-span-12 md:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h5 className="text-[15px] font-semibold text-gray-800 mb-4">
                                Top Posts
                            </h5>
                            <div className="space-y-3">
                                {dashboardData?.topPosts
                                    ?.slice(0, 3)
                                    ?.map((post) => (
                                        <TopPostsCard
                                            key={post._id}
                                            title={post.title}
                                            coverImageUrl={post.coverImageUrl}
                                            views={post.views}
                                            likes={post.likes}
                                            maxViews={maxViews}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Comments */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h5 className="text-[15px] font-semibold text-gray-800 mb-4">
                            Recent Comments
                        </h5>
                        <RecentCommentList
                            comments={dashboardData.recentComments || []}
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default Dashboard
