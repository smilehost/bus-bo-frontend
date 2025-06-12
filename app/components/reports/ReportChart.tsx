'use client'

import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts'

export const dailyData = [
  {
    date: '2023-05-10 16:00',
    routes: 'Northern Express',
    ticketNumber: 1,
    price: 24.00,
    discount: 4,
    total: 20.00,
    status: 'success'
  },
  {
    date: '2023-05-10 16:15',
    routes: 'Eastern Line',
    ticketNumber: 2,
    price: 30.00,
    discount: 5,
    total: 25.00,
    status: 'success'
  },
  {
    date: '2023-05-10 16:30',
    routes: 'Southern Express',
    ticketNumber: 3,
    price: 20.00,
    discount: 0,
    total: 20.00,
    status: 'cancelled'
  },
  {
    date: '2023-05-10 17:00',
    routes: 'Central Shuttle',
    ticketNumber: 4,
    price: 15.00,
    discount: 3,
    total: 12.00,
    status: 'success'
  },
  {
    date: '2023-05-10 17:30',
    routes: 'Northern Express',
    ticketNumber: 5,
    price: 24.00,
    discount: 4,
    total: 20.00,
    status: 'success'
  },
  {
    date: '2023-05-10 18:00',
    routes: 'Eastern Line',
    ticketNumber: 6,
    price: 30.00,
    discount: 10,
    total: 20.00,
    status: 'success'
  },
  {
    date: '2023-05-10 18:15',
    routes: 'Southern Express',
    ticketNumber: 7,
    price: 25.00,
    discount: 5,
    total: 20.00,
    status: 'refunded'
  },
  {
    date: '2023-05-10 18:30',
    routes: 'Central Shuttle',
    ticketNumber: 8,
    price: 18.00,
    discount: 2,
    total: 16.00,
    status: 'success'
  },
  {
    date: '2023-05-10 19:00',
    routes: 'Northern Express',
    ticketNumber: 9,
    price: 24.00,
    discount: 4,
    total: 20.00,
    status: 'success'
  }
];

  const companyData = [
    {
      name: 'Northern Bus Co.',
      passengers: 850,
      revenue: 25500,
    },
    {
      name: 'Southern Express',
      passengers: 720,
      revenue: 21600,
    },
    {
      name: 'Eastern Transport',
      passengers: 650,
      revenue: 19500,
    },
    {
      name: 'Western Motors',
      passengers: 560,
      revenue: 16800,
    },
  ]
  const routeData = [
    {
      name: 'Northern Express',
      passengers: 850,
      revenue: 25500,
    },
    {
      name: 'Southern Route',
      passengers: 720,
      revenue: 21600,
    },
    {
      name: 'Eastern Circuit',
      passengers: 650,
      revenue: 19500,
    },
    {
      name: 'Western Line',
      passengers: 560,
      revenue: 16800,
    },
  ]
  const paymentData = [
    {
      method: 'Cash',
      transactions: 1450,
      amount: 43500,
    },
    {
      method: 'QR Code',
      transactions: 1330,
      amount: 39900,
    },
  ]

type Props = {
  reportType: 'overview' | 'company' | 'route' | 'payment'
}

const ReportChart: React.FC<Props> = ({ reportType }) => {
  if (reportType === 'overview') {
    return (
      <div className="bg-white  rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 ">Daily Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#F59E0B" />
              <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#F59E0B" name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="passengers" stroke="#3B82F6" name="Passengers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const chartData =
    reportType === 'company'
      ? companyData
      : reportType === 'route'
        ? routeData
        : paymentData

  const xKey = reportType === 'payment' ? 'method' : 'name'
  const bar1Key = reportType === 'payment' ? 'amount' : 'revenue'
  const bar2Key = reportType === 'payment' ? 'transactions' : 'passengers'

  return (
    <div className="bg-white  rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900  mb-4">
        {reportType === 'company' && 'Performance by Company'}
        {reportType === 'route' && 'Performance by Route'}
        {reportType === 'payment' && 'Performance by Payment Method'}
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis yAxisId="left" orientation="left" stroke="#F59E0B" />
            <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey={bar1Key} fill="#F59E0B" name={bar1Key === 'amount' ? 'Amount ($)' : 'Revenue ($)'} />
            <Bar yAxisId="right" dataKey={bar2Key} fill="#3B82F6" name={bar2Key === 'transactions' ? 'Transactions' : 'Passengers'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ReportChart