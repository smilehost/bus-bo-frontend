'use client'; // เพราะมี useState, Chart ต้อง render ฝั่ง client

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { FilterIcon, UsersIcon, CreditCardIcon, TruckIcon } from 'lucide-react';
import { JSX } from '@emotion/react/jsx-runtime';
import SkeletonDashboard from '@/app/components/Skeleton/SkeletonDashboard';

const transactionData = [
  { name: 'Cash', value: 4000, color: '#10B981' },
  { name: 'QR Code', value: 3000, color: '#6366F1' },
];

const routeData = [
  { name: 'Route A', passengers: 120, amount: 3600 },
  { name: 'Route B', passengers: 85, amount: 2550 },
  { name: 'Route C', passengers: 150, amount: 4500 },
  { name: 'Route D', passengers: 65, amount: 1950 },
];

export default function DashboardPage() {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [isLoadingskeleton, setIsLoadingskeleton] = useState(true);
      useEffect(() => {
              // Simulate fetching data (fake delay)
              const timer = setTimeout(() => setIsLoadingskeleton(false), 1000);
              return () => clearTimeout(timer);
            }, []);

  const totalPassengers = routeData.reduce((sum, route) => sum + route.passengers, 0);
  const totalAmount = routeData.reduce((sum, route) => sum + route.amount, 0);

  return (
    <>
    {isLoadingskeleton ? (
      <SkeletonDashboard />
    ) : (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 ">Dashboard</h1>
        <p className="text-gray-600 ">Today&apos;s overview of transactions and statistics</p>
      </div>

      {/* Filters */}
      <div className="bg-white  rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex items-center text-gray-500 0">
            <FilterIcon size={18} className="mr-2" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 bg-gray-50  border border-gray-300  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Companies</option>
              <option value="company1">Northern Bus Co.</option>
              <option value="company2">Southern Express</option>
              <option value="company3">Eastern Transport</option>
            </select>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="px-3 py-2 bg-gray-50  border border-gray-300  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Provinces</option>
              <option value="province1">North Province</option>
              <option value="province2">South Province</option>
              <option value="province3">East Province</option>
              <option value="province4">West Province</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Passengers"
          value={totalPassengers}
          icon={<UsersIcon size={24} className="text-green-600 " />}
          change="+8.1% from yesterday"
          iconBg="bg-green-100 "
        />
        <StatsCard
          title="Total Revenue"
          value={`$${totalAmount.toLocaleString()}`}
          icon={<CreditCardIcon size={24} className="text-blue-600 " />}
          change="+12.3% from yesterday"
          iconBg="bg-blue-100 "
        />
        <StatsCard
          title="Active Routes"
          value={routeData.length}
          icon={<TruckIcon size={24} className="text-purple-600 " />}
          change="Today"
          iconBg="bg-purple-100 "
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900  mb-4">Transactions by Payment Method</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900  mb-4">Revenue by Route</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={routeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" name="Amount ($)" fill="#F59E0B" />
                <Bar dataKey="passengers" name="Passengers" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )}
  </>
);
}
function StatsCard({ title, value, icon, change, iconBg }: { title: string; value: string | number; icon: JSX.Element; change: string; iconBg: string }) {
  return (
    <div className="bg-white  rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex items-center justify-center h-12 w-12 rounded-md ${iconBg}`}>
          {icon}
        </div>
        <div className="ml-5">
          <h2 className="text-sm font-medium text-gray-500 ">{title}</h2>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 ">{value}</p>
            <p className="ml-2 text-sm text-green-600 ">{change}</p>
          </div>
        </div>
      </div>
    </div>
  );
}