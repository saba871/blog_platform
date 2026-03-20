import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart'

const COLORS = [
    '#0096cc',
    '#00a9e6',
    '#00bcff',
    '#1ac3ff',
    '#33c9ff',
    '#4dd0ff',
    '#66d7ff',
]

const TagCloud = ({ tags }) => {
    const maxCount = Math.max(...tags.map((tag) => tag.count), 1)

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
                const fontSize = 12 + (tag.count / maxCount) * 5

                return (
                    <span
                        key={tag.name}
                        className="font-medium text-sky-700 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors duration-150 cursor-default"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        #{tag.name}
                    </span>
                )
            })}
        </div>
    )
}

const TagInsights = ({ tagUsage }) => {
    const proccessData = (() => {
        if (!tagUsage) return []

        const sorted = [...tagUsage].sort((a, b) => b.count - a.count)
        const topFour = sorted.slice(0, 4)
        const others = sorted.slice(4)

        const othersCount = others.reduce((sum, item) => sum + item.count, 0)

        const finalData = topFour.map((item) => ({
            ...item,
            name: item.tag || '',
        }))

        if (othersCount > 0) {
            finalData.push({ name: 'Others', count: othersCount })
        }

        return finalData
    })()

    return (
        <div className="grid grid-cols-12 gap-4 mt-2">
            {/* Pie Chart */}
            <div className="col-span-12 md:col-span-7 flex items-center justify-center">
                <CustomPieChart data={proccessData} colors={COLORS} />
            </div>

            {/* Tag Cloud */}
            <div className="col-span-12 md:col-span-5 flex items-center">
                <TagCloud
                    tags={
                        tagUsage.slice(0, 15).map((item) => ({
                            ...item,
                            name: item.tag || '',
                        })) || []
                    }
                />
            </div>
        </div>
    )
}

export default TagInsights
