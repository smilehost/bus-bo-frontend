'use client'

import React from 'react'
import { dailyData } from './ReportChart'

const ReportTable = () => {
  return (
    <div className="bg-white  rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 ">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 ">
            Detailed Data
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50 ">
            <tr>
              {['ticket Number', 'Passengers', 'Ticket Price', 'Routes'].map((header) => (
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
                  {day.tickets}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.passengers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  ${(day.revenue / day.passengers).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                  {day.routes}
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
