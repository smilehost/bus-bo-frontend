'use client'

import ReportChart from '@/app/components/reports/ReportChart'
import ReportFilters from '@/app/components/reports/ReportFilters'
import ReportHeader from '@/app/components/reports/ReportHeader'
import ReportStats from '@/app/components/reports/ReportStats'
import ReportTable from '@/app/components/reports/ReportTable'
import React, { useState } from 'react'


const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({ start: '2023-05-10', end: '2023-05-16' })
  const [groupBy, setGroupBy] = useState('day')
  const [reportType, setReportType] = useState<'overview' | 'company' | 'route' | 'payment'>('overview')

  return (
    <div className="">
      <ReportHeader />
      <ReportFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        reportType={reportType}
        setReportType={(value: string) => setReportType(value as "overview" | "company" | "route" | "payment")}
      />
      <ReportStats reportType={reportType} />
      <ReportChart reportType={reportType} />
      <ReportTable />
    </div>
  )
}

export default ReportsPage
