'use client'

import ReportChart from '@/app/components/reports/ReportChart'
import ReportFilters from '@/app/components/reports/ReportFilters'
import ReportHeader from '@/app/components/reports/ReportHeader'
import ReportStats from '@/app/components/reports/ReportStats'
import ReportTable from '@/app/components/reports/ReportTable'
import React, { useState } from 'react'


const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("all");
  const [customReDate, setCustomReDate] = useState(""); // <-- เพิ่มแยก

  const [groupBy, setGroupBy] = useState('day')
  const [reportType, setReportType] = useState<'overview' | 'company' | 'route' | 'payment'>('overview')


  return (
    <div className="">
      <ReportHeader />
      <ReportFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        customReDate={customReDate}
        setCustomReDate={setCustomReDate}
      />
      {/* <ReportStats reportType={reportType} />
      <ReportChart reportType={reportType} /> */}
      <ReportTable />
    </div>
  )
}

export default ReportsPage
