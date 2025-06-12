'use client'

import React from 'react'
import { dailyData } from './ReportChart'

const ReportTable = () => {
  return (
    <div className="bg-white  rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 ">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 ">
            Sales Volume
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr>
              {['ticket Number','Date', 'Routes', 'Ticket Price', 'Discount', 'Total', 'Status'].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {dailyData.map((day, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ">
                  {day.ticketNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.routes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.discount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${day.status === 'success' ? 'bg-green-100 text-green-800' : ''}
                      ${day.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${day.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      ${day.status === 'refunded' ? 'bg-blue-100 text-blue-800' : ''}
                    `}
                  >
                    {day.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReportTable
