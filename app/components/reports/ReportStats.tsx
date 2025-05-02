'use client'

import React from 'react'

const ReportStats = ({ reportType }: { reportType: string }) => {
  if (reportType !== 'overview') return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Total Passengers"
        value="2,780"
        change="↑ 12.5%"
        sub="vs. previous period"
        color="green"
      />
      <StatCard
        title="Total Revenue"
        value="$83,400"
        change="↑ 8.3%"
        sub="vs. previous period"
        color="green"
      />
      <StatCard
        title="Average Ticket Price"
        value="$30.00"
        change="↓ 1.2%"
        sub="vs. previous period"
        color="red"
      />
    </div>
  )
}

const StatCard = ({
  title,
  value,
  change,
  sub,
  color,
}: {
  title: string
  value: string
  change: string
  sub: string
  color: 'green' | 'red'
}) => {
  return (
    <div className="bg-white  rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 ">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 ">{value}</p>
      <div className="flex items-center mt-2 text-sm">
        <span className={`text-${color}-600 `}>{change}</span>
        <span className="text-gray-500  ml-1">{sub}</span>
      </div>
    </div>
  )
}

export default ReportStats
